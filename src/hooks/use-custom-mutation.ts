import { useMutation as useReactMutation } from '@tanstack/react-query';
import type { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

// Default options applied to every mutation
const defaultOptions = {
  retry: 0,
};

/**
 * Custom hook wrapping React Query's useMutation with standard defaults.
 * @param mutationFn - Function that performs the mutation
 * @param options - Optional override for useMutation options
 */
export function useCustomMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationResult<TData, TError, TVariables, TContext> {
  return useReactMutation<TData, TError, TVariables, TContext>({
    mutationFn,
    ...defaultOptions,
    ...options,
  });
}
