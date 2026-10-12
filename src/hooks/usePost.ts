import type { UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError, AxiosRequestConfig } from "axios";
import type { BaseResponse } from "@/types";
import type { ApiScope } from "@/lib/tenant";
import useMutate from "./useMutate";

const usePost = <TResponse extends BaseResponse, TVariables = void>(
  url: string,
  key: readonly (string | number)[],
  options?: UseMutationOptions<TResponse, AxiosError, TVariables>,
  config: AxiosRequestConfig = {},
  scope: ApiScope = "tenant",
) =>
  useMutate<TResponse, TVariables>({
    method: "post",
    url,
    key,
    options,
    config,
    scope,
  });

export default usePost;

// usePost<User, CreateUserPayload>("/users", ["users"]);
// usePost<Tenant, NewTenant>("/tenants", ["tenants"], undefined, {}, "main");
