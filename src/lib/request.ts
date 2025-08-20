import axios, { AxiosRequestConfig } from "axios";
import _ from "lodash";
import { API_URL, API_URL2, API_URL3, API_URL4, API_URL5 } from "@/config";

interface MyResponseType<T> {
  code: number;
  data: T;
  result: T;
  message?: string;
  error?: string;
}

// const instance = axios.create({
//   baseURL: `${API_URL}/api/v1/`,
//   timeout: 60000,
// });

export const baseApi = axios.create({
  baseURL: `${API_URL}/api/v1/`,
  timeout: 60000,
});

export const base2Api = axios.create({
  baseURL: `${API_URL2}/v1/`,
  timeout: 60000,
});

export const base3Api = axios.create({
  baseURL: `${API_URL3}/v1/`,
  timeout: 60000,
});

export const base4Api = axios.create({
  baseURL: `${API_URL4}/api/v1/`,
  timeout: 60000,
});

export const base5Api = axios.create({
  baseURL: `${API_URL5}/v1/`,
  timeout: 60000,
});

const request = async <T = any>(
  instance:
    | typeof baseApi
    | typeof base2Api
    | typeof base3Api
    | typeof base4Api
    | typeof base5Api = baseApi,
  config: AxiosRequestConfig
): Promise<MyResponseType<T>> => {
  try {
    let item: string | null = null;

    // 检查是否在支持 localStorage 的环境中
    if (typeof localStorage !== "undefined" && typeof window !== "undefined") {
      const lighgData = JSON.parse(localStorage.getItem("yomo") || "{}");
      instance.defaults.headers.common["X-Auth-Token"] = _.get(
        lighgData,
        "state.token",
        ""
      );
      item = window.localStorage.getItem("yomoInitToken");
    }

    const { data } = await instance.request<MyResponseType<T>>(config);

    // 只在有 localStorage 的环境中处理 401 错误
    if (
      data.code === 401 &&
      !item &&
      typeof localStorage !== "undefined" &&
      typeof window !== "undefined"
    ) {
      localStorage.setItem("yomoInitToken", `${new Date().getTime()}`);
    }

    return data;
  } catch (err) {
    console.log(err);
    const message = "Request Error";
    return {
      code: -1,
      data: null as any,
      result: null as any,
      error: message,
    };
  }
};

export default request;
