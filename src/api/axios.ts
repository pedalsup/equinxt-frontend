import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse, Method } from "axios";

const BASE_URL = "https://jsonplaceholder.typicode.com";

type Headers = Record<string, string>;

export const getHeader = (): Headers => {

  const headers: Headers = {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  };

  return headers;
};

export const getConfig = (
  method: Method,
  suffix: string = "",
  body?: unknown,
  params?: Record<string, unknown>,
  requestHeaders?: Headers,
  customBaseUrl?: string
): AxiosRequestConfig => {
  const object: AxiosRequestConfig = {
    method: method,
    url: `${customBaseUrl || BASE_URL + suffix}`,
    headers: requestHeaders || getHeader(),
  };
  body && (object.data = body);
  params && (object.params = params);
  return object;
};

export const axiosRequest = <T = unknown>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> => axios.request(config);
