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
