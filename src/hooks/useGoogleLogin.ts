import { GoogleProfile } from "@/modal/user";
import { useEffect, useState } from "react";
import { useRootStore } from "@/store";
import { LoginType } from "@/modal";

// —— 工具：base64url / PKCE
// 小工具：解析 URL hash 片段（#a=1&b=2）
function parseHash(hash: string): Record<string, string> {
  const q = new URLSearchParams(hash.startsWith("#") ? hash.slice(1) : hash);
  const obj: Record<string, string> = {};
  for (const [k, v] of q.entries()) obj[k] = v;
  return obj;
}

function buildQuery(params: Record<string, string>) {
  return Object.keys(params)
    .map((k) => `${k}=${encodeURIComponent(params[k])}`) // ← 手动编码（只编码一次）
    .join("&");
}

// 解析 JWT Token 的函数（不验证签名，仅解码）
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
}

export const useGoogleLogin = () => {
  const [googleLoading, setGoogleLoading] = useState(false);
  const updateToken = useRootStore((state) => state.updateToken);
  const updateLoginType = useRootStore((state) => state.updateLoginType);
  const token = useRootStore((state) => state.token);
  const updateGoogleProfile = useRootStore(
    (state) => state.updateGoogleProfile
  );

  const fetchGoogleUserinfo = async (accessToken: string) => {
    const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error(`userinfo ${res.status}`);
    return (await res.json()) as GoogleProfile;
  };

  const googleLogin = async () => {
    setGoogleLoading(true);
    try {
      // 获取 manifest 信息进行调试
      const manifest = chrome.runtime.getManifest();
      console.log("Extension Manifest:", manifest);
      console.log("OAuth2 Config:", manifest.oauth2);
      
      if (!manifest.oauth2?.client_id) {
        throw new Error("OAuth2 client_id not configured in manifest");
      }

      // 生成随机 nonce 用于安全验证
      const nonce = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      // 构建 OAuth2 授权 URL，请求 ID Token
      const clientId = encodeURIComponent(manifest.oauth2.client_id);
      const scopes = encodeURIComponent((manifest.oauth2.scopes || ["openid", "email", "profile"]).join(" "));
      const redirectUri = chrome.identity.getRedirectURL("oauth2");
      
      // 调试：显示实际的重定向 URI
      console.log("=== 重定向 URI 调试信息1 ===");
      console.log("Extension ID:", chrome.runtime.id);
      console.log("Actual Redirect URI:", redirectUri);
      console.log("Expected format: chrome-extension://<extension-id>/oauth2");
      console.log("================================");
      
      const encodedRedirectUri = encodeURIComponent(redirectUri);
      
      const authUrl = 
        `https://accounts.google.com/o/oauth2/v2/auth` +
        `?client_id=${clientId}` +
        `&response_type=id_token` + // 请求 ID Token
        `&redirect_uri=${encodedRedirectUri}` +
        `&scope=${scopes}` +
        `&nonce=${encodeURIComponent(nonce)}` + // 安全验证
        `&prompt=consent`; // 强制显示同意页面
      
      console.log("Auth URL:", authUrl);
      
      // 使用 launchWebAuthFlow 获取 ID Token
      const redirectUrl = await new Promise<string>((resolve, reject) => {
        chrome.identity.launchWebAuthFlow(
          { url: authUrl, interactive: true },
          (redirectedTo) => {
            if (chrome.runtime.lastError) {
              console.error("Chrome Identity Error:", chrome.runtime.lastError);
              reject(new Error(chrome.runtime.lastError.message));
              return;
            }
            if (!redirectedTo) {
              reject(new Error("No redirect URL received"));
              return;
            }
            resolve(redirectedTo);
          }
        );
      });
      
      console.log("Redirected URL:", redirectUrl);
      
      // 从重定向 URL 中解析 ID Token
      const url = new URL(redirectUrl);
      const fragment = url.hash.substring(1); // 移除开头的 #
      const params = new URLSearchParams(fragment);
      const idToken = params.get("id_token");
      
      if (!idToken) {
        throw new Error("No ID token received");
      }
      
      console.log("Google ID Token:", idToken);
      
      // 解析 ID Token 获取用户信息
      const tokenPayload = parseJwt(idToken);
      console.log("Token Payload:", tokenPayload);
      
      if (tokenPayload) {
        // 验证 nonce（可选，增加安全性）
        if (tokenPayload.nonce !== nonce) {
          console.warn("Nonce mismatch, but continuing...");
        }
        
        // 从 ID Token 中提取用户信息
        const userInfo: GoogleProfile = {
          sub: tokenPayload.sub,
          name: tokenPayload.name,
          picture: tokenPayload.picture,
          email: tokenPayload.email,
        };
        
        console.log("User Info from ID Token:", userInfo);
        
        // 更新状态
        // updateToken(idToken); // 存储 ID Token
        // updateLoginType(LoginType.Google);
        // updateGoogleProfile(userInfo);
      }
      
    } catch (e: any) {
      console.error(`Google 登录失败：${e?.message ?? e}`);
      // 显示更详细的错误信息
      if (e?.message?.includes('redirect_uri_mismatch')) {
        console.error("重定向 URI 不匹配，请检查 Google Cloud Console 配置");
        console.error("请在 Google Cloud Console 中添加以下重定向 URI:");
        console.error(`chrome-extension://${chrome.runtime.id}/oauth2`);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  // （Access Token）登录逻辑
  const googleLoginWithAccessToken = async () => {
    setGoogleLoading(true);
    try {
      // 获取 manifest 信息进行调试
      const manifest = chrome.runtime.getManifest();
      console.log("Extension Manifest:", manifest);
      console.log("OAuth2 Config:", manifest.oauth2);
      
      // 使用 chrome.identity.getAuthToken 进行 OAuth2 认证（返回 Access Token）
      const accessToken = await new Promise<string>((resolve, reject) => {
        chrome.identity.getAuthToken(
          {
            interactive: true,
            scopes: ["openid", "email", "profile"],
          },
          (result) => {
            const token = typeof result === "string" ? result : (result as any)?.token;
            console.log("Chrome Identity Result:", result);
            if (chrome.runtime.lastError || !token) {
              console.error("Chrome Identity Error:", chrome.runtime.lastError);
              console.error("Full Error Details:", {
                lastError: chrome.runtime.lastError,
                result: result,
                manifest: manifest,
              });
              reject(new Error(chrome.runtime.lastError?.message || "No token"));
            } else {
              resolve(token);
            }
          }
        );
      });

      console.log("Google Access Token:", accessToken);
      if (accessToken) {
        updateToken(accessToken);
        updateLoginType(LoginType.Google);
        const me = await fetchGoogleUserinfo(accessToken);
        console.log("Google User Info:", me);
        if (me) {
          updateGoogleProfile(me);
        }
      }
    } catch (e: any) {
      console.error(`Google 登录失败：${e?.message ?? e}`);
      // 显示更详细的错误信息
      if (e?.message?.includes('redirect_uri_mismatch')) {
        console.error("重定向 URI 不匹配，请检查 Google Cloud Console 配置");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  //loginWithIdToken 方法
  const loginWithIdToken = async () => {
    setGoogleLoading(true);
    try {
      const manifest = chrome.runtime.getManifest();
      console.log("Manifest:", manifest);
      if (manifest.oauth2 && manifest.oauth2.scopes) {
        const clientId = encodeURIComponent(manifest.oauth2.client_id);
        const scopes = encodeURIComponent(manifest.oauth2.scopes.join(" "));
        const redirectUri = encodeURIComponent(
          chrome.identity.getRedirectURL("oauth2")
        );

        const url =
          `https://accounts.google.com/o/oauth2/v2/auth` +
          `?client_id=${clientId}` +
          `&response_type=id_token` + // Requesting the ID token
          `&access_type=offline` +
          `&nonce=testnonce` + // Recommended for security
          `&redirect_uri=${redirectUri}` +
          `&scope=${scopes}`;
        console.log("url:", url, redirectUri, clientId);
        chrome.identity.launchWebAuthFlow(
          { url: url, interactive: true },
          function (redirectedTo) {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
              return;
            }
            console.log("Redirected URL:", redirectedTo);
            // Parse the ID token from the redirected URL's hash fragment
            if (redirectedTo) {
              const params = new URLSearchParams(redirectedTo.split("#")[1]);
              const idToken = params.get("id_token");
              console.log("ID Token:", idToken);
            }
            // You can now send this ID token to your backend for verification
          }
        );
      }

      // const redirectUri = chrome.identity.getRedirectURL("oauth2");
      // const nonce = Math.random().toString(36).slice(2);
      // const GOOGLE_CLIENT_ID =
      //   "1021555181956-gu9qogddnf9184lvtsklivqr4d2is93t.apps.googleusercontent.com";

      // const AUTH_BASE = "https://accounts.google.com/o/oauth2/v2/auth";
      // const query = buildQuery({
      //   client_id: GOOGLE_CLIENT_ID,
      //   redirect_uri: redirectUri, // 这里需要编码，但只编码一次（我们上面已做）
      //   response_type: "id_token",
      //   scope: "openid email profile", // 空格会被编码成 %20，OK
      //   prompt: "consent",
      //   nonce,
      // });

      // const authUrl = `${AUTH_BASE}?${query}`;
      // console.log("Auth URL:", authUrl);
      // const redirect = await chrome.identity.launchWebAuthFlow({
      //   url: authUrl,
      //   interactive: true,
      // });

      // console.log(redirect);

      // if (!redirect) {
      //   return;
      // }

      // const { hash } = new URL(redirect);
      // console.log(hash);
      // const data = parseHash(hash);
      // console.log("datadatadata", data);
    } catch (e: any) {
      alert(`登录失败：${e?.message ?? e}`);
    } finally {
      setGoogleLoading(false);
    }
  };

  const googleLogout = async () => {
    if (!token) return;
    await new Promise<void>((resolve) => {
      chrome.identity.removeCachedAuthToken({ token }, () => resolve());
    });
  };

  return {
    fetchGoogleUserinfo,
    googleLogin,
    googleLoginWithAccessToken,
    loginWithIdToken,
    googleLogout,
    googleLoading,
  };
};
