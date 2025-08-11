import { StateCreator } from "zustand";
import { RootState } from "./index";
import { BloomFilterData } from "@/modal";

export interface UserSlice {
  hasHydrated: boolean;
  bloomFilterData: BloomFilterData;
  token: string | undefined;
  updateToken: (token: string) => void;
  setBloomFilterData: (data: BloomFilterData) => void;
  setHasHydrated: (val: boolean) => void;
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
    updateToken: (token: string) => {
      set({ token });
    },
    setBloomFilterData: (data: BloomFilterData) => {
      set({ bloomFilterData: data });
    },
    setHasHydrated: (val: boolean) => {
      set({ hasHydrated: val });
    },
  };
};
