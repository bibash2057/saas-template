import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { getHttp } from "@/http/api";
import type { BaseResponse } from "@/types";
import { DEFAULT_MESSAGE } from "@/const/message";
import { buildQueryKey, type ApiScope } from "@/lib/tenant";
import type { AxiosError, AxiosRequestConfig } from "axios";

export type MutateMethod = "post" | "put" | "patch" | "delete";

interface UseMutateParams<TResponse, TVariables> {
  method: MutateMethod;
  url: string;
  key: readonly (string | number)[];
  options?: UseMutationOptions<TResponse, AxiosError, TVariables>;
  config?: AxiosRequestConfig;
  scope?: ApiScope;
}

const useMutate = <TResponse extends BaseResponse, TVariables = void>({
  method,
  url,
  key,
  options,
  config = {},
  scope = "tenant",
}: UseMutateParams<TResponse, TVariables>) => {
  const queryClient = useQueryClient();

  const { onSuccess, onError, ...rest } = options ?? {};

  return useMutation<TResponse, AxiosError, TVariables>({
    ...rest,
    mutationFn: async (variables) => {
      const http = getHttp(scope);

      switch (method) {
        case "post":
          return (await http.post<TResponse>(url, variables, config)).data;
        case "put":
          return (await http.put<TResponse>(url, variables, config)).data;
        case "patch":
          return (await http.patch<TResponse>(url, variables, config)).data;
        case "delete": {
          const id = variables as unknown;
          const hasId = id !== undefined && id !== null && id !== "";
          const endpoint = hasId ? `${url}/${String(id)}` : url;
          return (await http.delete<TResponse>(endpoint, config)).data;
        }
      }
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: buildQueryKey(scope, key),
        exact: false,
      });

      toast.success(args[0]?.message || DEFAULT_MESSAGE.SUCCESS, {
        position: "top-right",
      });

      return onSuccess?.(...args);
    },
    onError: (...args) => {
      const data = args[0]?.response?.data as BaseResponse | undefined;

      toast.error(data?.message || DEFAULT_MESSAGE.ERROR, {
        position: "top-right",
      });

      return onError?.(...args);
    },
  });
};

export default useMutate;
