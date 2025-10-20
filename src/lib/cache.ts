// cache.ts
// Hybrid cache: in-memory + (localStorage | sessionStorage) + SWR + LRU + in-flight dedupe
export type CacheEntry<T> = {
  data: T;
  // created timestamp
  timestamp: number;
  // last time accessed (for LRU)
  lastAccess: number;
  // how many times accessed (optional/statistics)
  accessCount: number;
  // optional per-entry ttl (ms). If undefined, use global/default in methods.
  ttl?: number;
};

const CACHE_PREFIX = "useFetchCache:";
const MAX_MEMORY_ENTRIES_DEFAULT = 100;
const STALE_RATIO_DEFAULT = 0.5;
const ENABLE_LOG_DEFAULT = typeof process !== "undefined" && process.env && process.env.NODE_ENV !== "production";

function safeLog(...args: any[]) {
  if (cacheConfig.enableLogging) console.warn("[cache]", ...args);
}

// detect storage (localStorage -> sessionStorage -> none)
const storage: Storage | null = (() => {
  try {
    localStorage.setItem("__cache_test__", "1");
    localStorage.removeItem("__cache_test__");
    return localStorage;
  } catch {
    try {
      sessionStorage.setItem("__cache_test__", "1");
      sessionStorage.removeItem("__cache_test__");
      return sessionStorage;
    } catch {
      return null;
    }
  }
})();

const memoryCache = new Map<string, CacheEntry<any>>();
// in-flight fetch dedupe: key -> promise
const inflight = new Map<string, Promise<any>>();

// global configurable options, can diubah lewat cache.configure(...)
const cacheConfig = {
  maxMemoryEntries: MAX_MEMORY_ENTRIES_DEFAULT,
  staleRatio: STALE_RATIO_DEFAULT,
  enableLogging: ENABLE_LOG_DEFAULT,
};

