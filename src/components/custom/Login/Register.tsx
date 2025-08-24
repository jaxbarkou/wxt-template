import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { emailRegister, getEmailCode } from "@/lib/api/login";
import { useRootStore } from "@/store";

import { LoginState } from "./LoginBase";
import { LoginType } from "@/modal";
import { useCustomToast } from "@/hooks/useCustomToast";
/**
 * Register
 * - 还原截图：返回/关闭、头像占位、Welcome 标题
 * - 表单包含：Email、Password、Confirm Password、Verification code（右侧倒计时/发送）
 * - 主按钮橙色，底部登录链接与协议文案
 */

export default function Register({
  changeState,
}: {
  changeState: (state: LoginState) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [sending, setSending] = useState(false);
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState<string>("");
  const [verifyPwd, setVerifyPwd] = useState<string>("");
  const { updateToken, setLoginModalOpen, updateLoginType } = useRootStore();
  const [code, setCode] = useState<string>("");
  const { notify } = useCustomToast();

  const handleSendCode = async () => {
    if (!email || sending || countdown > 0) return;
    setSending(true);
    try {
      await getEmailCode(email);
      setCountdown(60);
    } catch (e) {
      console.error("Failed to send code:", e);
      // 可根据需要提示错误
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (countdown === 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const toEmailRegister = useCallback(async () => {
    try {
      if (!email || !pwd || !code) {
        return;
      }
      setLoading(true);
      let par = {
        email: email,
        code: code,
        pwd: pwd,
        verifyPwd: pwd,
      };
      const response = await emailRegister(par);
      if (response.code === 1 && response?.result) {
        updateToken(response.result.token);
        setLoginModalOpen(false);
        updateLoginType(LoginType.Email);
        console.log(
          "Email registration successful, token:",
          response.result.token
        );
      } else {
        notify({ type: "error", message: response.message || "Login failed" });
      }
    } catch (error) {
      console.error("Error during email registration:", error);
    } finally {
      setLoading(false);
    }
  }, [email, pwd, code]);

  const isDis = useMemo(() => {
    return !email || !pwd || !verifyPwd || pwd !== verifyPwd || loading;
  }, [email, pwd, verifyPwd, sending, countdown, loading]);

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
          <div className="relative">
            <Input
              id="code"
              inputMode="numeric"
              placeholder="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="h-12 pr-20 rounded-2"
            />
            {/* 发送/倒计时 */}
            <button
              type="button"
              onClick={handleSendCode}
              className="absolute px-3 py-1 text-sm font-medium text-orange-500 -translate-y-1/2 right-3 top-1/2 hover:underline"
            >
              {countdown > 0 ? `${countdown}s` : "Get Code"}
            </button>
          </div>
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

        <div className="space-y-2">
          <Input
            id="confirm"
            type="password"
            placeholder="Confirm Password"
            value={verifyPwd}
            onChange={(e) => setVerifyPwd(e.target.value)}
            className="h-12 rounded-2"
          />
        </div>

        <Button
          onClick={toEmailRegister}
          disabled={isDis}
          type="submit"
          className="w-full h-12 text-base text-white bg-orange-500 rounded-2 hover:bg-orange-500/90"
        >
          Sign Up
        </Button>

        <div className="text-sm text-center text-neutral-700 dark:text-neutral-300">
          Already have an account?{" "}
          <a
            href="#"
            className="font-medium text-orange-500 underline-offset-4 hover:underline"
            onClick={() => changeState(LoginState.EmailLogin)}
          >
            Sign In
          </a>
        </div>
      </form>
    </div>
  );
}
