import { HelpCircleIcon } from "lucide-react";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreditsInfo } from "@/modal/user";
import { getCreditsInfo } from "@/lib/api/user";

const historyData = [
  {
    type: "Bonus for new users",
    amount: "+1,000",
    date: "2025-09-18 20:08",
    isPositive: true,
  },
  {
    type: "Daily bonus",
    amount: "+150",
    date: "2025-09-18 20:08",
    isPositive: true,
  },
  {
    type: "Bonus for referral",
    amount: "+500",
    date: "2025-09-18 20:08",
    isPositive: true,
  },
  {
    type: "Research spend",
    amount: "-800",
    date: "2025-09-18 20:08",
    isPositive: false,
  },
  {
    type: "Research spend",
    amount: "-350",
    date: "2025-09-18 20:08",
    isPositive: false,
  },
  {
    type: "Subscribe Alpha Alert",
    amount: "-1,000",
    date: "2025-09-18 20:08",
    isPositive: false,
  },
  {
    type: "Top up",
    amount: "+1,000",
    date: "2025-09-18 20:08",
    isPositive: true,
  },
];

const Credits = () => {
  const [creditsDetail, setCreditsDetail] = useState<CreditsInfo | null>(null);
  const fetchCredits = async () => {
    try {
      const response = await getCreditsInfo();
      if (response.result && response.result?.account) {
        setCreditsDetail(response.result?.account);
      }
    } catch (error) {
      console.error("Failed", error);
    }
  };
  useEffect(() => {
    fetchCredits();
  }, []);
  return (
    <div className="">
      <div className="mt-0">
        <Card className="py-0 mb-4 bg-white rounded-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-normal">Credits</h2>
              <Button className="bg-brand-primary  text-[13px]  font-normal h-6 px-4 rounded-[22px] hover:bg-brand-primary/90">
                Top Up
              </Button>
            </div>

            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-normal ">Balance</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-normal ">
                  {creditsDetail?.balance || "--"}
                </span>
                <HelpCircleIcon className="w-3.5 h-3.5 " />
              </div>
            </div>

            <Separator className="mb-3 bg-brand-gray1/20" />

            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-normal ">
                Daily refresh credits
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-normal ">150+123</span>
                <HelpCircleIcon className="w-3.5 h-3.5 " />
              </div>
            </div>

            <p className="text-brand-gray1 font-normal  text-[11px]">
              Refresh to 150 at UTC-0 00:00 every day
            </p>

            <Separator className="my-3 bg-brand-gray1/20" />

            <div className="flex items-center justify-between">
              <span className="text-sm font-normal ">Stake to Boost</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-normal ">15x</span>
                <HelpCircleIcon className="w-3.5 h-3.5 " />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="py-0 bg-white rounded-lg">
          <CardContent className="p-4 pb-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-normal ">History</h3>
              <span className="text-xs font-normal ">
                Credits not received?
              </span>
            </div>

            <div className="space-y-0">
              {historyData.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex-1">
                      <div className="text-sm font-normal ">{item.type}</div>
                      <div className="font-normal text-[11px] mt-1 text-brand-gray1">
                        {item.date}
                      </div>
                    </div>
                    <div className="text-sm font-normal text-right text-brand-green">
                      {item.amount}
                    </div>
                  </div>
                  {index < historyData.length - 1 && (
                    <Separator className="bg-brand-gray1/20" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Credits;
