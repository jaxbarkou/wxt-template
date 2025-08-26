// entrypoints/sidepanel/App.tsx
import { useState } from "react";

// 用你的 client_id
const CLIENT_ID = "YOUR_CLIENT_ID.apps.googleusercontent.com";

/** Base64url + PKCE */
const b64url = (buf: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

async function createPkce() {
  const rnd = crypto.getRandomValues(new Uint8Array(32));
  const verifier = b64url(rnd.buffer);
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  const challenge = b64url(digest);
  return { verifier, challenge };
}

/** 仅供调试用的本地解码；正式校验放到后端 */
function decodeJwt<T = any>(jwt: string): T {
  const [, payload] = jwt.split(".");
  const s = payload.replace(/-/g, "+").replace(/_/g, "/");
  const json = decodeURIComponent(escape(atob(s)));
  return JSON.parse(json);
}

export default function App() {
  const [loading, setLoading] = useState(false);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [claims, setClaims] = useState<any>(null);

  const loginForIdToken = async () => {
    setLoading(true);
    try {
      const redirectUri = chrome.identity.getRedirectURL("oauth2"); // https://<ext-id>.chromiumapp.org/oauth2
      const nonce = Math.random().toString(36).slice(2);
      const { verifier, challenge } = await createPkce();

      // 1) 发起授权（response_type=code + PKCE）
      const authParams = new URLSearchParams({
        client_id: CLIENT_ID,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "openid email profile", // 有 openid 才会返回 id_token
        code_challenge: challenge,
        code_challenge_method: "S256",
        prompt: "consent",
        nonce, // 建议带上，后端可校验抗重放
      });
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${authParams}`;

      const redirected = await new Promise<string>((resolve, reject) => {
        chrome.identity.launchWebAuthFlow({ url: authUrl, interactive: true }, (u) => {
          if (chrome.runtime.lastError || !u) {
            reject(new Error(chrome.runtime.lastError?.message || "Empty redirect"));
          } else resolve(u);
        });
      });

      const code = new URL(redirected).searchParams.get("code");
      if (!code) throw new Error("No authorization code");

      // 2) 用 code+verifier 换 token（这里会返回 id_token）
      const tokenBody = new URLSearchParams({
        client_id: CLIENT_ID,
        code,
        code_verifier: verifier,
        redirect_uri: redirectUri,       // 与授权阶段完全一致
        grant_type: "authorization_code",
      });
      const tokenResp = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: tokenBody,
      }).then((r) => r.json() as Promise<{
        id_token: string;
        access_token: string;
        expires_in: number;
        token_type: "Bearer";
        scope: string;
        refresh_token?: string;
      }>);

      setIdToken(tokenResp.id_token);
      setClaims(decodeJwt(tokenResp.id_token)); // 调试查看声明（sub/email/name 等）
    } catch (e: any) {
      alert(`登录失败：${e?.message ?? e}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 w-[360px]">
      <button
        onClick={loginForIdToken}
        disabled={loading}
        className="w-full py-2 text-white bg-black rounded-xl"
      >
        {loading ? "正在登录…" : "获取 ID Token"}
      </button>

      {idToken && (
        <div className="mt-4 text-xs break-words">
          <div className="mb-1 font-semibold">ID Token (JWT):</div>
          <div className="mb-2">{idToken}</div>

          <div className="mb-1 font-semibold">Claims（调试）:</div>
          <pre>{JSON.stringify(claims, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
