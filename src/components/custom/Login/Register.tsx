import React, { useState, useEffect, useCallback, use } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { emailRegister, getEmailCode } from "@/lib/api/login";
import { useRootStore } from "@/store";

import { LoginState } from "./LoginBase";
import { LoginType } from "@/modal";
import { useCustomToast } from "@/hooks/useCustomToast";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import logoImg from "@/assets/images/logo.png";

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
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPwd, setErrorPwd] = useState("");
  const [errorVerifyPwd, setErrorVerifyPwd] = useState("");

  const handleSendCode = useCallback(async () => {
    if (errorEmail || sending || countdown > 0) return;
    setSending(true);
    try {
      let res = await getEmailCode(email);
      if (res.code === 1) {
        setCountdown(60);
      } else {
        notify({ type: "error", message: res.message || "Login failed" });
      }
    } catch (e) {
      console.error("Failed to send code:", e);
      // 可根据需要提示错误
    } finally {
      setSending(false);
    }
  }, [errorEmail, sending, countdown]);

  const toCheckEmail = (val: string) => {
    setErrorEmail("");
    if (!val) {
      setErrorEmail("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(val)) {
      setErrorEmail("Invalid email format");
      return false;
    }
    return true;
  };

  const toCheckPwd = (val: string) => {
    setErrorPwd("");
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])\S{8,}$/;
    if (!val) {
      setErrorPwd("Password is required");
      return false;
    }
    if (!re.test(val)) {
      setErrorPwd("8+ chars: upper, lower, number & symbol.");
      return false;
    }
    return true;
  };

  const toCheckVerifyPwd = (val: string) => {
    setErrorVerifyPwd("");
    if (!val) {
      setErrorVerifyPwd("Confirm Password is required");
      return false;
    }
    if (val !== pwd) {
      setErrorVerifyPwd("Passwords do not match");
      return false;
    }
    return true;
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
    return errorEmail || errorPwd || errorVerifyPwd || !code || loading
      ? true
      : false;
  }, [errorEmail, errorPwd, errorVerifyPwd, sending, loading, code]);

  return (
    <div className="">
      {/* 头像 + 标题 */}
      <div className="px-6 pt-1 pb-4 text-center">
        <Avatar className="w-24 h-24 mx-auto rounded-full bg-neutral-200 dark:bg-neutral-800">
          <AvatarImage src={logoImg} />
        </Avatar>
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
            onBlur={(e) => toCheckEmail(e.target.value)}
            placeholder="Email Address"
            className="h-12 mb-0 rounded-2"
          />
          <div className="h-2.5">
            {errorEmail && (
              <span className="text-brand-red text-[10px] px-2">
                {errorEmail}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="relative">
            <Input
              id="code"
              inputMode="numeric"
              pattern="\d*"
              maxLength={6}
              placeholder="Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="h-12 pr-20 mb-0 rounded-2"
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
            onBlur={(e) => toCheckPwd(e.target.value)}
            className="h-12 mb-0 rounded-2"
          />
          <div className="h-2.5">
            {errorPwd && (
              <span className="text-brand-red text-[10px] px-2 ">
                {errorPwd}
              </span>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Input
            id="confirm"
            type="password"
            placeholder="Confirm Password"
            value={verifyPwd}
            onChange={(e) => setVerifyPwd(e.target.value)}
            onBlur={(e) => toCheckVerifyPwd(e.target.value)}
            className="h-12 mb-0 rounded-2"
          />
          <div className="h-2.5">
            {errorVerifyPwd && (
              <span className="text-brand-red text-[10px] px-2">
                {errorVerifyPwd}
              </span>
            )}
          </div>
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
