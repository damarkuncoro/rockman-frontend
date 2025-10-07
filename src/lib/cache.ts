// cache.ts — Hybrid cache: memory + localStorage (dengan fallback)
type CacheEntry<T> = {
  data: T;
  timestamp: number;
  accessCount: number;
};

const memoryCache = new Map<string, CacheEntry<any>>();
const CACHE_PREFIX = "useFetchCache:";
const MAX_MEMORY_ENTRIES = 100; // Batasi entries di memory

// Cek apakah localStorage tersedia
const isLocalStorageAvailable = (() => {
  try {
    const test = "__localStorage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
})();

export const cache = {
  /**
   * Mengambil data dari cache (memory first, lalu localStorage)
   * @param key - Key untuk cache
   * @param maxAge - Maksimal umur cache dalam milidetik (opsional)
   * @returns Data dari cache atau null jika tidak ada/expired
   */
  get<T>(key: string, maxAge?: number): T | null {
    // Cek memory cache terlebih dahulu
    if (memoryCache.has(key)) {
      const entry = memoryCache.get(key)!;
      
      // Validasi expiry
      if (maxAge && Date.now() - entry.timestamp > maxAge) {
        memoryCache.delete(key);
        if (isLocalStorageAvailable) {
          localStorage.removeItem(CACHE_PREFIX + key);
        }
        return null;
      }

      // Update access count untuk LRU
      entry.accessCount++;
      return entry.data as T;
    }

    // Fallback ke localStorage jika tersedia
    if (!isLocalStorageAvailable) return null;

    try {
      const raw = localStorage.getItem(CACHE_PREFIX + key);
      if (!raw) return null;

      const entry = JSON.parse(raw) as CacheEntry<T>;

      // Validasi expiry
      if (maxAge && Date.now() - entry.timestamp > maxAge) {
        localStorage.removeItem(CACHE_PREFIX + key);
        return null;
      }

      // Restore ke memory untuk akses cepat berikutnya
      memoryCache.set(key, entry);
      cache.evictIfNeeded(); // Fixed: gunakan referensi langsung, bukan this

      return entry.data;
    } catch {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
  },

  /**
   * Menyimpan data ke cache (memory + localStorage)
   * @param key - Key untuk cache
   * @param value - Data yang akan disimpan
   */
  set<T>(key: string, value: T): void {
    const entry: CacheEntry<T> = {
      data: value,
      timestamp: Date.now(),
      accessCount: 1,
    };

    // Simpan ke memory
    memoryCache.set(key, entry);
    cache.evictIfNeeded(); // Fixed: gunakan referensi langsung, bukan this

    // Simpan ke localStorage jika tersedia
    if (isLocalStorageAvailable) {
      try {
        localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
      } catch (err) {
        // localStorage penuh atau error lain, hapus entries lama
        console.warn("Cache localStorage error:", err);
        cache.pruneLocalStorage(); // Fixed: gunakan referensi langsung, bukan this
      }
    }
  },

  /**
   * Menghapus cache
   * @param key - Key spesifik untuk dihapus, atau undefined untuk hapus semua
   */
  clear(key?: string): void {
    if (key) {
      memoryCache.delete(key);
      if (isLocalStorageAvailable) {
        localStorage.removeItem(CACHE_PREFIX + key);
      }
    } else {
      memoryCache.clear();
      if (isLocalStorageAvailable) {
        Object.keys(localStorage)
          .filter((k) => k.startsWith(CACHE_PREFIX))
          .forEach((k) => localStorage.removeItem(k));
      }
    }
  },

  /**
   * Mengecek apakah key ada di cache
   * @param key - Key yang akan dicek
   * @returns true jika key ada
   */
  has(key: string): boolean {
    if (memoryCache.has(key)) return true;
    if (isLocalStorageAvailable) {
      return localStorage.getItem(CACHE_PREFIX + key) !== null;
    }
    return false;
  },

  /**
   * Mendapatkan semua keys yang ada di cache
   * @returns Array of cache keys
   */
  keys(): string[] {
    const memKeys = Array.from(memoryCache.keys());
    
    if (!isLocalStorageAvailable) return memKeys;

    const localKeys = Object.keys(localStorage)
      .filter((k) => k.startsWith(CACHE_PREFIX))
      .map((k) => k.replace(CACHE_PREFIX, ""));

    return Array.from(new Set([...memKeys, ...localKeys]));
  },

  /**
   * Mendapatkan ukuran cache
   * @returns Jumlah entries di cache
   */
  size(): number {
    return cache.keys().length; // Fixed: gunakan referensi langsung, bukan this
  },

  /**
   * Evict entries lama jika melebihi batas (LRU)
   * @private
   */
  evictIfNeeded(): void {
    if (memoryCache.size <= MAX_MEMORY_ENTRIES) return;

    // Cari entry dengan accessCount terendah
    let minAccess = Infinity;
    let lruKey: string | null = null;

    for (const [key, entry] of memoryCache.entries()) {
      if (entry.accessCount < minAccess) {
        minAccess = entry.accessCount;
        lruKey = key;
      }
    }

    if (lruKey) {
      memoryCache.delete(lruKey);
    }
  },

  /**
   * Hapus entries lama dari localStorage
   * @private
   */
  pruneLocalStorage(): void {
    if (!isLocalStorageAvailable) return;

    try {
      const entries: Array<{ key: string; timestamp: number }> = [];

      Object.keys(localStorage)
        .filter((k) => k.startsWith(CACHE_PREFIX))
        .forEach((k) => {
          try {
            const entry = JSON.parse(localStorage.getItem(k)!);
            entries.push({ key: k, timestamp: entry.timestamp || 0 });
          } catch {}
        });

      // Hapus 20% entries tertua
      entries
        .sort((a, b) => a.timestamp - b.timestamp)
        .slice(0, Math.ceil(entries.length * 0.2))
        .forEach((e) => localStorage.removeItem(e.key));
    } catch (err) {
      console.warn("Failed to prune localStorage:", err);
    }
  },

  /**
   * Cek apakah localStorage tersedia
   * @returns true jika localStorage dapat digunakan
   */
  isStorageAvailable(): boolean {
    return isLocalStorageAvailable;
  },
};