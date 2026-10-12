import axios, { type AxiosError, type AxiosInstance } from "axios";
import { useAuth } from "@/store/useAuth";
import { getApiUrl, type ApiScope } from "@/lib/tenant";

interface ErrorBody {
  status?: number;
  message?: string;
  [key: string]: unknown;
}

const createHttp = (scope: ApiScope): AxiosInstance => {
  const instance = axios.create();

  instance.interceptors.request.use((config) => {
    config.baseURL = getApiUrl(scope);

    const token = useAuth.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers["ngrok-skip-browser-warning"] = "true";
    config.headers.Accept = "application/json";
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ErrorBody>) => {
      const status = error.response?.status;
      const data = error.response?.data;

      if (data?.status === 401 && data?.message === "Token expired") {
        useAuth.getState().logOut();
      }

      if (status === 401) {
        window.dispatchEvent(new CustomEvent("unauthorized"));
      }
      if (status === 403) {
        window.dispatchEvent(
          new CustomEvent("forbidden", { detail: { error: data } }),
        );
      }
      if (status === 404) {
        window.dispatchEvent(
          new CustomEvent("not-found", { detail: { error: data } }),
        );
      }

      return Promise.reject(error);
    },
  );

  return instance;
};

export const mainHttp = createHttp("main");
export const tenantHttp = createHttp("tenant");

export const getHttp = (scope: ApiScope = "tenant"): AxiosInstance =>
  scope === "main" ? mainHttp : tenantHttp;

export default tenantHttp;
