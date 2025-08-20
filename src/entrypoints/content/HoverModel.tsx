import React, { useState, useEffect } from "react";
import "@/assets/style/globals.css";
import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";

interface AppProps {
  symbol?: string;
  onClose?: () => void;
}

const HoverModel: React.FC<AppProps> = ({ symbol, onClose }) => {
  const [position, setPosition] = useState({ x: -9999, y: -9999 });
  // const [isLoading, setIsLoading] = useState(false);
  const [projectsData, setProjectsData] = useState(null);

  const socialLinks = [
    { label: "Website", active: false },
    { label: "Twitter", active: false },
    { label: "Defillama", active: false },
    { label: "Telegram", active: false },
    { label: "Discord", active: false },
  ];

  const tradingMetrics = [
    {
      label: "Trading Volume(24h)",
      value: "$890.25K",
      change: "-32.46%",
      changeColor: "text-[#f60000]",
    },
    { label: "Circulating Market Cap", value: "$43.56M", rank: "#147" },
    { label: "Fully Diluted Valuation", value: "$238.46M" },
  ];

  const questData = [
    { label: "奖励总价值", value: "100K EIGEN ($15K)" },
    { label: "参与人数", value: "8,329" },
    { label: "社区攻略", value: "3篇，点赞最高 1.2K" },
  ];

  const communityData = [
    { label: "XIcon(Twitter)", value: "220.09K (0.12%/7d)" },
    { label: "推特提及量", value: "8,329 (+1.25%/7d)" },
    { label: "情感", value: "😀 68%  😡 12%  😐 20%" },
  ];

  const chartDates = ["07.01", "07.04", "07.07", "07.10", "07.14"];
  const chartValues = ["100", "50", "0"];

  const fetchBaseData = useCallback(async () => {
    if (!symbol) return;
    try {
      let url = `http://34.142.207.10:5050/api/v1/projects/lookup?type=ticker&value=${symbol}`;
      chrome.runtime.sendMessage(
        { type: "FETCH_PROJECTS_DATA", url },
        (res) => {
          if (res.success && res.data?.code === 200) {
            setProjectsData(res.data?.data || null);
          } else {
            setProjectsData(null);
          }
        }
      );
    } catch (error) {
      console.error("Error fetching base data:", error);
    }
    // setProjectsData(data);
  }, [symbol]);

  useEffect(() => {
    const currentPosition = (window as any).__tooltipPosition__ || {
      x: -9999,
      y: -9999,
    };
    setPosition(currentPosition);
  }, [symbol]);

  useEffect(() => {
    fetchBaseData();
  }, [symbol]);

  // 鼠标事件处理
  const handleMouseEnter = () => {
    // 通知父组件鼠标进入
    if ((window as any).__tooltipMouseEnter) {
      (window as any).__tooltipMouseEnter();
    }
  };

  const handleMouseLeave = () => {
    // 通知父组件鼠标离开
    if ((window as any).__tooltipMouseLeave) {
      (window as any).__tooltipMouseLeave();
    }
  };

  return (
    <>
      <div
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
        className="fixed bg-white z-100000"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Card className="w-[550px] bg-white rounded-lg shadow-[0px_0px_8px_#00000029] border-0 py-0">
          <CardContent className="flex flex-col h-full p-0">
            {/* Header Section */}
            <header className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 bg-brand-primary">
                  <AvatarFallback className="text-white bg-brand-primary">
                    E
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="[font-family:'Arboria-Medium-☞',Helvetica] font-normal text-black text-sm">
                      EigenLayer
                    </h1>
                    <StarIcon className="w-[15px] h-[15px]" />
                  </div>
                  <p className="[font-family:'Arboria-Book-☞',Helvetica] font-normal text-gray-600 text-xs">
                    Verifiable Cloud Service Platform
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-5 h-5 p-0 rounded"
                >
                  <img
                    className="w-3 h-3.5"
                    alt="Union"
                    src="https://c.animaapp.com/ow4Izvy8/img/union.svg"
                  />
                </Button>
                <Button variant="ghost" size="icon" className="w-5 h-5 p-0">
                  <img
                    className="w-5 h-5"
                    alt="Group"
                    src="https://c.animaapp.com/ow4Izvy8/img/group-48096858@2x.png"
                  />
                </Button>
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="icon"
                  className="w-5 h-5 p-0"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </header>

            {/* Social Links */}
            <nav className="flex gap-2 px-3 mb-4">
              {socialLinks.map((link, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="w-[70px] h-6 bg-brand-gray1 rounded-[22px] justify-center text-xs [font-family:'Arboria-Book-☞',Helvetica] font-normal text-gray-700 cursor-pointer hover:opacity-80"
                >
                  {link.label}
                </Badge>
              ))}
            </nav>

            {/* Main Content Area - Flex Layout */}
            <div className="flex flex-col flex-1 px-3">
              {/* Chart and Trading Metrics Row */}
              <div className="flex gap-4 mb-4">
                {/* Chart Section */}
                <div className="flex-1">
                  <div className="relative">
                    {/* Token Price Section */}
                    <section className="px-3.5 mb-6">
                      <div className="[font-family:'Arboria-Book-☞',Helvetica] font-normal text-gray-600 text-xs mb-2">
                        Token Price ($EIGEN)
                      </div>
                      <div className="[font-family:'Arboria-Medium-Regular',Helvetica] font-normal text-xl">
                        <span className="text-[#1aba14]">$1.3704 </span>
                        <span className="text-[#2c2c2c] text-sm">(+3.51%)</span>
                      </div>
                    </section>

                    {/* Chart area */}
                    <div className="ml-[34px] relative">
                      <img
                        className="w-[223px] h-[49px]"
                        alt="Rectangle"
                        src="https://c.animaapp.com/ow4Izvy8/img/rectangle-34624904.svg"
                      />
                      <img
                        className="absolute w-[223px] h-[45px] top-1 left-0"
                        alt="Vector"
                        src="https://c.animaapp.com/ow4Izvy8/img/vector-3.svg"
                      />
                      <img
                        className="absolute w-[223px] h-[42px] top-3 left-0"
                        alt="Vector"
                        src="https://c.animaapp.com/ow4Izvy8/img/vector-2.svg"
                      />
                    </div>

                    {/* X-axis labels */}
                    <div className="flex justify-between ml-[34px] w-[223px] mt-1">
                      {chartDates.map((date, index) => (
                        <div
                          key={index}
                          className="[font-family:'Arboria-Book-☞',Helvetica] text-gray-500 text-[10px] whitespace-nowrap font-normal"
                        >
                          {date}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Trading Metrics Card */}
                <Card className="w-[257px] bg-[#f6f6f8] rounded-lg border-0 py-0">
                  <CardContent className="p-3 space-y-3">
                    {tradingMetrics.map((metric, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="[font-family:'Arboria-Book-☞',Helvetica] font-normal text-gray-600 text-xs">
                          {metric.label}
                        </div>
                        <div className="[font-family:'Arboria-Medium-Regular',Helvetica] font-normal text-xs text-right">
                          <span className="text-[#2c2c2c]">{metric.value}</span>
                          {metric.change && (
                            <span className={metric.changeColor}>
                              {" "}
                              {metric.change}
                            </span>
                          )}
                          {metric.rank && (
                            <span className="text-[#9e9e9e]">
                              {" "}
                              {metric.rank}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center justify-between">
                      <div className="[font-family:'Arboria-Book-☞',Helvetica] font-normal text-gray-600 text-xs">
                        Support Exchanges
                      </div>
                      <div className="flex -space-x-2">
                        <div className="w-5 h-5 bg-[#d9d9d9] rounded-[10px] border border-solid border-variable-collection" />
                        <div className="w-5 h-5 bg-[#d9d9d9] rounded-[10px] border border-solid border-[#7c90f6]" />
                        <div className="w-5 h-5 bg-[#d9d9d9] rounded-[10px] border border-solid border-variable-collection" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Bottom Cards Row */}
              <div className="flex gap-4">
                {/* Quest Campaigns Card */}
                <Card className="flex-1 bg-[#f6f6f8] rounded-lg border-0 py-0">
                  <CardContent className="p-3">
                    <h3 className="[font-family:'Arboria-Medium-☞',Helvetica] font-normal text-black text-sm mb-4">
                      Quest Campaigns
                    </h3>
                    <div className="space-y-3">
                      {questData.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="[font-family:'Arboria-Book-☞',Helvetica] text-gray-600 text-xs font-normal">
                            {item.label}
                          </div>
                          <div className="[font-family:'Arboria-Medium-☞',Helvetica] font-normal text-black text-xs text-right">
                            {item.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Community Heat Card */}
                <Card className="flex-1 bg-[#f6f6f8] rounded-lg border-0 py-0">
                  <CardContent className="p-3">
                    <h3 className="[font-family:'Arboria-Medium-☞',Helvetica] text-black text-sm font-normal mb-4">
                      社区热度
                    </h3>
                    <div className="space-y-3">
                      {communityData.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="[font-family:'Arboria-Book-☞',Helvetica] text-gray-600 text-xs font-normal">
                            {item.label}
                          </div>
                          <div className="[font-family:'Arboria-Medium-☞',Helvetica] font-normal text-black text-xs text-right">
                            {item.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Footer */}
            <footer className="flex items-center justify-between p-3 mt-auto">
              <div className="flex items-center gap-3">
                <Avatar className="w-[26px] h-[26px] bg-[#d9d9d9]">
                  <AvatarFallback className="bg-[#d9d9d9]"></AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2">
                  <div className="[font-family:'Lemon',Helvetica] font-normal text-black text-xl">
                    Yomo
                  </div>
                  <img
                    className="w-px h-4"
                    alt="Line"
                    src="https://c.animaapp.com/ow4Izvy8/img/line-16.svg"
                  />
                  <div className="[font-family:'Arboria-Medium-☞',Helvetica] font-normal text-gray-600 text-[13px]">
                    your web3 navigator
                  </div>
                </div>
              </div>
              <Button className="h-auto bg-brand-primary rounded-[22px] px-3 py-1.5 hover:opacity-90">
                <span className="[font-family:'Arboria-Medium-☞',Helvetica] font-normal text-white text-[13px] mr-2">
                  View more
                </span>
                <img
                  className="w-2.5 h-2.5"
                  alt="Vector stroke"
                  src="https://c.animaapp.com/ow4Izvy8/img/vector--stroke-.svg"
                />
              </Button>
            </footer>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default HoverModel;
