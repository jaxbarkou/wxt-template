import { GoogleProfile } from "@/modal/user";
import { useEffect, useState } from "react";
import { useRootStore } from "@/store";
import { GoogleLoginType, LoginType } from "@/modal";
import { authInPopup } from "./authPopup";
import { googleLogin } from "@/lib/api/login";
import { bindGoogle } from "@/lib/api/user";
import { useUserDetail } from "@/hooks/useUserDetail";

// 解析 JWT Token 的函数（不验证签名，仅解码）
function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error parsing JWT:", error);
    return null;
  }
}

const parseHash = (h: string) =>
  Object.fromEntries(new URLSearchParams(h.replace(/^#/, "")));

export const useGoogleLogin = () => {
  const [googleLoading, setGoogleLoading] = useState(false);
  const updateToken = useRootStore((state) => state.updateToken);
  const updateLoginType = useRootStore((state) => state.updateLoginType);
  const setLoginModalOpen = useRootStore((state) => state.setLoginModalOpen);

  const token = useRootStore((state) => state.token);

  const { fetchUserDetail } = useUserDetail();

  const updateGoogleProfile = useRootStore(
    (state) => state.updateGoogleProfile
  );

  const toBizLogin = async (idToken: string) => {
    try {
      let res = await googleLogin(idToken);
      if (res?.result.token) {
        updateToken(res?.result.token);
        updateLoginType(LoginType.Google);
        const tokenPayload = parseJwt(idToken);
        if (tokenPayload) {
          console.log("tokenPayloadtokenPayload", tokenPayload);
          const userInfo: GoogleProfile = {
            sub: tokenPayload.sub,
            name: tokenPayload.name,
            picture: tokenPayload.picture,
            email: tokenPayload.email,
          };
          updateGoogleProfile(userInfo);
          setLoginModalOpen(false);
        }
      }
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  const toBizBind = async (idToken: string) => {
    try {
      if (idToken) {
        let res = await bindGoogle(idToken);
        if (res.result) {
          const tokenPayload = parseJwt(idToken);
          if (tokenPayload) {
            const userInfo: GoogleProfile = {
              sub: tokenPayload.sub,
              name: tokenPayload.name,
              picture: tokenPayload.picture,
              email: tokenPayload.email,
            };
            updateGoogleProfile(userInfo);
            fetchUserDetail();
          }
        }
      }
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  const toGoogleLogin = async (type: GoogleLoginType) => {
    setGoogleLoading(true);
    try {
      // 获取 manifest 信息进行调试
      const manifest = chrome.runtime.getManifest();
      if (!manifest?.oauth2?.client_id) {
        throw new Error("OAuth2 client_id not configured in manifest");
      }

      // 生成随机 nonce 用于安全验证
      const nonce = Math.random().toString(36).slice(2);

      // 构建 OAuth2 授权 URL，请求 ID Token
      const clientId = encodeURIComponent(manifest?.oauth2?.client_id);
      const scopes = encodeURIComponent(
        (manifest?.oauth2?.scopes || ["openid", "email", "profile"]).join(" ")
      );
      const redirectUri = chrome.identity.getRedirectURL("oauth2");
      const encodedRedirectUri = encodeURIComponent(redirectUri);
      const authUrl =
        `https://accounts.google.com/o/oauth2/v2/auth` +
        `?client_id=${clientId}` +
        `&response_type=id_token` + // 请求 ID Token
        `&redirect_uri=${encodedRedirectUri}` +
        `&scope=${scopes}` +
        `&nonce=${encodeURIComponent(nonce)}` + // 安全验证
        `&prompt=consent`; // 强制显示同意页面

      const finalUrl = await authInPopup(authUrl, redirectUri, {
        width: 420,
        height: 640,
      });

      const data = parseHash(finalUrl.hash);
      if (data.error) throw new Error(data.error_description || data.error);

      if (!data.id_token) {
        throw new Error("No ID token received");
      }

      const idToken = data.id_token;

      if (idToken) {
        if (type === GoogleLoginType.Login) {
          // 处理登录逻辑
          toBizLogin(idToken);
        } else if (type === GoogleLoginType.Bind) {
          // 处理绑定逻辑
          toBizBind(idToken);
        }
      }

      // 解析 ID Token 获取用户信息
    } catch (e: any) {
      console.error(`Google 登录失败：${e?.message ?? e}`);
      // 显示更详细的错误信息
      if (e?.message?.includes("redirect_uri_mismatch")) {
        console.error("重定向 URI 不匹配，请检查 Google Cloud Console 配置");
        console.error("请在 Google Cloud Console 中添加以下重定向 URI:");
        console.error(`chrome-extension://${chrome.runtime.id}/oauth2`);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const googleLogout = async () => {
    if (!token) return;
    await new Promise<void>((resolve) => {
      chrome.identity.removeCachedAuthToken({ token }, () =>
        resolve(updateGoogleProfile(null))
      );
    });
  };

  return {
    toGoogleLogin,
    googleLogout,
    googleLoading,
  };
};
