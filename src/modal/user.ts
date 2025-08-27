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

export interface CreditsInfo {
  id: string;
  uid: number;
  balance: string; // 账户余额
  created_at: string; // 创建时间
  updated_at: string; // 更新时间
  daily_credits: string;
}

export interface CreateOrderParams {
  plan_id: string;
  chain_id: number;
  user_wallet_address: string;
  plan_request_id: string;
}

export interface CreditsOrderItem {
  id: string;
  uid: number;
  plan_id: string;
  pay_currency: string;
  list_price_usdt: string;
  discount_percentage: string;
  credits: number;
  status: string; // 订单状态
  expires_at: string;
  actual_paid_at: string;
  cancelled_at: string;
  created_at: string;
  updated_at: string;
}

export interface CreditsHistoryItem {
  id: string;
  uid: number;
  balance_before: string;
  balance_change: string;
  balance_after: string;
  biz_type: string;
  biz_title: string;
  created_at: string;
}

export interface CreditsPlanItem {
  id: string;
  currency: string;
  credits: number; // 价格
  is_popular: number;
  list_price: string;
  list_price_usdt: string;
  discount_percentage: number; // 折扣百分比
  created_at: string; // 创建时间
  updated_at: string; // 更新时间
  amount_due: string; // 价格
  fx_rate_used: string; // 汇率
}

export interface CreditsPlanType {
  plans: CreditsPlanItem[];
  request_id: string;
  ttl: number;
  unpaid_order_id_list: string[];
}

export interface AssetsItem {
  symbol: string;
  assetContract: string;
  decimals: string;
  depositContract: string;
  withdrawalFee: string;
  minWithdrawal: string;
  supportWithdraw: boolean;
  image: string;
}

export interface NetworkItem {
  chainId: number;
  chain: string;
  assetContract: string;
  decimals: string;
  withdrawalFee: string;
  minWithdrawal: string;
  supportWithdraw: boolean;
  tag: string;
  topUpBlock: string;
  redeemBlock: string;
}

export interface NetworkAssetsItem {
  chainId: number;
  chain: string;
  tag: string;
  topUpBlock: string;
  redeemBlock: string;
  assets: AssetsItem[];
}

export interface AssetsNetworkItem {
  symbol: string;
  image: string;
  supportWithdraw: string;
  networks: NetworkItem[];
}

export interface DepositAddressType {
  uid: number;
  chainId: number;
  chain: string;
  address: string;
}

export type GoogleProfile = {
  sub: string;
  name?: string;
  email?: string;
  picture?: string;
};