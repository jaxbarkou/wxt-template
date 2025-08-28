import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { SearchInput } from "@/shared/components/search/SearchInput";
import { Clock } from "lucide-react";

import ChainLogo from "@/components/custom/svg/icons/ChainLogo";
import {
  projectSearch,
  projectData as getProjectData,
} from "@/lib/api/project";
import { ProjectItem } from "@/modal/searchResult";
import ChartContainer from "@/components/charts/ChartContainer";
import PriceChart from "@/components/charts/PriceChart";
import { numFormat } from "@/lib/utils";

// 导入图标
import DiscordIcon from "@/assets/images/search/Discord_icon.png";
import TelegramIcon from "@/assets/images/search/Telegram_icon.png";
import MediumIcon from "@/assets/images/search/Medium_icon.png";
import GithubIcon from "@/assets/images/search/Github_icon.png";
import WebsiteIcon from "@/assets/images/search/Website_icon.png";
import DocsIcon from "@/assets/images/search/Docs_icon.png";
import DAppIcon from "@/assets/images/search/DApp_icon.png";
import XIcon from "@/assets/images/search/X_icon.png";

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [projectData, setProjectData] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(
    null
  );

  // 从URL参数中读取查询文本
  useEffect(() => {
    const query = searchParams.get('query');
    if (query) {
      setSearchValue(query);
      // 自动执行搜索
      handleSearch(query);
    }
  }, [searchParams]);

  const handleProjectSelect = async (project: ProjectItem) => {
    setSelectedProject(project);

    try {
      const response: any = await getProjectData({
        id: project?.id,
        ticker: project?.token_symbol || "",
        domain: project?.website_url || project?.website || "",
        text: searchValue,
      });
      console.log("response", response);
      if (response) {
        setProjectData(response);
      } else {
        console.error("Failed to get project details:", response.message);
      }
    } catch (error) {
      console.error("Error getting project details:", error);
    }
  };

  // 清空数据状态
  const handleClear = () => {
    setSelectedProject(null);
    setProjectData(null);
    setSearchResult(null);
  };

  const handleSearch = async (query: string): Promise<any[]> => {
    if (!query.trim()) {
      setSearchResult(null);
      setSelectedProject(null);
      return [];
    }

    try {
      const response: any = await projectSearch(query);
      console.log("response", response);
      if (response && Array.isArray(response)) {
        setSearchResult(query);
        return response;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Search error:", error);
      return [];
    }
  };
  // 格式化百分比
  const formatPercentage = (num: number) => {
    return num > 0 ? `+${num.toFixed(2)}%` : `${num.toFixed(2)}%`;
  };

  return (
    <div className="bg-white flex justify-center items-start w-[100%] min-h-screen">
      <div className="bg-white w-[100%] min-h-screen relative">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="text-xl font-medium text-black mb-1">Research</div>
          <Clock className="w-4 h-4 text-black" />
        </div>

        {/* 搜索输入框 */}
        <div className="px-4">
          <SearchInput
            value={searchValue}
            onChange={setSearchValue}
            onSelect={(val, project) => {
              setSearchValue(val);
              if (project) {
                handleProjectSelect(project);
              }
            }}
            onClear={handleClear}
            placeholder="Search tokens, projects or alpha..."
            className=""
            searchProjects={handleSearch}
          />
        </div>

        <div className="mt-3">
          {/* 搜索结果标题 */}
          {searchResult && selectedProject && (
            <div className="px-4 py-3 flex items-center gap-3">
              <div className="w-4 h-4 bg-gray-300 rounded-full">
                <img
                  src={selectedProject.logo}
                  alt={selectedProject.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="text-sm text-gray-500">
                {selectedProject.name} Project Analysis and Summary
              </span>
            </div>
          )}
        </div>

        {/* 欢迎状态 - 未选择项目时显示 */}
        {!selectedProject && !searchResult && (
          <div className="px-4 py-8 text-center animate-fade-in">
            <div className="text-black text-lg mb-2 font-medium animate-slide-up [--animation-delay:200ms]">
              Welcome to Project Research Tool
            </div>
            <div className="text-gray-400 text-sm animate-slide-up [--animation-delay:400ms]">
              Search for projects you're interested in to get detailed analysis
              reports
            </div>
          </div>
        )}

        {/* 项目详情 - 仅在选择项目时显示 */}
        {selectedProject && (
          <>
            {/* 项目介绍部分 */}
            <div className="px-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-4 bg-orange-500 rounded"></div>
                <div className="text-sm font-medium text-black">
                  Project Introduction
                </div>
              </div>
              <div className="text-xs text-gray-700 leading-relaxed">
                {selectedProject?.brief_desc ||
                  projectData?.project_info?.short_intro}
              </div>
              <div className="text-xs text-gray-700 leading-relaxed">
                {selectedProject?.description ||
                  projectData?.project_info?.description}
              </div>
              {projectData?.project_info?.team_info &&
                Array.isArray(projectData.project_info.team_info) &&
                projectData.project_info.team_info.length > 0 && (
                  <div className="text-xs text-gray-700 leading-relaxed">
                    <div className="mb-2 font-medium">Team Members:</div>
                    <div className="space-y-1">
                      {projectData.project_info.team_info.map(
                        (member: any, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="font-medium">{member.name}</span>
                            <span className="text-gray-500">-</span>
                            <span>{member.position}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              {projectData?.project_info?.sector_analysis && (
                <div className="text-xs text-gray-700">
                  {typeof projectData.project_info.sector_analysis === "string"
                    ? projectData.project_info.sector_analysis
                    : "Sector analysis available"}
                </div>
              )}
            </div>

            {/* 融资信息部分 */}
            {projectData?.fundraising_info && (
              <div className="px-4 mb-6 mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-4 bg-orange-500 rounded"></div>
                  <div className="text-sm font-medium text-black">
                    Financing Information
                  </div>
                </div>
                <div className="text-xs text-gray-700 leading-relaxed mb-4">
                  According to public information,{" "}
                  {selectedProject?.project_name ||
                    projectData?.project_info?.name}{" "}
                  has received high recognition and support from the capital
                  market in the early stages of the project.
                  {selectedProject?.project_name ||
                    projectData?.project_info?.name}{" "}
                  has completed{" "}
                  {projectData?.fundraising_info?.round_info?.length || 0}{" "}
                  rounds of financing
                  {projectData?.fundraising_info?.total_raised && (
                    <>
                      , with a total amount exceeding $
                      {numFormat(
                        parseFloat(projectData?.fundraising_info?.total_raised)
                      )}
                    </>
                  )}
                  . These data fully demonstrate{" "}
                  {selectedProject?.project_name ||
                    projectData?.project_info?.name}
                  's leading position and great potential in blockchain security
                  and scalability. At the same time, sufficient funding provides
                  strong support for its subsequent development and growth,
                  enabling it to better serve the Bitcoin ecosystem and other
                  protocols.
                </div>
                {projectData?.fundraising_info?.investors &&
                  Array.isArray(projectData.fundraising_info.investors) &&
                  projectData.fundraising_info.investors.length > 0 && (
                    <>
                      <div className="text-xs text-gray-700 mb-4">
                        Investment Institutions:
                      </div>
                      <div className="max-h-24 overflow-y-auto">
                        <div className="flex flex-wrap gap-2">
                          {projectData.fundraising_info.investors.map(
                            (investor: any, index: number) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg border border-gray-200"
                                title={investor.name}
                              >
                                {investor.logo && (
                                  <img
                                    src={investor.logo}
                                    alt={investor.name}
                                    className="w-5 h-5 rounded-full object-cover"
                                    onError={(e) => {
                                      // 如果图片加载失败，隐藏图片元素
                                      e.currentTarget.style.display = "none";
                                    }}
                                  />
                                )}
                                <span className="text-xs font-medium text-gray-700">
                                  {investor.name}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </>
                  )}
              </div>
            )}

            {/* 项目数据部分 */}
            {(projectData?.social_media_stats ||
              projectData?.on_chain_data) && (
              <div className="px-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-4 bg-orange-500 rounded"></div>
                  <div className="text-sm font-medium text-black">
                    Project Data
                  </div>
                </div>
                {/* <div className="text-xs text-gray-700 mb-3">社区热度与媒体报道</div>
                <Card className="bg-gray-100 border border-gray-200 h-36 mb-4">
                  <CardContent className="p-0 h-full flex items-center justify-center">
                    <div className="text-xs text-gray-500">投资机构列表</div>
                  </CardContent>
                </Card> */}
                <div className="space-y-2 text-xs mb-4">
                  {projectData?.social_media_stats?.twitter && (
                    <div className="flex justify-between">
                      <span className="text-gray-700">X (Twitter)</span>
                      <span className="text-black">
                        {numFormat(
                          projectData.social_media_stats.twitter.followers || 0
                        )}{" "}
                        {projectData.social_media_stats.twitter
                          ?.followers_7d_increment && (
                          <span className="text-green-500">
                            (
                            {formatPercentage(
                              projectData.social_media_stats.twitter
                                .followers_7d_increment || 0
                            )}
                            /7d)
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                  {projectData?.social_media_stats?.telegram && (
                    <div className="flex justify-between">
                      <span className="text-gray-700">Telegram</span>
                      <span className="text-black">
                        {numFormat(
                          projectData.social_media_stats.telegram.members || 0
                        )}{" "}
                        <span className="text-green-500">
                          (
                          {formatPercentage(
                            projectData.social_media_stats.telegram
                              .members_7d_increment || 0
                          )}
                          /7d)
                        </span>
                      </span>
                    </div>
                  )}
                  {projectData?.social_media_stats?.discord && (
                    <div className="flex justify-between">
                      <span className="text-gray-700">Discord</span>
                      <span className="text-black">
                        {numFormat(
                          projectData.social_media_stats.discord.members || 0
                        )}{" "}
                        <span className="text-green-500">
                          (
                          {formatPercentage(
                            projectData.social_media_stats.discord
                              .members_7d_increase || 0
                          )}
                          /7d)
                        </span>
                      </span>
                    </div>
                  )}
                  {projectData?.social_media_stats?.twitter?.mentions && (
                    <div className="flex justify-between">
                      <span className="text-gray-700">Twitter mentions</span>
                      <span className="text-black">
                        {numFormat(
                          projectData.social_media_stats.twitter.mentions || 0
                        )}{" "}
                        {projectData.social_media_stats.twitter
                          .mentions_7d_increment && (
                          <span className="text-green-500">
                            (
                            {formatPercentage(
                              projectData.social_media_stats.twitter
                                .mentions_7d_increment || 0
                            )}
                            /7d)
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                  {/* {projectData?.social_media_stats?.twitter?.sentiment && (
                    <div className="flex justify-between">
                      <span className="text-gray-700">社区情感</span>
                      <span className="text-black">
                        😀 {projectData.social_media_stats.twitter.sentiment[0]}% 😡{" "}
                        {projectData.social_media_stats.twitter.sentiment[2]}% 😐{" "}
                        {projectData.social_media_stats.twitter.sentiment[1]}%
                      </span>
                    </div>
                  )} */}
                  {projectData?.social_media_stats?.media_mentions &&
                    Array.isArray(
                      projectData.social_media_stats.media_mentions
                    ) &&
                    projectData.social_media_stats.media_mentions.length >
                      0 && (
                      <div className="space-y-2">
                        <div className="text-xs text-gray-700 font-medium">
                          Media Coverage
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {projectData.social_media_stats.media_mentions.map(
                            (item: any, index: number) => {
                              // 安全检查：确保item是字符串或对象
                              if (typeof item === "string") {
                                // 处理字符串URL
                                const domain = item
                                  .replace(/^https?:\/\//, "")
                                  .replace(/^www\./, "")
                                  .split("/")[0];
                                const displayName = domain.split(".")[0]; // 取主域名部分

                                return (
                                  <a
                                    key={index}
                                    href={item}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full hover:bg-blue-200 transition-colors cursor-pointer"
                                    title={item}
                                  >
                                    {displayName}
                                  </a>
                                );
                              } else if (
                                typeof item === "object" &&
                                item !== null
                              ) {
                                // 处理对象，提取name或title属性
                                const displayName =
                                  item.name ||
                                  item.title ||
                                  item.displayName ||
                                  "Unknown";
                                const url = item.url || item.link || "#";

                                return (
                                  <a
                                    key={index}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full hover:bg-blue-200 transition-colors cursor-pointer"
                                    title={displayName}
                                  >
                                    {displayName}
                                  </a>
                                );
                              }

                              // 如果既不是字符串也不是对象，跳过渲染
                              return null;
                            }
                          )}
                        </div>
                      </div>
                    )}
                </div>

                {/* 链上数据部分 */}
                {projectData?.on_chain_data && (
                  <div className="space-y-2 text-xs mb-4">
                    <div className="text-xs text-gray-700 font-medium mb-2">
                      On-Chain Data
                    </div>
                    {projectData.on_chain_data.tvl && (
                      <div className="flex justify-between">
                        <span className="text-gray-700">
                          Total Value Locked (TVL)
                        </span>
                        <span className="text-black font-medium">
                          ${numFormat(projectData.on_chain_data.tvl)}
                          {projectData.on_chain_data.tvl_7d_increment && (
                            <span className="text-green-500 ml-1">
                              (+{projectData.on_chain_data.tvl_7d_increment}
                              %/7d)
                            </span>
                          )}
                        </span>
                      </div>
                    )}
                    {projectData.on_chain_data.tvl_peak && (
                      <div className="flex justify-between">
                        <span className="text-gray-700">TVL Peak</span>
                        <span className="text-black">
                          ${numFormat(projectData.on_chain_data.tvl_peak)}
                        </span>
                      </div>
                    )}
                    {projectData.on_chain_data.active_addresses_7d && (
                      <div className="flex justify-between">
                        <span className="text-gray-700">
                          Active Addresses (7D)
                        </span>
                        <span className="text-black">
                          {numFormat(
                            projectData.on_chain_data.active_addresses_7d
                          )}
                          {projectData.on_chain_data
                            .active_addresses_7d_change && (
                            <span className="text-green-500 ml-1">
                              (
                              {projectData.on_chain_data
                                .active_addresses_7d_change > 0
                                ? "+"
                                : ""}
                              {
                                projectData.on_chain_data
                                  .active_addresses_7d_change
                              }
                              %)
                            </span>
                          )}
                        </span>
                      </div>
                    )}
                    {projectData.on_chain_data.contract_interactions_7d && (
                      <div className="flex justify-between">
                        <span className="text-gray-700">
                          Contract Interactions (7D)
                        </span>
                        <span className="text-black">
                          {numFormat(
                            projectData.on_chain_data.contract_interactions_7d
                          )}
                          {projectData.on_chain_data
                            .contract_interactions_7d_change && (
                            <span className="text-green-500 ml-1">
                              (
                              {projectData.on_chain_data
                                .contract_interactions_7d_change > 0
                                ? "+"
                                : ""}
                              {
                                projectData.on_chain_data
                                  .contract_interactions_7d_change
                              }
                              %)
                            </span>
                          )}
                        </span>
                      </div>
                    )}
                    {projectData.on_chain_data.contract_interactions_30d && (
                      <div className="flex justify-between">
                        <span className="text-gray-700">
                          Contract Interactions (30D)
                        </span>
                        <span className="text-black">
                          {numFormat(
                            projectData.on_chain_data.contract_interactions_30d
                          )}
                        </span>
                      </div>
                    )}
                    {projectData.on_chain_data.txns_30d && (
                      <div className="flex justify-between">
                        <span className="text-gray-700">
                          Transactions (30D)
                        </span>
                        <span className="text-black">
                          {numFormat(projectData.on_chain_data.txns_30d)}
                        </span>
                      </div>
                    )}
                    {projectData.on_chain_data.protocol_revenue_30d && (
                      <div className="flex justify-between">
                        <span className="text-gray-700">
                          Protocol Revenue (30D)
                        </span>
                        <span className="text-black">
                          $
                          {numFormat(
                            projectData.on_chain_data.protocol_revenue_30d
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {/* <div className="grid grid-cols-1 gap-4 mb-2">
                  <Card className="bg-gray-100 border border-gray-200 h-36">
                    <CardContent className="p-0 h-full flex items-center justify-center">
                      <div className="text-xs text-gray-500">
                        TVL 和 协议交互地址数据折现图
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-100 border border-gray-200 h-36">
                    <CardContent className="p-0 h-full flex items-center justify-center">
                      <div className="text-xs text-gray-500">TVL 分布饼图</div>
                    </CardContent>
                  </Card>
                </div>
                <div className="text-xs text-gray-500 text-right">
                  update date: {new Date().toLocaleString()}
                </div> */}
              </div>
            )}
            {/* 市场数据部分 */}
            {projectData?.market_data && (
              <div className="px-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-4 bg-orange-500 rounded"></div>
                  <div className="text-sm font-medium text-black">Markets</div>
                </div>
                {projectData?.market_data?.kline_30d &&
                  projectData.market_data.kline_30d.length > 0 && (
                    <div className="pt-2 pb-2 mb-6">
                      <ChartContainer title="30 days price trend">
                        <PriceChart
                          height={144}
                          symbol={selectedProject?.token_symbol || "BTC"}
                          useApi={false}
                          klineData={projectData.market_data.kline_30d}
                        />
                      </ChartContainer>
                    </div>
                  )}
                <div className="space-y-2 text-xs mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Trading Volume (24H)</span>
                    <span className="text-black">
                      $
                      {numFormat(
                        projectData.market_data.trading_volume_24h || 0
                      )}{" "}
                      <span
                        className={`${
                          (projectData.market_data.trading_volume_change_24h ||
                            0) >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {(projectData.market_data.trading_volume_change_24h ||
                          0) >= 0
                          ? "+"
                          : ""}
                        {(
                          projectData.market_data.trading_volume_change_24h || 0
                        ).toFixed(2)}
                        %
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">
                      Circulating Market Cap
                    </span>
                    <span className="text-black">
                      $
                      {numFormat(
                        projectData.market_data.circulating_market_cap || 0
                      )}{" "}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">
                      Fully Diluted Valuation
                    </span>
                    <span className="text-black">
                      $
                      {numFormat(
                        projectData.market_data.fully_diluted_valuation || 0
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Support Exchanges</span>
                    <div className="flex-1 ml-2 overflow-hidden">
                      <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                        <div className="flex gap-1 ml-auto">
                          {projectData.market_data.support_exchanges?.map(
                            (exchange: any, index: number) => {
                              // 安全检查：确保exchange是对象且包含必要属性
                              if (
                                typeof exchange === "object" &&
                                exchange !== null &&
                                exchange.name
                              ) {
                                return (
                                  <div
                                    key={index}
                                    className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0"
                                    title={exchange.name}
                                  >
                                    <img
                                      src={exchange.logo || ""}
                                      alt={exchange.name}
                                      className="w-full h-full object-cover rounded-full"
                                      onError={(e) => {
                                        // 如果图片加载失败，隐藏图片元素
                                        e.currentTarget.style.display = "none";
                                      }}
                                    />
                                  </div>
                                );
                              }
                              return null;
                            }
                          ) || (
                            <div className="w-3 h-3 bg-gray-300 rounded-full flex-shrink-0"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 代币经济学部分 */}
            {projectData?.tokenomics && (
              <div className="px-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-4 bg-orange-500 rounded"></div>
                  <div className="text-sm font-medium text-black">
                    Tokenomics
                  </div>
                </div>

                <div className="space-y-2 text-xs mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Token Symbol</span>
                    <span className="text-black font-medium">
                      {selectedProject?.token_symbol ||
                        projectData?.tokenomics?.token_symbol}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Circulating Supply</span>
                    <span className="text-black">
                      {numFormat(
                        selectedProject?.circulating_supply ||
                          projectData?.tokenomics?.circulating_supply ||
                          0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Total Supply</span>
                    <span className="text-black">
                      {numFormat(
                        selectedProject?.total_supply ||
                          projectData?.tokenomics?.total_supply ||
                          0
                      )}
                    </span>
                  </div>
                  {projectData?.tokenomics?.support_chains &&
                    projectData.tokenomics.support_chains.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-700">Support Chains</span>
                        <div className="flex-1 ml-2 overflow-hidden">
                          <div className="flex gap-1 overflow-x-auto scrollbar-hide justify-end">
                            {projectData.tokenomics.support_chains.map(
                              (chain: any, index: number) => {
                                // 安全检查：确保chain是有效的字符串或对象
                                if (
                                  chain &&
                                  (typeof chain === "string" ||
                                    typeof chain === "object")
                                ) {
                                  return (
                                    <div key={index} className="flex-shrink-0">
                                      <ChainLogo
                                        chain={chain.contract_platform}
                                        size={18}
                                      />
                                    </div>
                                  );
                                }
                                return null;
                              }
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  <div className="flex justify-between">
                    <span className="text-gray-700">Referral Docs</span>
                    <span className="text-blue-600 underline cursor-pointer">
                      {selectedProject?.token_symbol ||
                        projectData?.tokenomics?.token_symbol}{" "}
                      Tokenomics
                    </span>
                  </div>
                </div>

                {/* 检查是否有distribution数据 */}
                {(() => {
                  const distributionDetails =
                    projectData?.tokenomics?.distribution_details;
                  const hasDistributionData =
                    distributionDetails &&
                    (distributionDetails.community_launch?.percentage ||
                      distributionDetails.ecosystem_growth?.percentage ||
                      distributionDetails.dao_treasury?.percentage ||
                      distributionDetails.investors?.percentage ||
                      distributionDetails.public_sale?.percentage ||
                      distributionDetails.team?.percentage);

                  if (!hasDistributionData) return null;

                  return (
                    <>
                      <div className="text-xs text-gray-700 mb-2">
                        Distribution Overview
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg p-3 mb-2">
                        <div className="space-y-2 text-xs mb-4">
                          <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                            <span className="text-gray-600">Token Symbol:</span>
                            <span className="font-semibold text-gray-800">
                              {selectedProject?.token_symbol ||
                                projectData?.tokenomics?.token_symbol ||
                                "-"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center  border-b border-gray-200 pb-3">
                            <span className="text-gray-600">
                              Token Total Supply:
                            </span>
                            <span className="font-semibold text-gray-800">
                              {selectedProject?.total_supply ||
                              projectData?.tokenomics?.total_supply
                                ? numFormat(
                                    selectedProject?.total_supply ||
                                      projectData?.tokenomics?.total_supply ||
                                      0
                                  )
                                : "-"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center  border-b border-gray-200 pb-3">
                            <span className="text-gray-600">
                              Initial Circulating Supply:
                            </span>
                            <span className="font-semibold text-gray-800 text-right">
                              {selectedProject?.circulating_supply ||
                              projectData?.tokenomics?.circulating_supply
                                ? `${numFormat(
                                    selectedProject?.circulating_supply ||
                                      projectData?.tokenomics
                                        ?.circulating_supply ||
                                      0
                                  )} (${(
                                    ((selectedProject?.circulating_supply ||
                                      projectData?.tokenomics
                                        ?.circulating_supply ||
                                      0) /
                                      (selectedProject?.total_supply ||
                                        projectData?.tokenomics?.total_supply ||
                                        1)) *
                                    100
                                  ).toFixed(2)}%)`
                                : "-"}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-xs border-b border-gray-100 pb-2">
                            <div className="flex justify-between items-start mb-1">
                              <div className="text-gray-600">
                                Community & Launch
                              </div>
                              <div className="font-semibold text-gray-800">
                                {projectData?.tokenomics?.distribution_details
                                  ?.community_launch?.percentage
                                  ? `${projectData?.tokenomics?.distribution_details.community_launch.percentage}%`
                                  : "-"}
                              </div>
                            </div>
                            <div className="text-gray-500 text-xs">
                              {projectData?.tokenomics?.distribution_details
                                ?.community_launch?.vesting || "-"}
                            </div>
                          </div>

                          <div className="text-xs border-b border-gray-100 pb-2">
                            <div className="flex justify-between items-start mb-1">
                              <div className="text-gray-600">
                                Ecosystem Growth
                              </div>
                              <div className="font-semibold text-gray-800">
                                {projectData?.tokenomics?.distribution_details
                                  ?.ecosystem_growth?.percentage
                                  ? `${projectData?.tokenomics?.distribution_details.ecosystem_growth.percentage}%`
                                  : "-"}
                              </div>
                            </div>
                            <div className="text-gray-500 text-xs">
                              {projectData?.tokenomics?.distribution_details
                                ?.ecosystem_growth?.vesting || "-"}
                            </div>
                          </div>

                          <div className="text-xs border-b border-gray-100 pb-2">
                            <div className="flex justify-between items-start mb-1">
                              <div className="text-gray-600">DAO Treasury</div>
                              <div className="font-semibold text-gray-800">
                                {projectData?.tokenomics?.distribution_details
                                  ?.dao_treasury?.percentage
                                  ? `${projectData?.tokenomics?.distribution_details.dao_treasury.percentage}%`
                                  : "-"}
                              </div>
                            </div>
                            <div className="text-gray-500 text-xs">
                              {projectData?.tokenomics?.distribution_details
                                ?.dao_treasury?.vesting || "-"}
                            </div>
                          </div>

                          <div className="text-xs border-b border-gray-100 pb-2">
                            <div className="flex justify-between items-start mb-1">
                              <div className="text-gray-600">Investors</div>
                              <div className="font-semibold text-gray-800">
                                {projectData?.tokenomics?.distribution_details
                                  ?.investors?.percentage
                                  ? `${projectData?.tokenomics?.distribution_details.investors.percentage}%`
                                  : "-"}
                              </div>
                            </div>
                            <div className="text-gray-500 text-xs">
                              {projectData?.tokenomics?.distribution_details
                                ?.investors?.vesting || "-"}
                            </div>
                          </div>

                          <div className="text-xs border-b border-gray-100 pb-2">
                            <div className="flex justify-between items-start mb-1">
                              <div className="text-gray-600">Public Sale</div>
                              <div className="font-semibold text-gray-800">
                                {projectData?.tokenomics?.distribution_details
                                  ?.public_sale?.percentage
                                  ? `${projectData?.tokenomics?.distribution_details.public_sale.percentage}%`
                                  : "-"}
                              </div>
                            </div>
                            <div className="text-gray-500 text-xs">
                              {projectData?.tokenomics?.distribution_details
                                ?.public_sale?.vesting || "-"}
                            </div>
                          </div>

                          <div className="text-xs pb-2">
                            <div className="flex justify-between items-start mb-1">
                              <div className="text-gray-600">Team</div>
                              <div className="font-semibold text-gray-800">
                                {projectData?.tokenomics?.distribution_details
                                  ?.team?.percentage
                                  ? `${projectData?.tokenomics?.distribution_details.team.percentage}%`
                                  : "-"}
                              </div>
                            </div>
                            <div className="text-gray-500 text-xs">
                              {projectData?.tokenomics?.distribution_details
                                ?.team?.vesting || "-"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
            {/* 项目链接部分 */}
            {(() => {
              const allPlatforms = [
                {
                  name: "Discord",
                  url:
                    selectedProject?.discord_url ||
                    projectData?.social_media_links?.discord,
                  icon: DiscordIcon,
                },
                {
                  name: "Telegram",
                  url:
                    selectedProject?.telegram_url ||
                    projectData?.social_media_links?.telegram,
                  icon: TelegramIcon,
                },
                {
                  name: "Medium",
                  url:
                    selectedProject?.medium_url ||
                    projectData?.social_media_links?.medium,
                  icon: MediumIcon,
                },
                {
                  name: "Github",
                  url:
                    selectedProject?.github_url ||
                    projectData?.social_media_links?.github,
                  icon: GithubIcon,
                },
                {
                  name: "Website",
                  url:
                    selectedProject?.website_url ||
                    projectData?.social_media_links?.website,
                  icon: WebsiteIcon,
                },
                {
                  name: "Docs",
                  url:
                    selectedProject?.gitbook_url ||
                    projectData?.social_media_links?.defliama,
                  icon: DocsIcon,
                },
                {
                  name: "dApp",
                  url:
                    selectedProject?.website_url ||
                    projectData?.social_media_links?.website,
                  icon: DAppIcon,
                },
                {
                  name: "X(Twitter)",
                  url: selectedProject?.twitter_username
                    ? `https://twitter.com/${selectedProject.twitter_username}`
                    : projectData?.social_media_links?.twitter,
                  icon: XIcon,
                },
              ];

              const availablePlatforms = allPlatforms.filter(
                (platform) => platform.url
              );

              if (availablePlatforms.length === 0) return null;

              return (
                <div className="px-4 mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-4 bg-orange-500 rounded"></div>
                    <div className="text-sm font-medium text-black">
                      Project Links
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {availablePlatforms.map((platform) => (
                      <Card
                        key={platform.name}
                        className="aspect-square hover:bg-gray-200 transition-colors cursor-pointer bg-white border border-gray-200"
                        onClick={() =>
                          platform.url && window.open(platform.url, "_blank")
                        }
                      >
                        <CardContent className="p-0 h-full flex flex-col items-center justify-center gap-1">
                          <img src={platform.icon} alt={platform.name} className="w-6 h-6 object-contain" />
                          <div className="text-xs text-center font-medium text-gray-700">
                            {platform.name}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* 项目总结标题部分 */}
            <div className="px-4 mb-3 mt-4">
              <div className="flex items-center gap-2 ">
                <div className="w-1 h-4 bg-orange-500 rounded"></div>
                <div className="text-sm font-medium text-black">
                  Project Summary
                </div>
              </div>
            </div>

            {/* 总结内容部分 */}
            <div className="px-4 mb-6">
              <div className="text-xs text-gray-700 leading-relaxed">
                According to public information,{" "}
                {selectedProject?.project_name ||
                  projectData?.project_info?.name}{" "}
                has received high recognition and support from the capital
                market in the early stages of the project.
                {selectedProject?.project_name ||
                  projectData?.project_info?.name}{" "}
                has completed{" "}
                {projectData?.fundraising_info?.round_info?.length || 0} rounds
                of financing
                {projectData?.fundraising_info?.total_raised && (
                  <>
                    , with a total amount exceeding $
                    {numFormat(
                      parseFloat(projectData?.fundraising_info?.total_raised)
                    )}
                  </>
                )}
                . These data fully demonstrate{" "}
                {selectedProject?.project_name ||
                  projectData?.project_info?.name}
                's leading position and great potential in blockchain security
                and scalability. At the same time, sufficient funding provides
                strong support for its subsequent development and growth,
                enabling it to better serve the Bitcoin ecosystem and other
                protocols.
              </div>
              {/* <div className="text-sm text-gray-600 mt-2">
                以上是 Yomo 为您总结生成的关于{" "}
                {selectedProject?.project_name ||
                  projectData?.project_info?.name}
                的项目简报。如果你想要更加完整的报告，可以前往{" "}
                <span className="text-blue-600 underline cursor-pointer">
                  Web 网站⏭
                </span>{" "}
                进行报告生成。
              </div> */}
            </div>
          </>
        )}

        {/* 警告横幅 */}
        <div className="px-4 pb-8">
          <div className="mb-4">
            <div className="text-xs text-red-600 text-center">
              All data in the report comes from publicly available data sources
              on the internet, community, or user-submitted data!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
