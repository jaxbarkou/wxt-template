// login
export interface EmailRegisterParams {
  email: string;
  code: string;
  pwd: string;
  verifyPwd: string;
}

export interface EmailLoginParams {
  email: string;
  pwd: string;
}

export enum UserStatus {
  Valid = 1,
  Frozen = 2,
  Invalid = 3,
}

export interface UserInfo {
  uid: number; // 用户id
  email: string; // 邮箱
  gmail: string; // Google OAuth 登录邮箱
  telegramId: string; // Telegram 登录 ID
  authenticatorStatus: number; // Google Authenticator 密钥绑定状态
  address: string; // 钱包地址
  inviteCode: string; // 邀请码
  nickName: string; // Nick name
  avatarUrl: string; // 头像 URL
  firstName: string; // 名
  lastName: string; // 姓
  birthday: string; // 出生日期
  phone: string; // 手机号
  lastLoginAt: string; // 上次登录时间
  status: UserStatus; // 状态：1 有效；2 冻结；3 无效
  twitter: string; // Twitter 账号
  twitterBindTime: string; // Twitter 绑定时间
  telegramBindTime: string; // Telegram 绑定时间
  vipLevel: number; // VIP 等级（0 普通用户）
  vipExpireTime: string; // VIP 到期时间
  password: string; // 密码
}

export type OperateLog = {
  activity: string;
  trustedDevice: string;
  recentTrustedDevice: string;
  ip: string;
  remark: string;
  createdAt: string;
};
