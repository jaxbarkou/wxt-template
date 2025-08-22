import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SearchInput } from "@/shared/components/search/SearchInput";
import { Clock, Share2, Bookmark, MessageCircle, Heart } from "lucide-react";
import mockProjectData from "@/mock/mockProjectData";
import ChainLogo from "@/components/custom/svg/icons/ChainLogo";
import { projectSearch, projectData as getProjectData } from "@/lib/api/project";
import { SearchResult, ProjectItem } from "@/modal/searchResult";

const mockSearchSuggestions = [
  "Pell Network",
  "Pell Token",
  "Pell Protocol",
  "Pell DeFi",
  "Pell Staking",
  "Pell Network Review",
  "Pell Network Price",
  "Pell Network Tokenomics",
  "Pell Network Analysis",
  "Pell Network News",
  "Bitcoin Restaking",
  "BTCFi Projects",
  "DeFi Protocols",
  "Cryptocurrency Research",
  "Blockchain Security",
];

const Search: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [projectData, setProjectData] = useState(mockProjectData);
  const [searchResults, setSearchResults] = useState<ProjectItem[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  // 防抖搜索
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchValue.trim()) {
        handleSearch(searchValue);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  const handleProjectSelect = async (project: ProjectItem) => {
    setSelectedProject(project);
    setIsSearching(true);
    
    try {
      const response = await getProjectData({ 
        id: project.id,
        ticker: project.tokenomics?.token_symbol || "",
        domain: project.website || ""
      });
      if (response.code === 200) {
        setProjectData(mockProjectData);
      } else {
        console.error("获取项目详情失败:", response.message);
        setProjectData(mockProjectData);
      }
    } catch (error) {
      console.error("获取项目详情出错:", error);
      setProjectData(mockProjectData);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResult(null);
      setSearchResults([]);
      setSearchError(null);
      setSelectedProject(null);
      return;
    }

    setIsSearching(true);
    setSearchResult(null);
    setSearchError(null);
    setSelectedProject(null);

    try {
      const response = await projectSearch(query);
      if (response.code === 200) {
        const searchData = response.data;
        if (searchData && searchData.data && searchData.data.list) {
          setSearchResults(searchData.data.list);
          setSearchResult(query);
          if (searchData.data.list.length > 0) {
            setProjectData(mockProjectData);
          }
        } else {
          setSearchError("返回数据格式错误");
          setSearchResults([]);
        }
      } else {
        setSearchError(response.message || "搜索失败");
        setSearchResults([]);
      }
    } catch (error) {
      console.error("搜索出错:", error);
      setSearchError("搜索请求失败，请稍后重试");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // 格式化数字
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  // 格式化百分比
  const formatPercentage = (num: number) => {
    return num > 0 ? `+${num.toFixed(2)}%` : `${num.toFixed(2)}%`;
  };

  // 格式化时间戳
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  return (
    <div className="bg-white flex justify-center items-start w-[100%] min-h-screen">
      <div className="bg-white w-[100%] min-h-screen relative">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="text-xl font-medium text-black mb-1">Research</div>
          <Clock className="w-4 h-4 text-black" />
        </div>

        {/* Search Input */}
        <div className="px-4">
          <SearchInput
            value={searchValue}
            onChange={setSearchValue}
            onSelect={(val) => {
              setSearchValue(val);
            }}
            placeholder="Search tokens, projects or alpha..."
            className=""
            getSuggestions={(q) =>
              mockSearchSuggestions.filter((s) =>
                s.toLowerCase().includes(q.toLowerCase())
              )
            }
          />
        </div>
        <div className="mt-3">
          {/* Loading State */}
          {isSearching && (
            <div className="px-4 py-3 flex items-center gap-3">
              <div className="w-4 h-4 bg-gray-300 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-500">正在搜索 "{searchValue}"...</span>
            </div>
          )}

          {/* Search Error */}
          {searchError && (
            <div className="px-4 py-3">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <span className="text-sm text-red-600">{searchError}</span>
              </div>
            </div>
          )}

          {/* No Search Results */}
          {!isSearching && searchResult && searchResults.length === 0 && !searchError && (
            <div className="px-4 py-8 text-center">
              <div className="text-gray-500 text-sm">未找到相关项目</div>
              <div className="text-gray-400 text-xs mt-1">请尝试其他关键词</div>
            </div>
          )}

          {/* Search Results List */}
          {!isSearching && searchResults.length > 0 && (
            <div className="px-4 mb-4">
              <div className="text-sm text-gray-500 mb-2">
                找到 {searchResults.length} 个相关项目
              </div>
              <div className="space-y-2">
                {searchResults.slice(0, 5).map((project, index) => (
                  <div
                    key={project.id}
                    className="bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      handleProjectSelect(project);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={project.logo}
                        alt={project.name}
                        className="w-8 h-8 rounded-full"
                        onError={(e) => {
                          e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/%3E%3C/svg%3E";
                        }}
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{project.name}</div>
                        <div className="text-sm text-gray-500 truncate">{project.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          ${project.price?.toFixed(4) || "N/A"}
                        </div>
                        <div className={`text-xs ${project.price_change_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {project.price_change_24h ? formatPercentage(project.price_change_24h) : "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search Result Title */}
          {!isSearching && searchResult && selectedProject && (
            <div className="px-4 py-3 flex items-center gap-3">
              <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
              <span className="text-sm text-gray-500">
                {selectedProject.name} 的项目分析和总结
              </span>
            </div>
          )}
        </div>
        
        {/* Welcome State - Show when no project is selected */}
        {!isSearching && !selectedProject && !searchResult && (
          <div className="px-4 py-8 text-center">
            <div className="text-gray-500 text-lg mb-2">欢迎使用项目研究工具</div>
            <div className="text-gray-400 text-sm">
              搜索您感兴趣的项目，获取详细的分析报告
            </div>
          </div>
        )}
        
        {/* Project Introduction Section - Only show when project is selected */}
        {selectedProject && (
          <div className="px-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 bg-orange-500 rounded"></div>
            <div className="text-sm font-medium text-black">
              Project Introduction
            </div>
          </div>
          <div className="text-xs text-gray-700 leading-relaxed">
            {projectData.project_info.short_intro}
          </div>
          <div className="text-xs text-gray-700 leading-relaxed">
            {projectData.project_info.description}
          </div>
          <div className="text-xs text-gray-700 leading-relaxed">
            {projectData.project_info.team_info}
          </div>
          <div className="text-xs text-gray-700">
            {projectData.project_info.sector_analysis}
          </div>
          <Card className="bg-gray-100 border border-gray-200 h-36 mb-2 mt-2">
            <CardContent className="p-0 h-full flex items-center justify-center">
              <img
                src={projectData.project_info.logo}
                alt={projectData.project_info.name}
                className="w-full h-full object-cover"
              />
            </CardContent>
          </Card>
        </div>
        {/* Financing Information Section */}
        {selectedProject && projectData.fundraising_info && (
          <div className="px-4 mb-6 mt-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 bg-orange-500 rounded"></div>
              <div className="text-sm font-medium text-black">
                Financing Information
              </div>
            </div>
            <div className="text-xs text-gray-700 leading-relaxed mb-4">
              根据公开信息显示，{projectData.project_info.name}
              在项目早期就获得了资本市场的高度认可和支持，
              {projectData.project_info.name}
              已经完成了{projectData.fundraising_info.round_info?.length || 0}
              轮融资，总额超过了 {projectData.fundraising_info.total_raised}
              。这些数据充分展示了 {projectData.project_info.name}
              在区块链安全和可扩展性方面的领先地位和巨大潜力。同时，充足资金也为其后续的开发和发展提供了强有力的保障，让其能够更好地服务于比特币生态和其他协议。
            </div>
            <div className="text-xs text-gray-700 mb-4">投资机构：</div>
            <Card className="bg-gray-100 border border-gray-200 h-36 mb-2">
              <CardContent className="p-0 h-full flex items-center justify-center">
                <div className="text-xs text-gray-500">投资机构列表</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Project Data Section */}
        {selectedProject && (projectData.social_media_stats || projectData.on_chain_data) && (
          <div className="px-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 bg-orange-500 rounded"></div>
              <div className="text-sm font-medium text-black">项目数据</div>
            </div>
            <div className="text-xs text-gray-700 mb-3">社区热度与媒体报道</div>
            <Card className="bg-gray-100 border border-gray-200 h-36 mb-4">
              <CardContent className="p-0 h-full flex items-center justify-center">
                <div className="text-xs text-gray-500">投资机构列表</div>
              </CardContent>
            </Card>
            <div className="space-y-2 text-xs mb-4">
              {projectData.social_media_stats?.twitter && (
                <div className="flex justify-between">
                  <span className="text-gray-700">X (Twitter)</span>
                  <span className="text-black">
                    {formatNumber(
                      projectData.social_media_stats.twitter.followers || 0
                    )}{" "}
                    <span className="text-green-500">
                      (
                      {formatPercentage(
                        projectData.social_media_stats.twitter
                          .followers_7d_increment || 0
                      )}
                      /7d)
                    </span>
                  </span>
                </div>
              )}
              {projectData.social_media_stats?.telegram && (
                <div className="flex justify-between">
                  <span className="text-gray-700">Telegram</span>
                  <span className="text-black">
                    {formatNumber(
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
              {projectData.social_media_stats?.discord && (
                <div className="flex justify-between">
                  <span className="text-gray-700">Discord</span>
                  <span className="text-black">
                    {formatNumber(
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
              {projectData.social_media_stats?.twitter && (
                <div className="flex justify-between">
                  <span className="text-gray-700">推特提及量</span>
                  <span className="text-black">
                    {formatNumber(
                      projectData.social_media_stats.twitter.mentions || 0
                    )}{" "}
                    <span className="text-green-500">
                      (
                      {formatPercentage(
                        projectData.social_media_stats.twitter
                          .mentions_7d_increment || 0
                      )}
                      /7d)
                    </span>
                  </span>
                </div>
              )}
              {projectData.social_media_stats?.twitter?.sentiment && (
                <div className="flex justify-between">
                  <span className="text-gray-700">社区情感</span>
                  <span className="text-black">
                    😀 {projectData.social_media_stats.twitter.sentiment[0]}% 😡{" "}
                    {projectData.social_media_stats.twitter.sentiment[2]}% 😐{" "}
                    {projectData.social_media_stats.twitter.sentiment[1]}%
                  </span>
                </div>
              )}
              {projectData.social_media_stats?.media_mentions && (
                <div className="flex justify-between">
                  <span className="text-gray-700">媒体报道</span>
                  <div className="flex gap-1">
                    {projectData.social_media_stats.media_mentions
                      .slice(0, 3)
                      .map((item, index) => (
                        <div
                          key={index}
                          className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
                        >
                          <span className="text-xs text-white font-medium">
                            {item.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 mb-2">
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
            </div>
          </div>
        )}
        {/* Markets Section */}
        {projectData.market_data && (
          <div className="px-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 bg-orange-500 rounded"></div>
              <div className="text-sm font-medium text-black">Markets</div>
            </div>
            <Card className="bg-gray-100 border border-gray-200 h-36 mb-2">
              <CardContent className="p-0 h-full flex items-center justify-center">
                <div className="text-xs text-gray-500">30 days 价格走势图</div>
              </CardContent>
            </Card>
            <div className="space-y-2 text-xs mb-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Trading Volume (24H)</span>
                <span className="text-black">
                  $
                  {formatNumber(
                    projectData.market_data.trading_volume_24h || 0
                  )}{" "}
                  <span className="text-red-500">
                    {projectData.market_data.trading_volume_24h_desc}
                  </span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Circulating Market Cap</span>
                <span className="text-black">
                  $
                  {formatNumber(
                    projectData.market_data.circulating_market_cap || 0
                  )}{" "}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Fully Diluted Valuation</span>
                <span className="text-black">
                  $
                  {formatNumber(
                    projectData.market_data.fully_diluted_valuation || 0
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Support Exchanges</span>
                <div className="flex gap-1">
                  {projectData.market_data.support_exchanges?.map(
                    (exchange, index) => (
                      <div
                        key={index}
                        className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
                        title={exchange.name}
                      >
                        <img
                          src={exchange.logo}
                          alt={exchange.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )
                  ) || <div className="w-3 h-3 bg-gray-300 rounded-full"></div>}
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500 text-right">
              update date: {new Date().toLocaleString()}
            </div>
          </div>
        )}
        {/* Tokenomics Section */}
        {selectedProject && projectData.tokenomics && (
          <div className="px-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 bg-orange-500 rounded"></div>
              <div className="text-sm font-medium text-black">Tokenomics</div>
            </div>

            <div className="space-y-2 text-xs mb-4">
              <div className="flex justify-between">
                <span className="text-gray-700">Token Symbol</span>
                <span className="text-black font-medium">
                  {projectData.tokenomics.token_symbol}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Circulating Supply</span>
                <span className="text-black">
                  {formatNumber(projectData.tokenomics.circulating_supply || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Total Supply</span>
                <span className="text-black">
                  {formatNumber(projectData.tokenomics.total_supply || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Support Chains</span>
                <div className="flex gap-1">
                  {projectData.tokenomics.support_chains?.map(
                    (chain, index) => (
                      <ChainLogo key={index} chain={chain} size={18} />
                    )
                  ) || <div className="w-3 h-3 bg-gray-300 rounded-full"></div>}
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Referral Docs</span>
                <span className="text-blue-600 underline cursor-pointer">
                  {projectData.tokenomics.token_symbol} Tokenomics
                </span>
              </div>
            </div>

            <div className="text-xs text-gray-700 mb-2">
              Distribution Overview
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3 mb-2">
              <div className="space-y-2 text-xs mb-4">
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="text-gray-600">Token Symbol:</span>
                  <span className="font-semibold text-gray-800">
                    {projectData.tokenomics.token_symbol || "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center  border-b border-gray-200 pb-3">
                  <span className="text-gray-600">Token Total Supply:</span>
                  <span className="font-semibold text-gray-800">
                    {projectData.tokenomics.total_supply
                      ? formatNumber(projectData.tokenomics.total_supply)
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center  border-b border-gray-200 pb-3">
                  <span className="text-gray-600">
                    Initial Circulating Supply:
                  </span>
                  <span className="font-semibold text-gray-800 text-right">
                    {projectData.tokenomics.circulating_supply
                      ? `${formatNumber(
                          projectData.tokenomics.circulating_supply
                        )} (${(
                          (projectData.tokenomics.circulating_supply /
                            (projectData.tokenomics.total_supply || 1)) *
                          100
                        ).toFixed(2)}%)`
                      : "-"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs border-b border-gray-100 pb-2">
                  <div className="flex justify-between items-start mb-1">
                    <div className="text-gray-600">Community & Launch</div>
                    <div className="font-semibold text-gray-800">
                      {projectData.tokenomics.distribution_details
                        ?.community_launch?.percentage
                        ? `${projectData.tokenomics.distribution_details.community_launch.percentage}%`
                        : "-"}
                    </div>
                  </div>
                  <div className="text-gray-500 text-xs">
                    {projectData.tokenomics.distribution_details
                      ?.community_launch?.vesting || "-"}
                  </div>
                </div>

                <div className="text-xs border-b border-gray-100 pb-2">
                  <div className="flex justify-between items-start mb-1">
                    <div className="text-gray-600">Ecosystem Growth</div>
                    <div className="font-semibold text-gray-800">
                      {projectData.tokenomics.distribution_details
                        ?.ecosystem_growth?.percentage
                        ? `${projectData.tokenomics.distribution_details.ecosystem_growth.percentage}%`
                        : "-"}
                    </div>
                  </div>
                  <div className="text-gray-500 text-xs">
                    {projectData.tokenomics.distribution_details
                      ?.ecosystem_growth?.vesting || "-"}
                  </div>
                </div>

                <div className="text-xs border-b border-gray-100 pb-2">
                  <div className="flex justify-between items-start mb-1">
                    <div className="text-gray-600">DAO Treasury</div>
                    <div className="font-semibold text-gray-800">
                      {projectData.tokenomics.distribution_details?.dao_treasury
                        ?.percentage
                        ? `${projectData.tokenomics.distribution_details.dao_treasury.percentage}%`
                        : "-"}
                    </div>
                  </div>
                  <div className="text-gray-500 text-xs">
                    {projectData.tokenomics.distribution_details?.dao_treasury
                      ?.vesting || "-"}
                  </div>
                </div>

                <div className="text-xs border-b border-gray-100 pb-2">
                  <div className="flex justify-between items-start mb-1">
                    <div className="text-gray-600">Investors</div>
                    <div className="font-semibold text-gray-800">
                      {projectData.tokenomics.distribution_details?.investors
                        ?.percentage
                        ? `${projectData.tokenomics.distribution_details.investors.percentage}%`
                        : "-"}
                    </div>
                  </div>
                  <div className="text-gray-500 text-xs">
                    {projectData.tokenomics.distribution_details?.investors
                      ?.vesting || "-"}
                  </div>
                </div>

                <div className="text-xs border-b border-gray-100 pb-2">
                  <div className="flex justify-between items-start mb-1">
                    <div className="text-gray-600">Public Sale</div>
                    <div className="font-semibold text-gray-800">
                      {projectData.tokenomics.distribution_details?.public_sale
                        ?.percentage
                        ? `${projectData.tokenomics.distribution_details.public_sale.percentage}%`
                        : "-"}
                    </div>
                  </div>
                  <div className="text-gray-500 text-xs">
                    {projectData.tokenomics.distribution_details?.public_sale
                      ?.vesting || "-"}
                  </div>
                </div>

                <div className="text-xs pb-2">
                  <div className="flex justify-between items-start mb-1">
                    <div className="text-gray-600">Team</div>
                    <div className="font-semibold text-gray-800">
                      {projectData.tokenomics.distribution_details?.team
                        ?.percentage
                        ? `${projectData.tokenomics.distribution_details.team.percentage}%`
                        : "-"}
                    </div>
                  </div>
                  <div className="text-gray-500 text-xs">
                    {projectData.tokenomics.distribution_details?.team
                      ?.vesting || "-"}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500 text-right">
              update date: {new Date().toLocaleString()}
            </div>
          </div>
        )}
        {/* Market Activity Section */}
        {projectData.campaign &&
          projectData.tokenomics &&
          projectData.market_data && (
            <div className="px-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-4 bg-orange-500 rounded"></div>
                <div className="text-sm font-medium text-black">市场活动</div>
              </div>

              {/* Ongoing Activities */}
              <div className="mb-4">
                <div className="text-xs font-medium text-black mb-2">
                  进行中
                </div>
                <div className="space-y-2 text-xs text-gray-700">
                  <div className="flex justify-between">
                    <span>奖励总价值</span>
                    <span>
                      {projectData.campaign.participants}{" "}
                      {projectData.tokenomics.token_symbol}($
                      {(projectData.market_data.token_price || 0) *
                        (projectData.campaign.participants || 0)}
                      )
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>参与人数</span>
                    <span>
                      {formatNumber(projectData.campaign.participants || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>社区攻略</span>
                    <span>
                      {projectData.campaign.platforms?.length || 0}篇，点赞最高
                      1.2K
                    </span>
                  </div>
                </div>
              </div>

              {/* Historical Activities */}
              <div className="mb-4">
                <div className="text-xs font-medium text-black mb-2">
                  历史活动
                </div>
                <div className="space-y-2 text-xs text-gray-700">
                  <div className="flex justify-between">
                    <span>奖励总价值</span>
                    <span>
                      {projectData.campaign.participants}{" "}
                      {projectData.tokenomics.token_symbol}($
                      {(projectData.market_data.token_price || 0) *
                        (projectData.campaign.participants || 0)}
                      )
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>参与人数</span>
                    <span>
                      {formatNumber(
                        (projectData.campaign.participants || 0) * 10
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>社区攻略</span>
                    <span>
                      {projectData.campaign.platforms?.length || 0}篇，点赞最高
                      1.2K
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        {/* Project Links Section */}
        {projectData.social_media_links && (
          <div className="px-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 bg-orange-500 rounded"></div>
              <div className="text-sm font-medium text-black">项目链接</div>
            </div>
            <div className="grid grid-cols-4 gap-3 mb-4">
              {[
                {
                  name: "Discord",
                  url: projectData.social_media_links.discord,
                },
                {
                  name: "Telegram",
                  url: projectData.social_media_links.telegram,
                },
                { name: "Medium", url: projectData.social_media_links.medium },
                { name: "Github", url: projectData.social_media_links.github },
              ].map((platform) => (
                <Card
                  key={platform.name}
                  className={`aspect-square hover:bg-gray-200 transition-colors cursor-pointer ${
                    platform.url
                      ? "bg-gray-100 border border-gray-200"
                      : "bg-gray-50 border border-gray-100"
                  }`}
                  onClick={() =>
                    platform.url && window.open(platform.url, "_blank")
                  }
                >
                  <CardContent className="p-0 h-full flex items-center justify-center">
                    <div
                      className={`text-xs text-center font-medium ${
                        platform.url ? "text-gray-700" : "text-gray-400"
                      }`}
                    >
                      {platform.name}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                {
                  name: "Website",
                  url: projectData.social_media_links.website,
                },
                { name: "Docs", url: projectData.social_media_links.defliama },
                { name: "dApp", url: projectData.social_media_links.website },
                {
                  name: "X(Twitter)",
                  url: projectData.social_media_links.twitter,
                },
              ].map((platform) => (
                <Card
                  key={platform.name}
                  className={`aspect-square hover:bg-gray-200 transition-colors cursor-pointer ${
                    platform.url
                      ? "bg-gray-100 border border-gray-200"
                      : "bg-gray-50 border border-gray-100"
                  }`}
                  onClick={() =>
                    platform.url && window.open(platform.url, "_blank")
                  }
                >
                  <CardContent className="p-0 h-full flex items-center justify-center">
                    <div
                      className={`text-xs text-center font-medium ${
                        platform.url ? "text-gray-700" : "text-gray-400"
                      }`}
                    >
                      {platform.name}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        {/* Project Summary Section */}
        <div className="px-4 mb-3 mt-4">
          <div className="flex items-center gap-2 ">
            <div className="w-1 h-4 bg-orange-500 rounded"></div>
            <div className="text-sm font-medium text-black">项目总结</div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="px-4 mb-6">
          <div className="text-xs text-gray-700 leading-relaxed">
            {projectData.project_info.name} 根据公开信息显示，
            {projectData.project_info.name}
            在项目早期就获得了资本市场的高度认可和支持，
            {projectData.project_info.name}
            已经完成了{projectData.fundraising_info?.round_info?.length || 0}
            轮融资，总额超过了{" "}
            {projectData.fundraising_info?.total_raised || "N/A"}
            。这些数据充分展示了 {projectData.project_info.name}
            在区块链安全和可扩展性方面的领先地位和巨大潜力。同时，充足资金也为其后续的开发和发展提供了强有力的保障，让其能够更好地服务于比特币生态和其他协议。
          </div>
          <div className="text-sm text-gray-600 mt-2">
            以上是 Yomo 为您总结生成的关于 {projectData.project_info.name}
            的项目简报。如果你想要更加完整的报告，可以前往{" "}
            <span className="text-blue-600 underline cursor-pointer">
              Web 网站⏭
            </span>{" "}
            进行报告生成。
          </div>
        </div>
        {/* Bottom Navigation */}
        <div className="px-4 pb-8">
          {/* Warning Banner */}
          <div className="mb-4">
            <div className="text-xs text-red-600">
              报告中的所有数据均来自网络、社区的公开数据源或用户上报的数据！
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <Share2 className="w-4 h-4 text-gray-600" />
                </Button>
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <Bookmark className="w-4 h-4 text-gray-600" />
                </Button>
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <MessageCircle className="w-4 h-4 text-gray-600" />
                </Button>
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <Heart className="w-4 h-4 text-gray-600" />
                </Button>
              </div>
              <div className="text-xs text-orange-600 underline mt-1 cursor-pointer">
                数据纠错
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
