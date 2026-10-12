import type { UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError, AxiosRequestConfig } from "axios";
import type { BaseResponse } from "@/types";
import type { ApiScope } from "@/lib/tenant";
import useMutate from "./useMutate";

const usePatch = <TResponse extends BaseResponse, TVariables = void>(
  url: string,
  key: readonly (string | number)[],
  options?: UseMutationOptions<TResponse, AxiosError, TVariables>,
  config: AxiosRequestConfig = {},
  scope: ApiScope = "tenant",
) =>
  useMutate<TResponse, TVariables>({
    method: "patch",
    url,
    key,
    options,
    config,
    scope,
  });

export default usePatch;

// usePatch<User, UpdateUserPayload>("/users/1", ["users"]);
