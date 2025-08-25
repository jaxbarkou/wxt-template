import React, { useState, useEffect, useCallback, useMemo } from "react";
import "@/assets/style/globals.css";
import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";
import MoreIcon from "@/assets/images/more.png";
// import ShareIcon from "@/assets/images/shared.png";
import DisplayHoverCard from "@/shared/components/settings/DisplayHoverCard";
// import mockProjectData from "@/mock/mockProjectData";
import { ProjectData } from "@/modal/project";
import PanelTvlChat from "@/components/custom/PanelTvlChat";
import { numFormat, toMonthDay } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import NoImg from "@/assets/images/model-no-data.png";
import { ArrowUpRight } from "lucide-react";
import logo from "@/assets/images/slide-logo.png";

interface AppProps {
  symbol?: string;
  onClose?: () => void;
}

const HoverModel: React.FC<AppProps> = ({ symbol, onClose }) => {
  const [position, setPosition] = useState({ x: -9999, y: -9999 });
  const [isLoading, setIsLoading] = useState(false);
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [showHoverCard, setShowHoverCard] = useState(false);

  const socialLinks = useMemo(() => {
    return [
      { label: "Website", url: projectData?.social_media_links?.website || "" },
      { label: "Twitter", url: projectData?.social_media_links?.twitter || "" },
      {
        label: "Defillama",
        url: projectData?.social_media_links?.defliama || "",
      },
      {
        label: "Telegram",
        url: projectData?.social_media_links?.telegram || "",
      },
      { label: "Discord", url: projectData?.social_media_links?.discord || "" },
    ];
  }, [projectData]);

  const questData = useMemo(() => {
    if (!projectData?.campaign) return [];
    let cam = projectData.campaign;
    return [
      {
        label: "Total Reward Value",
        value: `${cam?.community_rewards}  ${cam?.campaign_title}`,
      },
      { label: "Participants", value: `${cam?.participants}` },
      { label: "Community Guide", value: "--" },
    ];
  }, [projectData]);

  const communityData = useMemo(() => {
    if (projectData?.social_media_stats) {
      const mtData = projectData?.social_media_stats?.twitter;
      const followers = mtData?.followers || "--";
      const tinc = mtData?.followers_7d_increment || "--";
      const men = mtData?.mentions || "--";
      const minc = mtData?.mentions_7d_increment || "--";
      return [
        { label: "XIcon(Twitter)", value: `${followers} (${tinc}/7d)` },
        { label: "Twitter Mentions", value: `${men} (${minc}/7d)` },
        { label: "Sentiment", value: "😀 --%  😡 --%  😐 --%" },
      ];
    }
    return [];
  }, [projectData]);

  const priceData = useMemo(() => {
    if (
      projectData?.market_data?.kline_30d &&
      projectData?.market_data?.kline_30d.length > 0
    ) {
      let list = projectData?.market_data?.kline_30d;
      let arr: { date: string; value: number }[] = [];
      list.forEach((item) => {
        let date = item?.openTime ? toMonthDay(item?.openTime) : "--";
        arr.push({
          date,
          value: Number(item.openPrice) || 0,
        });
      });
      return arr;
    }
    return [];
  }, [projectData]);

  const fetchBaseData = useCallback(async () => {
    if (!symbol) return;
    try {
      setIsLoading(true);
      chrome.runtime.sendMessage(
        { type: "FETCH_PROJECTS_DATA", symbol },
        (res) => {
          if (res.success && res.data) {
            setProjectData(res.data || null);
            // setProjectData(mockProjectData);
          } else {
            setProjectData(null);
          }
          setIsLoading(false);
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

  const RightOpt = () => {
    return (
      <div className="relative flex items-center gap-3">
        {/* More 按钮 */}
        <div className="relative w-5 h-5">
          <Button
            onClick={() => setShowHoverCard((v) => !v)}
            variant="ghost"
            size="icon"
            className="w-5 h-5 p-0"
          >
            <img className="w-[20px] h-[20px]" alt="More" src={MoreIcon} />
          </Button>

          {/* 下拉展示设置卡片 */}
          {showHoverCard && (
            <div className="absolute left-[-180px] top-[28px] z-[100000] w-[260px] h-[90px]">
              <DisplayHoverCard className="w-[260px] h-[84px] shadow-[0px_0px_8px_#00000029]" />
            </div>
          )}
        </div>
        {/* <Button variant="ghost" size="icon" className="w-5 h-5 p-0">
                  <img
                    className="w-[20px] h-[20px]"
                    alt="Share"
                    src={ShareIcon}
                  />
                </Button> */}
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="w-5 h-5 p-0"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
    );
  };

  const Footer = () => {
    return (
      <footer className="flex items-center justify-between p-3 mt-auto">
        <div className="flex items-center gap-3">
          <Avatar className="w-[26px] h-[26px] bg-[#d9d9d9]">
            <AvatarImage src={logo} alt="Yomo" />
            <AvatarFallback className="bg-[#d9d9d9]"></AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <div className="text-xl font-normal text-black ">Yomo</div>
            <img
              className="w-px h-4"
              alt="Line"
              src="https://c.animaapp.com/ow4Izvy8/img/line-16.svg"
            />
            <div className=" font-normal text-gray-600 text-[13px]">
              Your Web3 Navigator
            </div>
          </div>
        </div>
        <Button
          disabled
          className="h-auto bg-brand-primary rounded-[22px] px-3 py-1.5 hover:opacity-90"
        >
          <span className=" font-normal text-white text-[13px] mr-2">
            View more
          </span>
          <ArrowUpRight className="w-2.5 h-2.5 text-white " />
        </Button>
      </footer>
    );
  };

  const getChangeColor = (val: string | undefined) => {
    return `${val}`.includes("-") ? "text-brand-red" : "text-brand-green";
  };

  return (
    <>
      <div
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
        className="fixed bg-white rounded-lg z-100000"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Card className="w-[550px] h-[490px] bg-white rounded-lg shadow-[0px_0px_8px_#00000029] border-0 py-0">
          <CardContent className="flex flex-col h-full p-0">
            {!isLoading ? (
              <>
                {projectData && (
                  <div>
                    {/* 头部信息 */}
                    <header className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 bg-brand-primary">
                          <AvatarImage src={projectData?.project_info?.logo} />
                          <AvatarFallback className="text-white bg-brand-primary">
                            {projectData?.project_info?.name?.charAt(0) || "Y"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h1 className="text-sm font-normal text-black">
                              {projectData?.project_info?.name}
                            </h1>
                            <StarIcon className="w-[15px] h-[15px]" />
                          </div>
                          <p className="text-xs font-normal text-gray-600 ">
                            {projectData?.project_info?.short_intro}
                          </p>
                        </div>
                      </div>
                      <RightOpt />
                    </header>
                    {/* 社交链接 */}
                    <nav className="flex gap-2 px-3">
                      {socialLinks.map((link, index) => (
                        <div key={index}>
                          {link.url && (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="w-[70px] h-6 bg-[#E9E9E9] rounded-[22px] justify-center text-xs  font-normal text-brand-black cursor-pointer hover:opacity-80"
                            >
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {link.label}
                              </a>
                            </Badge>
                          )}
                        </div>
                      ))}
                    </nav>
                    <ScrollArea className="w-full h-[330px]">
                      <div className="grid items-stretch grid-cols-2 gap-4 p-3">
                        {/* 市场数据 MarketData */}
                        {projectData?.market_data && (
                          <Card className="flex py-0 bg-transparent border-0 rounded-2 ">
                            <CardContent className="p-3">
                              <h3 className="mb-1 text-sm font-normal">
                                Token Price (
                                {projectData?.tokenomics?.token_symbol})
                              </h3>
                              <h2 className="text-[20px] font-bold text-brand-green">
                                {projectData?.market_data?.token_price}
                                {/* <span className="text-sm font-normal text-brand-black">
                                  {" "}
                                  (+{`--`} %)
                                </span> */}
                              </h2>
                              <div className="flex items-center justify-between w-full">
                                {projectData?.market_data?.kline_30d && (
                                  <PanelTvlChat data={priceData} />
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                        {/* 市场数据 MarketData */}
                        {projectData?.market_data && (
                          <Card className="flex py-0 bg-transparent border-0 rounded-2 ">
                            <CardContent className="p-3">
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="text-xs font-normal text-gray-600 ">
                                    Trading Volume(24h)
                                  </div>
                                  <div className="text-xs font-normal text-right text-black ">
                                    {numFormat(
                                      projectData?.market_data
                                        ?.trading_volume_24h || "0",
                                      2
                                    )}{" "}
                                    <span
                                      className={getChangeColor(
                                        projectData?.market_data
                                          ?.trading_volume_change_24h || ""
                                      )}
                                    >
                                      {Number(
                                        projectData?.market_data
                                          ?.trading_volume_change_24h || "0"
                                      ).toFixed(2)}{" "}
                                      %
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="text-xs font-normal text-gray-600 ">
                                    Circulating Market Cap
                                  </div>
                                  <div className="text-xs font-normal text-right text-black ">
                                    {numFormat(
                                      projectData?.market_data
                                        ?.circulating_market_cap || "0",
                                      2
                                    )}{" "}
                                    {/* <span className="text-brand-gray1">
                                      #
                                      {
                                        projectData?.market_data
                                          ?.circulating_market_cap_source
                                      }
                                    </span> */}
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="text-xs font-normal text-gray-600 ">
                                    Fully Diluted Valuation
                                  </div>
                                  <div className="text-xs font-normal text-right text-black ">
                                    {numFormat(
                                      projectData?.market_data
                                        ?.fully_diluted_valuation || "0",
                                      2
                                    )}{" "}
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="text-xs font-normal text-gray-600 ">
                                    Support Exchanges
                                  </div>
                                  <div className="text-xs font-normal text-right text-black">
                                    <div className="flex items-center pl-[6px]">
                                      {projectData?.market_data
                                        ?.support_exchanges &&
                                        projectData?.market_data?.support_exchanges
                                          ?.slice(0, 5)
                                          ?.map((exchange) => (
                                            <Avatar
                                              key={exchange.name}
                                              className="w-5 h-5 bg-[#D9D9D9] ml-[-6px]"
                                            >
                                              <AvatarImage
                                                src={exchange?.logo || ""}
                                                alt={exchange.name}
                                              />
                                              <AvatarFallback className="text-white bg-[#D9D9D9]">
                                                {exchange?.name?.charAt(0) ||
                                                  "Y"}
                                              </AvatarFallback>
                                            </Avatar>
                                          ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                        {/* 融资信息 FundraisingInfo */}
                        {projectData?.fundraising_info && (
                          <Card className="bg-[#f6f6f8] rounded-2 border-0 py-0 flex ">
                            <CardContent className="p-3">
                              <h3 className="mb-1 text-sm font-normal">
                                Total Raised
                              </h3>
                              <h2 className="text-[20px] font-bold">
                                {projectData?.fundraising_info?.total_raised}
                              </h2>
                              <h3 className="mt-5 mb-2 text-sm font-normal ">
                                Investors
                              </h3>
                              <div className="flex items-center pl-[6px]">
                                {projectData?.fundraising_info?.investors &&
                                  projectData?.fundraising_info?.investors.map(
                                    (investor, index) => (
                                      <Avatar
                                        key={investor.name}
                                        className="w-5 h-5 bg-[#D9D9D9] ml-[-6px]"
                                      >
                                        <AvatarImage
                                          src={investor?.logo || ""}
                                          alt={investor.name}
                                        />
                                        <AvatarFallback className="text-white bg-[#D9D9D9]">
                                          {investor?.name?.charAt(0) || "Y"}
                                        </AvatarFallback>
                                      </Avatar>
                                    )
                                  )}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                        {/* 社交媒体统计 SocialMedia */}
                        {projectData?.social_media_stats && (
                          <Card className=" bg-[#f6f6f8] rounded-lg border-0 py-0 flex">
                            <CardContent className="p-3">
                              <h3 className="mb-4 text-sm font-normal text-black ">
                                Community Heat
                              </h3>
                              <div className="space-y-3">
                                {communityData.map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between"
                                  >
                                    <div className="text-xs font-normal text-gray-600 ">
                                      {item.label}
                                    </div>
                                    <div className="text-xs font-normal text-right text-black ">
                                      {item.value || "--"}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                        {/* 链上数据 OnChainData */}
                        {projectData?.on_chain_data && (
                          <Card className="flex py-0 bg-transparent border-0 ">
                            <CardContent className="p-3">
                              <h3 className="mb-1 text-sm font-normal">
                                Total Value Locked
                              </h3>
                              <h2 className="text-[14px] font-bold align-bottom">
                                {projectData?.on_chain_data?.tvl}{" "}
                                <span className="font-normal font-sm">
                                  (+
                                  {projectData?.on_chain_data?.tvl_7d_increment}
                                  %/7d)
                                </span>
                              </h2>
                              <div className="flex items-center justify-between w-full">
                                {/* <PanelTvlChat data={[]} /> */}
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {/* 任务活动卡片 */}
                        {projectData?.campaign && (
                          <Card className="bg-[#f6f6f8] rounded-2 border-0 py-0 flex ">
                            <CardContent className="p-3">
                              <h3 className="mb-4 text-sm font-normal text-black">
                                Quest Campaigns
                              </h3>
                              <div className="space-y-3">
                                {questData.map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between"
                                  >
                                    <div className="text-xs font-normal text-gray-600 ">
                                      {item.label}
                                    </div>
                                    <div className="text-xs font-normal text-right text-black ">
                                      {item.value || "--"}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                )}
                {!projectData && (
                  <div className="flex-1">
                    <header className="flex items-center justify-end p-3">
                      <RightOpt />
                    </header>
                    <div className="flex flex-col items-center justify-center h-[330px]">
                      <img className="w-[145px] h-[109px]" src={NoImg} alt="" />
                      <p className="mt-4 text-sm font-normal text-center text-brand-gray1">
                        Project or Token Not Found
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1">
                <header className="flex items-center justify-end p-3">
                  <RightOpt />
                </header>
                <div className="flex items-center justify-center h-[330px]">
                  <span
                    role="status"
                    aria-live="polite"
                    className="inline-block align-middle loader"
                  />
                </div>
              </div>
            )}
            {/* 底部信息 */}
            <Footer />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default HoverModel;
