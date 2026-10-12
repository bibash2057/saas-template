import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { AxiosRequestConfig } from "axios";
import { getHttp } from "@/http/api";
import { buildQueryKey, type ApiScope } from "@/lib/tenant";

interface UseFetchOptions {
  enabled?: boolean;
  staleTime?: number;
  refetchInterval?: number | false;
  refetchOnWindowFocus?: boolean;
  scope?: ApiScope;
}

const useFetch = <T>(
  url: string,
  key: readonly (string | number)[],
  config: AxiosRequestConfig = {},
  { scope = "tenant", enabled = true, ...options }: UseFetchOptions = {},
): UseQueryResult<T, Error> =>
  useQuery<T, Error>({
    queryKey: buildQueryKey(scope, key),
    queryFn: async () => {
      const res = await getHttp(scope).get<T>(url, config);
      return res.data;
    },
    enabled: Boolean(url) && enabled,
    staleTime: 5 * 60 * 1000,
    ...options,
  });

export default useFetch;

// const { data } = useFetch<User[]>("/users", ["users"]);
// const { data } = useFetch<Plan[]>("/plans", ["plans"], {}, { scope: "main" });
