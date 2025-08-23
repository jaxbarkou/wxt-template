import request, { base3Api, base4Api, base5Api } from "@/lib/request";
import { SendEmailCodeType } from "@/modal";
import {
  AssetsNetworkItem,
  CreateOrderParams,
  CreditsHistoryItem,
  CreditsInfo,
  CreditsPlanItem,
  CreditsPlanType,
  DepositAddressType,
  NetworkAssetsItem,
  OperateLog,
  UserInfo,
} from "@/modal/user";
/**
 * 用户相关 API
 */

// 获取用户详情
export const getUserDetail = async () => {
  return request<UserInfo>(base3Api, {
    url: "/user/userDetail",
    method: "GET",
  });
};

//
export const getTwitterUrl = () => {
  return request<string>(base3Api, {
    url: `/user/twitter/auth/url`,
    method: "GET",
  });
};

export const bindTwitter = (code: string) => {
  return request<boolean>(base3Api, {
    url: `/user/twitter/auth/code?code=${code}`,
    method: "POST",
  });
};

export const changeNickName = (nickName: string) => {
  return request<any>(base3Api, {
    url: `/user/changeNickName`,
    method: "POST",
    data: { nickName },
  });
};

export const getAvatarList = () => {
  return request<any>(base3Api, {
    url: `/user/getAvatarList`,
    method: "GET",
  });
};

export const changeAvatarUrl = (avatarUrl: string) => {
  return request<any>(base3Api, {
    url: `/user/changeAvatarUrl`,
    method: "POST",
    data: { avatarUrl },
  });
};

export const changeEmail = (email: string, google2faCode: string) => {
  return request<boolean>(base3Api, {
    url: `/user/changeEmail`,
    method: "POST",
    data: { email, google2faCode },
  });
};

export const changeWithdrawPassword = (
  oldPassword: string,
  newPassword: string,
  google2faCode: string
) => {
  return request<boolean>(base3Api, {
    url: `/user/changeWithdrawPassword`,
    method: "POST",
    data: { oldPassword, newPassword, google2faCode },
  });
};

export const changePassword = (
  oldPwd: string,
  newPwd: string,
  verifyNewPwd: string,
  google2faCode: string
) => {
  return request<boolean>(base3Api, {
    url: `/user/changePassword`,
    method: "POST",
    data: { oldPwd, newPwd, verifyNewPwd, google2faCode },
  });
};

export const sendEmailCode = (type: SendEmailCodeType) => {
  return request<boolean>(base3Api, {
    url: `/user/emailSend`,
    method: "POST",
    data: { type },
  });
};

export const getOperateLog = () => {
  return request<OperateLog[]>(base3Api, {
    url: `/user/getOperateLog`,
    method: "GET",
  });
};

// top-up
export const getCreditsInfo = () => {
  return request<{ account: CreditsInfo }>(base4Api, {
    url: `/credits/accounts/me`,
    method: "GET",
  });
};

export const getCreditsHistory = () => {
  return request<{ histories: CreditsHistoryItem[] }>(base4Api, {
    url: `/credits/accounts/history`,
    method: "GET",
  });
};

export const getCreditsPlans = (currency: string) => {
  return request<CreditsPlanType>(base4Api, {
    url: `/credits/plans`,
    method: "GET",
    params: { currency },
  });
};

export const createCreditsOrder = (data: CreateOrderParams) => {
  return request<boolean>(base4Api, {
    url: `/credits/orders`,
    method: "POST",
    data,
  });
};

export const getCreditsOrderDetail = (orderId: string) => {
  return request<{ plans: CreditsPlanItem[] }>(base4Api, {
    url: `/credits/orders/details/${orderId}`,
    method: "GET",
  });
};

export const cancelCreditsOrder = (orderId: string) => {
  return request<boolean>(base4Api, {
    url: `/credits/orders/details/${orderId}`,
    method: "DELETE",
    data: {
      reason: "",
    },
  });
};

// network assets conf
export const getNetworkAssets = () => {
  return request<NetworkAssetsItem[]>(base5Api, {
    url: `/wallet_na/v1/network/asset`,
    method: "GET",
  });
};

export const getAssetsNetworkList = () => {
  return request<AssetsNetworkItem[]>(base5Api, {
    url: `/wallet_na/v1/network/network`,
    method: "GET",
  });
};

export const getDepositAddress = (chain: string) => {
  return request<DepositAddressType[]>(base5Api, {
    url: `/wallet_a/v1/wallet/deposit/address`,
    method: "GET",
    params: { chain },
  });
};
