import { StateCreator } from "zustand";
import { RootState } from "./index";
import { BloomFilterData, LoginType } from "@/modal";
import { CreditsInfo } from "@/modal/user";

// 用户详情类型定义
export interface UserDetail {
  uid: number;
  email: string;
  gmail: string;
  telegramId: string;
  authenticatorStatus: number;
  address: string;
  inviteCode: string;
  nickName: string;
  avatarUrl: string;
  firstName: string;
  lastName: string;
  birthday: string;
  phone: string;
  lastLoginAt: string;
  status: number;
  twitter: string;
  twitterBindTime: string;
  telegramBindTime: string;
  vipLevel: number;
  vipExpireTime: string;
  password: string;
}

export interface UserSlice {
  hasHydrated: boolean;
  bloomFilterData: BloomFilterData;
  token: string | undefined;
  userDetail: UserDetail | null;
  creditsInfo: CreditsInfo | null;
  loginModalOpen: boolean;
  loginType: LoginType;
  settings: Record<string, boolean>;
  updateLoginType: (loginType: LoginType) => void;
  setLoginModalOpen: (open: boolean) => void;
  updateToken: (token: string) => void;
  setUserDetail: (userDetail: UserDetail) => void;
  clearUserDetail: () => void;
  setCreditsInfo: (creditsInfo: CreditsInfo) => void;
  clearCreditsInfo: () => void;
  setBloomFilterData: (data: BloomFilterData) => void;
  setHasHydrated: (val: boolean) => void;
  updateSetting: (key: string, value: boolean) => void;
}

const baseBloomFilterData: BloomFilterData = {
  ticker: "",
  twitter: "",
  domain: "",
  name: "",
};

export const createUserSlice: StateCreator<
  RootState,
  [["zustand/subscribeWithSelector", never], ["zustand/devtools", never]],
  [],
  UserSlice
> = (set) => {
  return {
    hasHydrated: false,
    bloomFilterData: baseBloomFilterData,
    token: "",
    userDetail: null,
    creditsInfo: null,
    loginModalOpen: false,
    loginType: LoginType.Email,
    settings: {},
    updateLoginType: (loginType: LoginType) => {
      set({ loginType });
    },
    setLoginModalOpen: (open: boolean) => {
      set({ loginModalOpen: open });
    },
    updateToken: (token: string) => {
      set({ token });
    },
    setUserDetail: (userDetail: UserDetail) => {
      set({ userDetail });
    },
    clearUserDetail: () => {
      set({ userDetail: null });
    },
    setCreditsInfo: (creditsInfo: CreditsInfo) => {
      set({ creditsInfo });
    },
    clearCreditsInfo: () => {
      set({ creditsInfo: null });
    },
    setBloomFilterData: (data: BloomFilterData) => {
      set({ bloomFilterData: data });
    },
    setHasHydrated: (val: boolean) => {
      set({ hasHydrated: val });
    },
    updateSetting: (key: string, value: boolean) => {
      set((state) => ({
        settings: {
          ...state.settings,
          [key]: value,
        },
      }));
    },
  };
};
