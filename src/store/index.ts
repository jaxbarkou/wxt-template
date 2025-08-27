"use client";

import { create } from "zustand";
import {
  devtools,
  subscribeWithSelector,
  persist,
  createJSONStorage,
} from "zustand/middleware";
import { createUserSlice, UserSlice } from "./user";

export type RootState = UserSlice;

export const useRootStore = create<RootState>()(
  subscribeWithSelector(
    devtools(
      persist(
        (...args) => {
          return {
            ...createUserSlice(...args),
          };
        },
        {
          name: "yomo",
          // skipHydration: true,
          onRehydrateStorage: () => (state) => {
            state?.setHasHydrated(true); // 👈 hydration 完成标记
          },
          storage: createJSONStorage(() => localStorage),
          partialize: (state) => ({
            hasHydrated: state.hasHydrated,
            bloomFilterData: state.bloomFilterData,
            token: state.token,
            userDetail: state.userDetail,
            creditsInfo: state.creditsInfo,
            settings: state.settings,
            googleProfile: state.googleProfile,
          }),
        }
      )
    )
  )
);
