import axios, { AxiosRequestConfig } from "axios";
import _ from "lodash";
import { API_URL } from "@/config";

interface MyResponseType<T> {
  code: number;
  data: T;
  error?: string;
}

const instance = axios.create({
  baseURL: `${API_URL}/api/v1/`,
  timeout: 60000,
  validateStatus(status) {
    return status >= 200 && status <= 500;
  },
});

const request = async <T = any>(
  config: AxiosRequestConfig
): Promise<MyResponseType<T>> => {
  try {
    let item: string | null = null;
    
    // 检查是否在支持 localStorage 的环境中
    if (typeof localStorage !== 'undefined' && typeof window !== 'undefined') {
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
    if (data.code === 401 && !item && typeof localStorage !== 'undefined' && typeof window !== 'undefined') {
      localStorage.setItem("yomoInitToken", `${new Date().getTime()}`);
    }
    
    return data;
  } catch (err) {
    console.log(err);
    const message = "Request Error";
    return {
      code: -1,
      data: null as any,
      error: message,
    };
  }
};

export default request;
