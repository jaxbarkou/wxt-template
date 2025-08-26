import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PlusIcon, RefreshCwIcon, Loader2 } from "lucide-react";
import { useRootStore } from "@/store";
import { useUserDetail } from "@/hooks/useUserDetail";
import { useLogout } from "@/hooks/useLogout";
import { foramtAddress } from "@/lib/utils";
import { SavedIcon, EidtIcon } from "@/components/custom/svg";
import { changeNickName } from "@/lib/api/user";
import ChangeEmailSection from "./ChangeEmail";
import Google2FaBind from "./Google2FaBind";
import ChangePasswordSection from "./ChangePassword"; // 添加导入
import DisplayHoverCard from "./DisplayHoverCard";
import { useNavigate } from "react-router-dom";
import { useCustomToast } from "@/hooks/useCustomToast";

const Account: React.FC = () => {
  const { userDetail } = useRootStore();
  const { fetchUserDetail } = useUserDetail();
  const { logout } = useLogout();
  const navigate = useNavigate();
  const { notify } = useCustomToast();
  const [nickName, setNickName] = useState(userDetail?.nickName || "");
  const [editNickNameModalOpen, setEditNickNameModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showGoogle2FaBindModal, setShowGoogle2FaBindModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false); // 添加密码弹窗状态

  const accountConnections = [
    {
      icon: "https://c.animaapp.com/tsXhjynw/img/vector-6.svg",
      label: "Crypto Wallet",
      value: foramtAddress(userDetail?.address || ""),
      hasAction: true,
    },
    {
      icon: "https://c.animaapp.com/tsXhjynw/img/vector-6.svg",
      label: "E-Mail",
      value: userDetail?.email || "-",
      hasAction: true,
      showEidt: userDetail?.email ? true : false,
      showPlus: userDetail?.email ? false : true,
    },
    {
      icon: "https://c.animaapp.com/tsXhjynw/img/vector-6.svg",
      label: "X(Twitter)",
      value: userDetail?.twitter || "-",
      hasAction: true,
      showEidt: userDetail?.twitter ? true : false,
      showPlus: userDetail?.twitter ? false : true,
    },
    {
      icon: "https://c.animaapp.com/tsXhjynw/img/vector-2.svg",
      label: "Google",
      value: userDetail?.gmail || "-",
      hasAction: false,
      showPlus: true,
    },
  ];

  const securitySettings = [
    {
      icon: "https://c.animaapp.com/tsXhjynw/img/vector-2.svg",
      label: "Password",
      value: userDetail?.password
        ? "Click to change password"
        : "Click to set password",
      hasAction: true, // 改为true，表示可以操作
      showPlus: !userDetail?.password ? true : false,
      showEidt: userDetail?.password ? true : false,
    },
    {
      icon: "https://c.animaapp.com/tsXhjynw/img/vector-6.svg",
      label: "2FA",
      value: userDetail?.authenticatorStatus
        ? "Manage your 2FA settings"
        : "Set up 2FA for security",
      hasAction: true,
      showEidt: userDetail?.authenticatorStatus ? true : false,
      showPlus: !userDetail?.authenticatorStatus ? true : false,
    },
  ];

  const handleChangeNickName = async () => {
    if (!nickName || isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      const res = await changeNickName(nickName);
      console.log("res", res);
      if (res) {
        setEditNickNameModalOpen(false);
        await fetchUserDetail();
      }
    } catch (error) {
      console.error("Failed to modify nickname:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // 处理各种操作
  const handleAction = (item: any) => {
    // 检查是否需要谷歌验证器绑定
    const needsGoogleAuth = (item.label === "E-Mail" || item.label === "Password") && 
                           !userDetail?.authenticatorStatus;
    
    if (needsGoogleAuth) {
      notify({
        message: "Please bind Google Authenticator first before proceeding with this operation.",
        type: "warning",
        duration: 4000
      });
      return;
    }

    if (item.label === "E-Mail") {
      setShowEmailModal(true);
    }
    if (item.label === "2FA") {
      setShowGoogle2FaBindModal(true);
    }
    if (item.label === "Password") {
      setShowPasswordModal(true);
    }
    // 其他连接项的处理可以在这里添加
  };

  // 处理各种弹窗关闭
  const handleEmailModalClose = () => {
    setShowEmailModal(false);
  };

  const handleGoogle2FaBindModalClose = () => {
    setShowGoogle2FaBindModal(false);
  };

  const handlePasswordModalClose = () => {
    setShowPasswordModal(false);
  };

  return (
    <div className="">
      {/* 用户资料部分 */}
      <Card className="py-0 bg-transparent border-0 shadow-none rounded-0">
        <CardContent className="px-0 py-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src="https://c.animaapp.com/tsXhjynw/img/image-9@2x.png" />
              <AvatarFallback>K</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              {!editNickNameModalOpen ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-normal text-variable-collection">
                    {userDetail?.nickName
                      ? userDetail?.nickName
                      : `Nickname`}
                  </span>
                  <img
                    className="w-2.5 h-2.5"
                    alt="Edit"
                    src="https://c.animaapp.com/tsXhjynw/img/vector-7.svg"
                    onClick={() => {
                      setEditNickNameModalOpen(true);
                    }}
                  />
                </div>
              ) : (
                <div className="flex items-center w-[140px] h-[24px] border border-[#F67C00] rounded-[4px] ">
                  <input
                    className="w-full h-full text-sm focus:outline-none pl-2"
                    placeholder="Nickname"
                    value={nickName}
                    onChange={(e) => setNickName(e.target.value)}
                    disabled={isSaving}
                  />
                  <div
                    className={`w-[24px] h-full border-l border-[#F67C00] flex items-center justify-center cursor-pointer ${
                      isSaving
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-[#F67C00] hover:bg-opacity-10"
                    }`}
                    onClick={() => !isSaving && handleChangeNickName()}
                  >
                    {isSaving ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#F67C00]" />
                    ) : (
                      <SavedIcon color="#F67C00" size={14} />
                    )}
                  </div>
                </div>
              )}

              <div className="text-xs font-normal text-variable-collection">
                {userDetail?.email || userDetail?.gmail || "-"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 账户连接 */}
      <Card className="py-0 bg-white border-0">
        <CardContent className="p-0">
          {accountConnections.map((connection, index) => (
            <div key={connection.label} className="box-border">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-normal text-variable-collection">
                    {connection.label}
                  </span>
                  {connection.label === "Crypto Wallet" && (
                    <img
                      className="w-3.5 h-3.5"
                      alt="Help"
                      src="https://c.animaapp.com/tsXhjynw/img/warning---circle-help.svg"
                    />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {connection.value && connection.value !== "-" ? (
                    <span className="text-sm text-[#979797] font-normal text-right text-variable-collection">
                      {connection.value}
                    </span>
                  ) : (
                    <span></span>
                  )}
                  {!connection.showPlus && !connection.showEidt && (
                    <img
                      className="w-[13px] h-[13px]"
                      alt={connection.label}
                      src={connection.icon}
                    />
                  )}
                  {connection.showPlus && (
                    <div
                      className="cursor-pointer hover:opacity-70 transition-opacity"
                      onClick={() => handleAction(connection)}
                    >
                      <PlusIcon className="w-4 h-4 text-variable-collection" />
                    </div>
                  )}
                  {connection.showEidt && (
                    <div
                      className="cursor-pointer hover:opacity-70 transition-opacity"
                      onClick={() => handleAction(connection)}
                    >
                      <EidtIcon className="w-4 h-4 text-variable-collection" />
                    </div>
                  )}
                </div>
              </div>
              {index < accountConnections.length - 1 && (
                <Separator className="mx-4" style={{ width: "auto" }} />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 安全设置部分 */}
      <Card className="py-0 mt-3 bg-white border-0">
        <CardContent className="p-0">
          <div className="p-4">
            <h2 className="text-base font-normal text-variable-collection">
              Security
            </h2>
          </div>
          <Separator className="mx-4" style={{ width: "auto" }} />
          {securitySettings.map((setting, index) => (
            <div key={setting.label}>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-normal text-variable-collection">
                    {setting.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-normal text-right text-[#979797] text-variable-collection">
                    {setting.value}
                  </span>
                  {!setting.showPlus && !setting.showEidt && (
                    <img
                      className="w-[13px] h-[13px]"
                      alt={setting.label}
                      src={setting.icon}
                    />
                  )}
                  {setting.showPlus && (
                    <div
                      className="cursor-pointer hover:opacity-70 transition-opacity"
                      onClick={() => handleAction(setting)}
                    >
                      <PlusIcon className="w-4 h-4 text-variable-collection" />
                    </div>
                  )}
                  {setting.showEidt && (
                    <div
                      className="cursor-pointer hover:opacity-70 transition-opacity"
                      onClick={() => handleAction(setting)}
                    >
                      <EidtIcon className="w-4 h-4 text-variable-collection" />
                    </div>
                  )}
                </div>
              </div>
              {index < securitySettings.length - 1 && (
                <Separator className="mx-4" style={{ width: "auto" }} />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <DisplayHoverCard className="mt-3" />

      {/* 退出登录按钮 */}
      <div className="mt-2">
        <Button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="w-full mt-3"
        >
          Logout
        </Button>
      </div>

      {/* 各种弹窗 */}
      {showEmailModal && <ChangeEmailSection onClose={handleEmailModalClose} />}
      {showGoogle2FaBindModal && (
        <Google2FaBind onClose={handleGoogle2FaBindModalClose} />
      )}
      {showPasswordModal && (
        <ChangePasswordSection onClose={handlePasswordModalClose} />
      )}
    </div>
  );
};

export default Account;
