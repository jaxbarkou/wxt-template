import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PlusIcon, RefreshCwIcon, Loader2 } from "lucide-react";
import { useRootStore } from "@/store";
import { useUserDetail } from "@/hooks/useUserDetail";
import { foramtAddress } from "@/lib/utils";
import { SavedIcon } from "@/components/custom/svg";
import { changeNickName } from "@/lib/api/user";
import ChangeEmailSection from "./ChangeEmail";
const Account: React.FC = () => {
  const { userDetail } = useRootStore();
  const { fetchUserDetail } = useUserDetail();
  const [nickName, setNickName] = useState(userDetail?.nickName || "");
  const [editNickNameModalOpen, setEditNickNameModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // 添加loading状态
  const accountConnections = [
    {
      icon: "https://c.animaapp.com/tsXhjynw/img/vector-6.svg",
      label: "Crypto Wallet",
      value: foramtAddress(userDetail?.address || "-"),
      hasAction: true,
    },
    {
      icon: "https://c.animaapp.com/tsXhjynw/img/vector-6.svg",
      label: "E-Mail",
      value: userDetail?.email || "-",
      hasAction: true,
    },
    {
      icon: "https://c.animaapp.com/tsXhjynw/img/vector-6.svg",
      label: "XIcon (Twitter)",
      value: userDetail?.twitter || "-",
      hasAction: true,
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
      icon: "https://c.animaapp.com/tsXhjynw/img/vector-6.svg",
      label: "2FA",
      value: "Updated on Aug 9, 2025",
      hasAction: true,
    },
    {
      icon: "https://c.animaapp.com/tsXhjynw/img/vector-2.svg",
      label: "Password",
      value: "Set up to enable email login",
      hasAction: false,
      showPlus: true,
    },
  ];
  const handleChangeNickName = async () => {
    if (!nickName || isSaving) {
      return;
    }
    
    setIsSaving(true); // 开始loading
    
    try {
      const res = await changeNickName(nickName);
      console.log("res", res);
      if (res) {
        setEditNickNameModalOpen(false);
        await fetchUserDetail();
      }
    } catch (error) {
      console.error("修改昵称失败:", error);
      // 可以在这里添加错误提示
    } finally {
      setIsSaving(false); // 结束loading
    }
  };
  return (
    <div className="">
      {/* User Profile Section */}
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
                   {userDetail?.nickName?userDetail?.nickName: `Username - `}
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
                    placeholder="Username"
                    value={nickName}
                    onChange={(e) => setNickName(e.target.value)}
                    disabled={isSaving} // 保存时禁用输入
                  />
                  <div
                    className={`w-[24px] h-full border-l border-[#F67C00] rounded-r-[4px] flex items-center justify-center cursor-pointer ${
                      isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#fff] hover:bg-opacity-10'
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

      {/* Account Connections */}
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
                  <img
                    className="w-[13px] h-[13px]"
                    alt={connection.label}
                    src={connection.icon}
                  />
                </div>
              </div>
              {index < accountConnections.length - 1 && (
                <Separator className="mx-4" style={{ width: "auto" }} />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security Section */}
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
                  <img
                    className="w-[13px] h-[13px]"
                    alt={setting.label}
                    src={setting.icon}
                  />
                  <span className="text-sm font-normal text-variable-collection">
                    {setting.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-normal text-right text-variable-collection">
                    {setting.value}
                  </span>
                  {setting.showPlus && (
                    <PlusIcon className="w-4 h-4 text-variable-collection" />
                  )}
                  {setting.hasAction && (
                    <RefreshCwIcon className="w-4 h-4 text-variable-collection" />
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
      <ChangeEmailSection />
    </div>
  );
};

export default Account;
