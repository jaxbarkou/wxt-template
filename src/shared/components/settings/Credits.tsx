import { HelpCircleIcon, RotateCw } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCreditsInfo } from "@/hooks/useCreditsInfo";
import NoImg from "@/assets/images/model-no-data.png";
import { useNavigate } from "react-router-dom";
import { CreditsHistoryItem } from "@/modal/user";
import { getCreditsHistory } from "@/lib/api/user";

const Credits = () => {
  const { fetchCreditsInfo, creditsInfo } = useCreditsInfo();
  const navigate = useNavigate();
  const [history, setHistory] = useState<CreditsHistoryItem[]>([]);

  const fetchHistory = async () => {
    try {
      // Fetch credits history
      let response = await getCreditsHistory();
      if (response.result) {
        setHistory(response.result.histories);
      }
    } catch (error) {
      console.error("Error fetching credits history:", error);
    }
  };

  useEffect(() => {
    fetchCreditsInfo();
    fetchHistory();
  }, []);
  const goTopUp = () => {
    navigate("/top-up");
  };
  return (
    <div className="h-full">
      <div className="flex flex-col h-full pb-4 mt-0">
        <Card className="py-0 mb-4 bg-white rounded-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-normal">Credits</h2>
              <Button
                onClick={goTopUp}
                className="bg-brand-primary  text-[13px]  font-normal h-6 px-4 rounded-[22px] hover:bg-brand-primary/90"
              >
                Top Up
              </Button>
            </div>

            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-normal ">Balance</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-normal ">
                  {creditsInfo?.balance || "--"}
                </span>
                <RotateCw
                  onClick={(e) => {
                    fetchCreditsInfo();
                    const el = e.currentTarget;
                    el.classList.remove("animate-[spin_0.6s_linear]");
                    requestAnimationFrame(() =>
                      el.classList.add("animate-[spin_0.6s_linear]")
                    );
                  }}
                  onAnimationEnd={(e) =>
                    e.currentTarget.classList.remove(
                      "animate-[spin_0.6s_linear]"
                    )
                  }
                  className="w-3.5 h-3.5 cursor-pointer"
                />
                {/* <HelpCircleIcon className="w-3.5 h-3.5 " /> */}
              </div>
            </div>

            <Separator className="mb-3 bg-brand-gray1/20" />

            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-normal ">
                Daily refresh credits
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-normal ">--</span>
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
                <span className="text-sm font-normal ">--x</span>
                <HelpCircleIcon className="w-3.5 h-3.5 " />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="flex-1 py-0 overflow-scroll bg-white rounded-lg">
          <CardContent className="p-4 pb-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-normal ">History</h3>
              <span className="text-xs font-normal ">
                Credits not received?
              </span>
            </div>

            <div className="space-y-0">
              {history.length > 0 &&
                history.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between py-2">
                      <div className="flex-1">
                        <div className="text-sm font-normal ">
                          {item.biz_title}
                        </div>
                        <div className="font-normal text-[11px] mt-1 text-brand-gray1">
                          {item.created_at}
                        </div>
                      </div>
                      <div className="text-sm font-normal text-right text-brand-green">
                        + {item.balance_change}
                      </div>
                    </div>
                    {index < history.length - 1 && (
                      <Separator className="bg-brand-gray1/20" />
                    )}
                  </div>
                ))}
              {history.length <= 0 && (
                <div className="flex flex-col items-center justify-center h-[330px]">
                  <img className="w-[145px] h-[109px]" src={NoImg} alt="" />
                  <p className="mt-4 text-sm font-normal text-center text-brand-gray1">
                    No data yet
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Credits;
