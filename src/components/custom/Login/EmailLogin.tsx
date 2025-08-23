import React, { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { emailLogin } from "@/lib/api/login";
import { useRootStore } from "@/store";

import { LoginState } from "./LoginBase";
import { LoginType } from "@/modal";
/**
 * Register
 * - 还原截图：返回/关闭、头像占位、Welcome 标题
 * - 表单包含：Email、Password、Confirm Password、Verification code（右侧倒计时/发送）
 * - 主按钮橙色，底部登录链接与协议文案
 */

export default function EmailLogin({
  changeState,
}: {
  changeState: (state: LoginState) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState<string>("");
  const { updateToken, setLoginModalOpen, updateLoginType } = useRootStore();

  const toEmailLogin = useCallback(async () => {
    try {
      if (!email || !pwd) {
        return;
      }
      setLoading(true);
      let par = {
        email: email,
        pwd: pwd,
      };
      const response = await emailLogin(par);
      if (response && response?.result) {
        updateToken(response.result.token);
        setLoginModalOpen(false);
        updateLoginType(LoginType.Email);
      }
    } catch (error) {
      console.error("Error during email registration:", error);
    } finally {
      setLoading(false);
    }
  }, [email, pwd]);

  const isDis = useMemo(() => {
    return !email || !pwd || loading;
  }, [email, pwd, loading]);

  return (
    <div className="">
      {/* 头像 + 标题 */}
      <div className="px-6 pt-1 pb-4 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-neutral-200 dark:bg-neutral-800" />
        <h2 className="mt-5 text-3xl font-semibold tracking-tight">Welcome</h2>
      </div>

      {/* 表单 */}
      <form className="px-6 pb-6 space-y-4">
        <div className="space-y-2">
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="h-12 rounded-2"
          />
        </div>

        <div className="space-y-2">
          <Input
            id="password"
            type="password"
            placeholder="Password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            className="h-12 rounded-2"
          />
        </div>

        <Button
          onClick={toEmailLogin}
          disabled={isDis}
          type="submit"
          className="w-full h-12 text-base text-white bg-orange-500 rounded-2 hover:bg-orange-500/90"
        >
          Login
        </Button>

        <div className="text-sm text-center text-neutral-700 dark:text-neutral-300">
          Don’t have an account? 
          <a
            href="#"
            className="font-medium text-orange-500 underline-offset-4 hover:underline"
            onClick={() => changeState(LoginState.EmailRegister)}
          >
            Sign Up
          </a>
        </div>
      </form>
    </div>
  );
}
