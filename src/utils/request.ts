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
    const lighgData = JSON.parse(localStorage.getItem("yomo") || "{}");
    instance.defaults.headers.common["X-Auth-Token"] = _.get(
      lighgData,
      "state.token",
      ""
    );
    const { data } = await instance.request<MyResponseType<T>>(config);
    const item = window.localStorage.getItem("yomoInitToken");
    if (data.code === 401 && !item) {
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
