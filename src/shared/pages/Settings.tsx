import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import Account from "../components/settings/Account";
import Credits from "../components/settings/Credits";
const Settings: React.FC = () => {
  const tabItems = [
    { value: "account", label: "Account" },
    { value: "credits", label: "Credits" },
    { value: "stake", label: "Stake" },
    { value: "earns", label: "Earns" },
  ];
  return (
    <div className="w-full h-full mx-auto bg-[#F6F6F8]">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <h1 className="text-base font-normal text-brand-black">Settings</h1>
        </div>
      </div>
      <Tabs defaultValue="account" className="flex flex-col flex-1">
        <div className="px-4">
          <TabsList className="grid w-full h-auto grid-cols-4 gap-4 p-0 bg-transparent">
            {tabItems.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  "relative px-2 py-2 text-sm font-medium text-zinc-400 data-[state=active]:shadow-none data-[state=active]:bg-transparent rounded-0",
                  "data-[state=active]:text-brand-primary",
                  "after:absolute after:left-0 after:right-0 after:mx-auto",
                  "after:-bottom-1 after:h-1 after:w-16 after:rounded-full after:bg-orange-500",
                  "after:opacity-0 data-[state=active]:after:opacity-100",
                  "after:transition-all"
                )}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="w-5 h-0.5 bg-variable-collection rounded-[22px] mt-1 ml-auto mr-16" />
        </div>
        <TabsContent value="account" className="flex-1 px-4 ">
          <Account />
        </TabsContent>
        <TabsContent value="credits" className="flex-1 px-4">
          <Credits />
        </TabsContent>
        <TabsContent value="earns" className="flex-1 px-4 ">
          earns
        </TabsContent>
        <TabsContent value="stake" className="flex-1 px-4 ">
          stake
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
