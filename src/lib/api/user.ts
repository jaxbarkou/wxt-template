import request, { base3Api } from "@/lib/request";

/**
 * 用户相关 API
 */

// 获取用户详情
export const getUserDetail = async () => {
  return request<any>(base3Api, {
    url: '/user/userDetail',
    method: 'GET'
  });
}; 