// import { Link } from "react-router-dom";
import React, { use, useEffect, useState, useMemo } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useRootStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { X, Mail, ArrowLeft } from "lucide-react";
import { GoogleIcon } from "@/components/custom/svg";
import { useAccount } from "wagmi";
import _ from "lodash";
import { WalletButtonCustom } from "./WalletButtonCustom";
import Register from "./Register";
import EmailLogin from "./EmailLogin";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useGoogleLogin } from "@/hooks/useGoogleLogin";
import { GoogleLoginType } from "@/modal";
import logoImg from "@/assets/images/logo.png";

export enum LoginState {
  Base = "Base",
  EmailLogin = "EmailLogin",
  EmailRegister = "EmailRegister",
}

const LoginBase: React.FC = () => {
  const { loginModalOpen, setLoginModalOpen, token } = useRootStore();
  const { isConnected } = useAccount();
  const { handleLogin } = useLogin("");
  const { toGoogleLogin, googleLoading } = useGoogleLogin();
  const [curState, setCurState] = useState<LoginState>(LoginState.Base);
  const handleStateChange = (state: LoginState) => {
    setCurState(state);
  };

  useEffect(() => {
    const lightData = JSON.parse(localStorage.getItem("yomo") || "{}");
    const token = _.get(lightData, "state.token", "");
    if (isConnected && !token) {
      handleLogin();
    }
  }, [isConnected]);

  useEffect(() => {
    setCurState(LoginState.Base);
  }, [loginModalOpen]);

  return (
    <Drawer open={loginModalOpen} onOpenChange={setLoginModalOpen}>
      <DrawerContent className="w-full bg-white rounded-2">
        <div className="flex flex-col h-full p-4">
          {/* 顶部关闭 */}
          <div className="flex items-center justify-between h-6">
            <div>
              {curState !== LoginState.Base && (
                <div onClick={() => handleStateChange(LoginState.Base)}>
                  <ArrowLeft className="w-5 h-5" />
                </div>
              )}
            </div>
            <button
              aria-label="Close"
              onClick={() => setLoginModalOpen(false)}
              className="rounded-full hover:bg-black/5 dark:hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1">
            {/* base */}
            {curState === LoginState.Base && (
              <div>
                {/* 头像 + 标题 */}
                <div className="px-6 pt-1 pb-2 text-center">
                  <Avatar className="w-24 h-24 mx-auto rounded-full bg-neutral-200 dark:bg-neutral-800">
                    <AvatarImage src={logoImg} />
                  </Avatar>
                  <h2 className="mt-6 text-3xl font-semibold tracking-tight">
                    Log In
                  </h2>
                  <p className="mt-6 text-base text-neutral-600 dark:text-neutral-300">
                    Sign up to get{" "}
                    <span className="font-medium text-brand-primary">
                      150 free
                    </span>{" "}
                    Credits every day
                  </p>
                </div>
                {/* 登录方式 */}
                <div className="px-6 pb-6 mt-2 space-y-4">
                  <Button
                    variant="outline"
                    className="justify-center w-full h-12 gap-3 bg-white text-brand-black rounded-2 border-neutral-2"
                    onClick={() => {
                      toGoogleLogin(GoogleLoginType.Login);
                    }}
                    disabled={googleLoading}
                  >
                    <span className="inline-flex items-center justify-center w-6 h-6">
                      <GoogleIcon />
                    </span>
                    Continue with Google
                  </Button>

                  <Button
                    variant="outline"
                    className="justify-center w-full h-12 gap-3 bg-white text-brand-black rounded-2 border-neutral-200"
                    onClick={() => handleStateChange(LoginState.EmailLogin)}
                  >
                    <Mail className="w-5 h-5" />
                    Continue with E-mail
                  </Button>

                  <div className="flex items-center gap-3 py-2">
                    <Separator className="flex-1" />
                    <span className="text-sm text-neutral-500">Or</span>
                    <Separator className="flex-1" />
                  </div>

                  <WalletButtonCustom />

                  <div className="text-sm text-center text-neutral-700 dark:text-neutral-300">
                    Don’t have an account?{" "}
                    <a
                      href="#"
                      onClick={() =>
                        handleStateChange(LoginState.EmailRegister)
                      }
                      className="font-medium text-brand-primary underline-offset-4 hover:underline"
                    >
                      Sign Up
                    </a>
                  </div>
                </div>
              </div>
            )}
            {curState === LoginState.EmailRegister && (
              <Register changeState={handleStateChange} />
            )}
            {curState === LoginState.EmailLogin && (
              <EmailLogin changeState={handleStateChange} />
            )}
          </div>
          {/* 协议 */}
          <div className="px-6 pb-8 text-xs text-center text-muted-foreground">
            By continuing, you agree to the{" "}
            <a
              href="#"
              className="underline text-brand-primary underline-offset-4"
            >
              Terms of Use
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="underline text-brand-primary underline-offset-4"
            >
              Privacy Policy
            </a>
            .
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default LoginBase;
