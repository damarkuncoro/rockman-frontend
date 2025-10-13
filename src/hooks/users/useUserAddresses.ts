"use client";

import { useEffect, useMemo } from "react";
import { useFetch, UseFetchOptions } from "@/lib/useFetch";

export type UserAddress = {
  id: string;
  userId: string;
  address: string;
  city?: string | null;
  province?: string | null;
  postalCode?: string | null;
  notes?: string | null;
  isDefault: boolean;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type AddressesResponse = { message?: string; data?: UserAddress[] } | { data: UserAddress[] };

export default function useUserAddresses(userId?: string) {
  const url = userId ? `/api/v2/users/${userId}/addresses` : "";

  const options: UseFetchOptions<AddressesResponse> = {
    revalidate: 60000,
    useCache: true,
    immediate: !!userId,
    cacheMaxAge: 300000,
  };

  const { data, loading, error, refetch } = useFetch<AddressesResponse>(url, options);

  const addresses = useMemo<UserAddress[]>(() => {
    if (!data) return [];
    const payload = (data as any);
    if (Array.isArray(payload?.data)) return payload.data as UserAddress[];
    if (Array.isArray(payload)) return payload as UserAddress[];
    return [];
  }, [data]);

  return { addresses, loading, error: error ? error.message : null, refetch };
}