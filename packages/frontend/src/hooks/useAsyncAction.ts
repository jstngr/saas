import { useState, useCallback } from "react";
import { useErrorHandler } from "./useErrorHandler";

export const useAsyncAction = <T extends (...args: any[]) => Promise<any>>(
  action: T,
  options?: {
    onSuccess?: (result: Awaited<ReturnType<T>>) => void;
    onError?: (error: any) => void;
  }
) => {
  const [loading, setLoading] = useState(false);
  const { handleError } = useErrorHandler();

  const execute = useCallback(
    async (...args: Parameters<T>) => {
      try {
        setLoading(true);
        const result = await action(...args);
        options?.onSuccess?.(result);
        return result;
      } catch (error) {
        options?.onError?.(error);
        handleError(error);
      } finally {
        setLoading(false);
      }
    },
    [action, handleError, options]
  );

  return {
    execute,
    loading,
  };
};
