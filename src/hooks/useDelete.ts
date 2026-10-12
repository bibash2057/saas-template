import type { UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError, AxiosRequestConfig } from "axios";
import type { BaseResponse } from "@/types";
import type { ApiScope } from "@/lib/tenant";
import useMutate from "./useMutate";

const useDelete = <
  TResponse extends BaseResponse = BaseResponse,
  TVariables extends string | number | void = void,
>(
  url: string,
  key: readonly (string | number)[],
  options?: UseMutationOptions<TResponse, AxiosError, TVariables>,
  config: AxiosRequestConfig = {},
  scope: ApiScope = "tenant",
) =>
  useMutate<TResponse, TVariables>({
    method: "delete",
    url,
    key,
    options,
    config,
    scope,
  });

export default useDelete;

// const del = useDelete<BaseResponse, number>("/users", ["users"]);
// del.mutate(5);   // DELETE /users/5
//
// const delOne = useDelete("/users/1", ["users"]);
// delOne.mutate(); // DELETE /users/1
