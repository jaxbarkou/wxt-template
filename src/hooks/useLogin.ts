import { useCallback, useState } from "react";
import { useChainId, useConfig } from "wagmi";
import { getEthersSigner } from "@/hooks/useEthersSigner";
import { useRootStore } from "@/store";
import { getNonce, walletLogin } from "@/lib/api/login";
import { SiweMessage } from "siwe";
import { ChainType, LoginReq, LoginType } from "@/modal";
import { useActiveAccount } from "@/hooks/useActiveAccount";

export const useLogin = (code: string) => {
  const chainId = useChainId();
  const { activeAccount } = useActiveAccount();
  const [logining, setLogining] = useState(false);
  const config = useConfig();
  const updateToken = useRootStore((state) => state.updateToken);
  const setLoginModalOpen = useRootStore((state) => state.setLoginModalOpen);
  const updateLoginType = useRootStore((state) => state.updateLoginType);

  const toLogin = useCallback(
    async (account: string) => {
      try {
        if (logining) return;
        setLogining(true);
        const signer = await getEthersSigner(config);
        const provider = signer.provider;
        if (!signer || !chainId || !account) return;
        const res = await getNonce(account);
        const signNot = await provider.getCode(account);
        const domain = window.location.host;
        const origin = window.location.origin;
        const nonce = res.code === 1 ? res.result.nonce : null;
        if (nonce) {
          const params: LoginReq = {
            domain,
            address: account,
            statement: "Sign in with to the app.",
            uri: origin,
            nonce,
            version: "1",
            chainId,
          };
          const message = new SiweMessage({ ...params });
          message.toMessage();
          params.issuedAt = message.issuedAt;
          const signature = await signer.signMessage(message.prepareMessage());
          const resLogin = await walletLogin(
            signature,
            params,
            code,
            ChainType.bsc,
            signNot !== "0x" ? "sc" : ""
          );
          if (resLogin.code === 1) {
            updateToken(resLogin.result.token);
            setLoginModalOpen(false);
            updateLoginType(LoginType.Wallet);
            return resLogin;
          } else if (resLogin.code === 426) {
            return null;
          }
        }
      } catch (error) {
        console.error("Login error:", error);
      } finally {
        setLogining(false);
      }
    },
    [chainId, code]
  );

  const loginAction = useCallback(
    async (account: string) => {
      try {
        if (logining) return;
        const res = await toLogin(account);
        if (res?.code === 1) {
          updateToken(res.result.token);
        }
      } catch (error) {
        console.log("Login-error", error);
      }
    },
    [chainId, code, logining]
  );

  const handleLogin = useCallback(() => {
    if (!activeAccount) return;
    loginAction(activeAccount);
  }, [activeAccount]);

  return { logining, toLogin, handleLogin };
};
