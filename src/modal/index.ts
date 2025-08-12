export enum ProjectsQueryType {
  ticker = "ticker",
  twitter = "twitter",
  domain = "domain",
  name = "name",
  Id = "Id",
}

export interface ProjectsParams {
  type: ProjectsQueryType;
  value: string;
}

export type BloomFilterData = {
  [key in ProjectsQueryType]?: string;
};

export interface BloomFilterParams {
  type: ProjectsQueryType;
}

export interface BloomFilterType {
  filter: string;
  meta: {
    version: string;
    update_time: string;
  };
}

// Passkey登录相关类型定义
export interface PasskeyLoginStartParams {
  email: string;
}

export interface PasskeyLoginFinishParams {
  email: string;
  credential: string;
}

// Passkey注册相关类型定义
export interface PasskeyRegisterStartParams {
  username: string;
}

export interface PasskeyRegisterStartResponse {
  code: number;
  message: string;
  result: string; // 包含publicKey选项的JSON字符串
}

export interface PasskeyRegisterFinishParams {
  id: string;
  type: string;
  rawId: string;
  response: {
    attestationObject: string;
    clientDataJSON: string;
  };
}
export enum ChainType {
  bsc = "bsc",
  solana = "solana",
}

export type LoginReq = {
  domain: string;
  statement: string;
  address: string;
  chainId: number;
  version: string;
  uri: string;
  nonce: string;
  issuedAt?: string;
  publicKey?: string;
};

export enum SendEmailCodeType {
  Withdraw = 1,
}