export const cache = {
  /**
   * Configure cache global options
   */
  configure(opts: Partial<typeof cacheConfig>) {
    Object.assign(cacheConfig, opts);
  },

  isStorageAvailable(): boolean {
    return storage !== null;
  },

  /**
   * Basic get (memory-first, fallback restore from storage).
   * Updates access metadata for LRU.
   * Note: does NOT trigger revalidation.
   */
  get<T>(key: string, opts?: { maxAge?: number }): T | null {
    const mem = memoryCache.get(key);
    const now = Date.now();

    if (mem) {
      // check expiry using per-entry TTL or provided maxAge
      const ttl = mem.ttl ?? opts?.maxAge;
      if (ttl && now - mem.timestamp > ttl) {
        // expired
        memoryCache.delete(key);
        try {
          storage?.removeItem(CACHE_PREFIX + key);
        } catch {}
        return null;
      }
      mem.accessCount++;
      mem.lastAccess = now;
      return mem.data as T;
    }

    if (!storage) return null;

    try {
      const raw = storage.getItem(CACHE_PREFIX + key);
      if (!raw) return null;
      const entry = JSON.parse(raw) as CacheEntry<T>;
      const entryLastAccess = entry.lastAccess ?? entry.timestamp;
      const ttl = entry.ttl ?? opts?.maxAge;
      if (ttl && now - entry.timestamp > ttl) {
        // expired in storage
        storage.removeItem(CACHE_PREFIX + key);
        return null;
      }

      // restore to memory and update lastAccess
      const restored: CacheEntry<T> = {
        ...entry,
        lastAccess: now,
        accessCount: (entry.accessCount ?? 0) + 1,
      };
      memoryCache.set(key, restored);
      this.evictIfNeeded();
      return restored.data;
    } catch (err) {
      // corrupt entry, drop it
      try {
        storage.removeItem(CACHE_PREFIX + key);
      } catch {}
      safeLog("Failed parse/restore entry:", key, err);
      return null;
    }
  },

  /**
   * Set with optional ttl (ms)
   */
  set<T>(key: string, value: T, opts?: { ttl?: number }) {
    const now = Date.now();
    const entry: CacheEntry<T> = {
      data: value,
      timestamp: now,
      lastAccess: now,
      accessCount: 1,
      ttl: opts?.ttl,
    };
    memoryCache.set(key, entry);
    this.evictIfNeeded();
    if (storage) {
      try {
        storage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
      } catch (err) {
        safeLog("Storage set failed, attempting prune:", err);
        // try pruning and retry once
        this.pruneStorage();
        try {
          storage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
        } catch (err2) {
          safeLog("Storage set failed after prune, giving up:", err2);
        }
      }
    }
  },

  /**
   * Clear one key or all keys (snapshot-safe)
   */
  clear(key?: string) {
    if (key) {
      memoryCache.delete(key);
      try {
        storage?.removeItem(CACHE_PREFIX + key);
      } catch {}
      return;
    }

    memoryCache.clear();
    if (!storage) return;

    // snapshot keys first to avoid mutation during iteration
    try {
      const keys: string[] = [];
      for (let i = 0; i < storage.length; i++) {
        const k = storage.key(i);
        if (k && k.startsWith(CACHE_PREFIX)) keys.push(k);
      }
      for (const k of keys) storage.removeItem(k);
    } catch (err) {
      safeLog("Failed to clear storage safely:", err);
    }
  },

  has(key: string): boolean {
    if (memoryCache.has(key)) return true;
    try {
      if (!storage) return false;
      return storage.getItem(CACHE_PREFIX + key) !== null;
    } catch {
      return false;
    }
  },

  keys(): string[] {
    const memKeys = Array.from(memoryCache.keys());
    if (!storage) return memKeys;
    const localKeys: string[] = [];
    try {
      for (let i = 0; i < storage.length; i++) {
        const k = storage.key(i);
        if (k && k.startsWith(CACHE_PREFIX)) localKeys.push(k.replace(CACHE_PREFIX, ""));
      }
    } catch {}
    return Array.from(new Set([...memKeys, ...localKeys]));
  },

  size(): number {
    return this.keys().length;
  },

  /**
   * Evict using true LRU (least recently used = oldest lastAccess)
   */
  evictIfNeeded() {
    const max = cacheConfig.maxMemoryEntries;
    if (memoryCache.size <= max) return;
    // compute number to evict (we can evict until <= max)
    const toEvict = memoryCache.size - max;
    // create array of [key, entry] and sort by lastAccess ascending (oldest first)
    const arr = Array.from(memoryCache.entries());
    arr.sort((a, b) => a[1].lastAccess - b[1].lastAccess);
    for (let i = 0; i < toEvict; i++) {
      const key = arr[i][0];
      memoryCache.delete(key);
    }
  },

  /**
   * Prune storage: remove oldest X% entries (snapshot-safe)
   */
  pruneStorage(percentage = 0.2) {
    if (!storage) return;
    try {
      const entries: Array<{ key: string; timestamp: number }> = [];
      // snapshot keys to avoid mutation issues
      for (let i = 0; i < storage.length; i++) {
        const k = storage.key(i);
        if (!k || !k.startsWith(CACHE_PREFIX)) continue;
        try {
          const raw = storage.getItem(k);
          if (!raw) continue;
          const parsed = JSON.parse(raw);
          entries.push({ key: k, timestamp: parsed.timestamp ?? 0 });
        } catch {}
      }
      const n = Math.max(1, Math.ceil(entries.length * percentage));
      entries
        .sort((a, b) => a.timestamp - b.timestamp)
        .slice(0, n)
        .forEach((e) => {
          try {
            storage.removeItem(e.key);
          } catch {}
        });
    } catch (err) {
      safeLog("pruneStorage failed:", err);
    }
  },

  /**
   * Stale-While-Revalidate with:
   * - dedupe in-flight requests per key
   * - configurable staleRatio (0..1) via options or global config
   *
   * Behavior:
   * 1) If cached and age < maxAge * staleRatio => return cached immediately.
   * 2) If cached but age >= staleRatio*maxAge && age < maxAge => return cached immediately AND trigger background revalidate (no wait).
   * 3) If expired or no cache => wait for fetcher (deduped), store, return new value.
   *
   * Options:
   *  - maxAge (ms) REQUIRED
   *  - staleRatio (0..1) optional override
   *  - fetchFreshIfNoCache (default true) - if false and no cache, returns null instead of fetching
   */
  async getWithRevalidate<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: { maxAge: number; staleRatio?: number; fetchFreshIfNoCache?: boolean }
  ): Promise<T | null> {
    const now = Date.now();
    const maxAge = options.maxAge;
    const staleRatio = options.staleRatio ?? cacheConfig.staleRatio;
    const fetchIfNoCache = options.fetchFreshIfNoCache ?? true;

    // Try memory/storage
    const memEntry = memoryCache.get(key);
    if (memEntry) {
      const age = now - memEntry.timestamp;
      if (age < maxAge * staleRatio) {
        // fresh enough
        memEntry.accessCount++;
        memEntry.lastAccess = now;
        return memEntry.data as T;
      }
      if (age < maxAge) {
        // stale but usable — return immediately and revalidate in background
        memEntry.accessCount++;
        memEntry.lastAccess = now;
        // trigger background revalidate (deduped)
        this._revalidateBackground(key, fetcher).catch((e) => safeLog("background revalidate failed:", e));
        return memEntry.data as T;
      }
      // expired -> fallthrough to fetch
    } else {
      // attempt restore from storage (get() will restore to memory)
      const restored = this.get<T>(key, { maxAge });
      if (restored) {
        // since get updated lastAccess, we can reuse logic by recursion (but avoid loops)
        const entry = memoryCache.get(key)!;
        const age = now - entry.timestamp;
        if (age < maxAge * staleRatio) {
          return entry.data as T;
        }
        if (age < maxAge) {
          this._revalidateBackground(key, fetcher).catch((e) => safeLog("background revalidate failed:", e));
          return entry.data as T;
        }
        // else expired -> fallthrough
      }
    }

    // No usable cache found
    if (!fetchIfNoCache) return null;

    // Dedupe in-flight
    if (inflight.has(key)) {
      try {
        const p = inflight.get(key)!;
        const data = await p;
        return data as T;
      } catch (err) {
        // existing inflight failed; proceed to attempt new fetch
        safeLog("existing inflight failed for key", key, err);
      }
    }

    // Start new fetch
    const fetchPromise = (async () => {
      try {
        const data = await fetcher();
        this.set(key, data, { ttl: maxAge });
        return data;
      } catch (err) {
        safeLog("fetcher failed for key", key, err);
        throw err;
      }
    })();

    inflight.set(key, fetchPromise);
    try {
      const result = await fetchPromise;
      return result as T;
    } finally {
      inflight.delete(key);
    }
  },

  // internal helper: background revalidate deduped
  async _revalidateBackground<T>(key: string, fetcher: () => Promise<T>) {
    if (inflight.has(key)) return; // already revalidating
    const p = (async () => {
      try {
        const data = await fetcher();
        this.set(key, data);
      } catch (err) {
        safeLog("background fetch failed for", key, err);
      }
    })();
    inflight.set(key, p);
    p.finally(() => inflight.delete(key));
    await p;
  },
};
