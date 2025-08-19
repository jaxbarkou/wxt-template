import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PlusIcon, RefreshCwIcon } from "lucide-react";

const Account: React.FC = () => {
  const accountConnections = [
    {
      icon: "https://c.animaapp.com/tsXhjynw/img/vector-6.svg",
      label: "Crypto Wallet",
      value: "0x12aB6c...Dd098",
      hasAction: true,
    },
    {
      icon: "https://c.animaapp.com/tsXhjynw/img/vector-6.svg",
      label: "E-Mail",
      value: "useremail@gmail.com",
      hasAction: true,
    },
    {
      icon: "https://c.animaapp.com/tsXhjynw/img/vector-6.svg",
      label: "XIcon (Twitter)",
      value: "TwitterHandler",
      hasAction: true,
    },
    {
      icon: "https://c.animaapp.com/tsXhjynw/img/vector-2.svg",
      label: "Google",
      value: "",
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
              <div className="flex items-center gap-2">
                <span className="text-sm font-normal text-variable-collection">
                  Username - Kai
                </span>
                <img
                  className="w-2.5 h-2.5"
                  alt="Edit"
                  src="https://c.animaapp.com/tsXhjynw/img/vector-7.svg"
                />
              </div>
              <div className="text-xs font-normal text-variable-collection">
                useremail@gmail.com
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Connections */}
      <Card className="py-0 bg-white border-0">
        <CardContent className="p-0">
          {accountConnections.map((connection, index) => (
            <div key={connection.label}>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <img
                    className="w-[13px] h-[13px]"
                    alt={connection.label}
                    src={connection.icon}
                  />
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
                  {connection.value && (
                    <span className="text-sm font-normal text-right text-variable-collection">
                      {connection.value}
                    </span>
                  )}
                  {connection.showPlus && (
                    <PlusIcon className="w-4 h-4 text-variable-collection" />
                  )}
                  {connection.hasAction && (
                    <RefreshCwIcon className="w-4 h-4 text-variable-collection" />
                  )}
                </div>
              </div>
              {index < accountConnections.length - 1 && (
                <Separator className="mx-4" />
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
          <Separator className="mx-4" />
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
                <Separator className="mx-4" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Account;
