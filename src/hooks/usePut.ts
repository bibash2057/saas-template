import type { UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError, AxiosRequestConfig } from "axios";
import type { BaseResponse } from "@/types";
import type { ApiScope } from "@/lib/tenant";
import useMutate from "./useMutate";

const usePut = <TResponse extends BaseResponse, TVariables = void>(
  url: string,
  key: readonly (string | number)[],
  options?: UseMutationOptions<TResponse, AxiosError, TVariables>,
  config: AxiosRequestConfig = {},
  scope: ApiScope = "tenant",
) =>
  useMutate<TResponse, TVariables>({
    method: "put",
    url,
    key,
    options,
    config,
    scope,
  });

export default usePut;

// usePut<User, UpdateUserPayload>("/users/1", ["users"]);
