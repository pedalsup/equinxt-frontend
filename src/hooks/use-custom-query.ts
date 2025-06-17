import { useQuery as useReactQuery } from '@tanstack/react-query';
import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

// Default options applied to every query
const defaultOptions = {
  retry: 1,
  refetchOnWindowFocus: false,
};

/**
 * Custom hook wrapping React Query's useQuery with standard defaults.
 * @param queryKey - Unique key for the query
 * @param queryFn - Function returning a Promise of data
 * @param options - Optional override for useQuery options
 */
export function useCustomQuery<
  TQueryFnData,
  TError = unknown,
  TData = TQueryFnData
>(
  queryKey: readonly [string, any],
  queryFn: ({ queryKey }: { queryKey: readonly [string, any] }) => Promise<TQueryFnData>,
  options?: UseQueryOptions<TQueryFnData, TError, TData>
): UseQueryResult<TData, TError> {
  return useReactQuery<TQueryFnData, TError, TData>({
    queryKey,
    queryFn: ({ queryKey }) => queryFn({ queryKey: queryKey as readonly [string, any] }),
    ...defaultOptions,
    ...options,
  });
}
