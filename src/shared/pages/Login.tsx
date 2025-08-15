import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCallback, useState } from "react";
import { emailRegister, emailLogin, getEmailCode } from "@/lib/api/login";
import { WalletButtonCustom } from "../components/WalletButtonCustom";
import { useRootStore } from "@/store";
import { useUserDetail } from "@/hooks/useUserDetail";
import { useMode } from "../context/ModeProvider";

const Login: React.FC = () => {
  const { mode } = useMode();
  const { updateToken, token } = useRootStore();
  const { fetchUserDetail } = useUserDetail();
  const [email, setEmail] = useState<string>("");
  const [pwd, setPwd] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPwd, setLoginPwd] = useState<string>("");

  const toEmailRegister = useCallback(async () => {
    try {
      if (!email || !pwd || !code) {
        return;
      }
      let par = {
        email: email,
        code: code,
        pwd: pwd,
        verifyPwd: pwd,
      };
      const response = await emailRegister(par);
      if (response && response?.result) {
        updateToken(response.result.token);
        console.log(
          "Email registration successful, token:",
          response.result.token
        );
        // 注册成功后获取用户详情
        await fetchUserDetail();
      }
    } catch (error) {
      console.error("Error during email registration:", error);
    }
  }, [email, pwd, code]);

  const toEmailLogin = useCallback(async () => {
    try {
      if (!loginEmail || !loginPwd) {
        return;
      }
      let par = {
        email: loginEmail,
        pwd: loginPwd,
      };
      const response = await emailLogin(par);
      if (response && response?.result) {
        updateToken(response.result.token);
        // 登录成功后获取用户详情
        await fetchUserDetail();
      }
    } catch (error) {
      console.error("Error during email registration:", error);
    }
  }, [loginEmail, loginPwd]);

  const getCode = useCallback(async () => {
    try {
      if (!email) {
        return;
      }
      const response = await getEmailCode(email);
      if (response) {
        console.log("Email code sent successfully");
      }
    } catch (error) {
      console.error("Error sending email code:", error);
    }
  }, [email]);

  return (
    <div className={`w-full ${mode === "options" ? "p-6" : "p-4"}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="mb-8 text-3xl font-bold text-white">Login</h1>
        {/* 导航链接 */}
        <div className="flex flex-wrap gap-4">
          <Link
            to="/"
            className="text-white transition-colors hover:text-blue-200"
          >
            返回首页
          </Link>
          <Link
            to="/user"
            className="text-white transition-colors hover:text-blue-200"
          >
            用户页面
          </Link>
          <Link
            to="/options"
            className="text-white transition-colors hover:text-blue-200"
          >
            设置页面
          </Link>
        </div>
        <div className="">
          <div>
            <div className="flex items-centert">
              <Input
                className="w-full h-10 bg-[#303338] rounded-[40px] border-none  font-normal text-white text-sm px-3"
                placeholder={"email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
              />
              <Button className="ml-2" onClick={getCode}>
                send code
              </Button>
            </div>
            <Input
              className="w-full mt-2 h-10 bg-[#303338] rounded-[40px] border-none  font-normal text-white text-sm px-3"
              placeholder={"code"}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoComplete="off"
            />
            <Input
              className="w-full mt-2 h-10 bg-[#303338] rounded-[40px] border-none  font-normal text-white text-sm px-3"
              placeholder={"password"}
              type="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              autoComplete="off"
            />
            <Button className="mt-2" onClick={toEmailRegister}>
              {" "}
              Email Register{" "}
            </Button>
          </div>
          <div className="mt-5">
            <Input
              className="w-full h-10 bg-[#303338] rounded-[40px] border-none  font-normal text-white text-sm px-3"
              placeholder={"email"}
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              autoComplete="off"
            />
            <Input
              className="mt-2 w-full h-10 bg-[#303338] rounded-[40px] border-none  font-normal text-white text-sm px-3"
              placeholder={"password"}
              type="password"
              value={loginPwd}
              onChange={(e) => setLoginPwd(e.target.value)}
              autoComplete="off"
            />
            <Button className="mt-2" onClick={toEmailLogin}>
              {" "}
              Email Login{" "}
            </Button>
          </div>
          <WalletButtonCustom showDetails={true} />

          <div>
            <span className="ml-4 text-white">Token: {token}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
