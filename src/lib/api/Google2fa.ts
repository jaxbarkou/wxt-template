import request, { base3Api } from "@/lib/request";

/**
 * Google 2FA 相关 API
 */

// 获取 Google 2FA 密钥和二维码
export const getGoogle2faSecret = async () => {
  return request<string>(base3Api, {
    url: '/user/getGoogle2faSecret',
    method: 'GET'
  });
};

// 绑定 Google 2FA
export const google2faBind = async (code: string) => {
  return request<boolean>(base3Api, {
    url: '/user/google2faBind',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: { code }
  });
};

// 更换 Google 2FA 密钥
export const changeGoogle2faSecret = async (code: string) => {
  return request<boolean>(base3Api, {
    url: '/user/changeGoogle2faSecret',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: { code }
  });
}; 