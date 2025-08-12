import request, { base2Api } from "@/lib/request";

/**
 * Google 2FA 相关 API
 */

// 获取 Google 2FA 密钥和二维码
export const getGoogle2faSecret = async () => {
  return request<string>(base2Api, {
    url: '/v1/user/getGoogle2faSecret',
    method: 'GET'
  });
};

// 绑定 Google 2FA
export const google2faBind = async (code: string) => {
  return request<boolean>(base2Api, {
    url: '/v1/user/google2faBind',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: { code }
  });
};

// 更换 Google 2FA 密钥
export const changeGoogle2faSecret = async (code: string) => {
  return request<boolean>(base2Api, {
    url: '/v1/user/changeGoogle2faSecret',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: { code }
  });
}; 