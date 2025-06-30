import { useState, useEffect } from 'react';
import { ApiResponse, ApiError } from '../types';

interface UseApiOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
}

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (...args: any[]): Promise<T> => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiFunction(...args);
      
      setData(result);
      options.onSuccess?.(result);
      
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error desconocido';
      setError(errorMessage);
      options.onError?.(err.response?.data || { success: false, message: errorMessage });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  useEffect(() => {
    if (options.immediate) {
      execute();
    }
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

// Hook específico para operaciones con paginación
export function usePaginatedApi<T>(
  apiFunction: (params: any) => Promise<{ data: T[]; pagination: any }>,
  initialParams: any = {}
) {
  const [data, setData] = useState<T[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState(initialParams);

  const execute = async (newParams?: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const finalParams = newParams ? { ...params, ...newParams } : params;
      const result = await apiFunction(finalParams);
      
      setData(result.data);
      setPagination(result.pagination);
      setParams(finalParams);
      
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (pagination?.hasNext) {
      const nextPageParams = { ...params, page: pagination.page + 1 };
      const result = await execute(nextPageParams);
      setData(prev => [...prev, ...result.data]);
    }
  };

  const refresh = () => execute();

  const reset = () => {
    setData([]);
    setPagination(null);
    setError(null);
    setLoading(false);
    setParams(initialParams);
  };

  useEffect(() => {
    execute();
  }, []);

  return {
    data,
    pagination,
    loading,
    error,
    params,
    execute,
    loadMore,
    refresh,
    reset,
    setParams,
  };
}