import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SearchInput } from "@/shared/components/search/SearchInput";
import { Clock, Share2, Bookmark, MessageCircle, Heart } from "lucide-react";

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

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResult(null);
      return;
    }

    setIsSearching(true);
    setSearchResult(null);

    // 模拟搜索延迟
    setTimeout(() => {
      setIsSearching(false);
      setSearchResult(query);
    }, 1500);
  };

  return (
    <div className="bg-white flex justify-center items-start w-[100%] min-h-screen">
      <div className="bg-white w-[360px] min-h-screen relative">
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
              handleSearch(val);
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
              <span className="text-sm text-gray-500">Searching...</span>
            </div>
          )}

          {/* Search Result Title */}
          {!isSearching && searchResult && (
            <div className="px-4 py-3 flex items-center gap-3">
              <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
              <span className="text-sm text-gray-500">
                {searchResult} 的项目分析和总结
              </span>
            </div>
          )}
        </div>
        {/* Financing Information Section */}
        <div className="px-4 mb-6 mt-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 bg-orange-500 rounded"></div>
            <div className="text-sm font-medium text-black">
              Financing Information
            </div>
          </div>

          <div className="text-xs text-gray-700 mb-4">投资机构：</div>
          <div className="text-xs text-gray-700 leading-relaxed mb-4">
            根据公开信息显示，Pell Network
            在项目早期就获得了资本市场的高度认可和支持，Pell Network
            已经完成了三轮融资，总额超过了 600 万美金。这些数据充分展示了 Pell
            Network
            在区块链安全和可扩展性方面的领先地位和巨大潜力。同时，充足资金也为其后续的开发和发展提供了强有力的保障，让其能够更好地服务于比特币生态和其他协议。
          </div>

          <Card className="bg-gray-100 border border-gray-200 h-36 mb-2">
            <CardContent className="p-0 h-full flex items-center justify-center">
              <div className="text-xs text-gray-500">投资机构列表</div>
            </CardContent>
          </Card>
        </div>

        {/* Project Introduction Section */}
        <div className="px-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 bg-orange-500 rounded"></div>
            <div className="text-sm font-medium text-black">
              Project Introduction
            </div>
          </div>

          <div className="text-xs text-gray-700 leading-relaxed mb-4">
            Pell Network
            建立了一个由比特币再质押驱动的全链去中心化验证服务网络，将 BTCFi
            扩展到加密经济安全领域，充分释放比特币的安全潜力，提升了质押者的资本效率的同时为开发者提供高效、安全且低成本的验证服务解决方案。其目标用户包括希望获得额外收益的BTC
            LST质押者和寻求高效、安全、低成本的去中心化验证服务的开发者，以及其他加密货币投资者。
          </div>

          <Card className="bg-gray-100 border border-gray-200 h-36 mb-2">
            <CardContent className="p-0 h-full flex items-center justify-center">
              <div className="text-xs text-gray-500">
                Pell Extends BTFI into the Cryptoeconomic Security Sector
              </div>
            </CardContent>
          </Card>
        </div>

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
            Pell Network 根据公开信息显示，Pell Network
            在项目早期就获得了资本市场的高度认可和支持，Pell Network
            已经完成了三轮融资，总额超过了 800 万美金。这些数据充分展示了 Pell
            Network
            在区块链安全和可扩展性方面的领先地位和巨大潜力。同时，充足资金也为其后续的开发和发展提供了强有力的保障，让其能够更好地服务于比特币生态和其他协议。
          </div>
          <div className="text-sm text-gray-600 mt-2">
            以上是 Yomo 为您总结生成的关于 Pell Network
            的项目简报。如果你想要更加完整的报告，可以前往{" "}
            <span className="text-blue-600 underline cursor-pointer">
              Web 网站⏭
            </span>{" "}
            进行报告生成。
          </div>
        </div>

        {/* Project Links Section */}
        <div className="px-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 bg-orange-500 rounded"></div>
            <div className="text-sm font-medium text-black">项目链接</div>
          </div>
          <div className="grid grid-cols-4 gap-3 mb-4">
            {["Discord", "Telegram", "Medium", "Github"].map((platform) => (
              <Card
                key={platform}
                className="bg-gray-100 border border-gray-200 aspect-square hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <CardContent className="p-0 h-full flex items-center justify-center">
                  <div className="text-xs text-center text-gray-700 font-medium">
                    {platform}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-3">
            {["Website", "Docs", "dApp", "X(Twitter)"].map((platform) => (
              <Card
                key={platform}
                className="bg-gray-100 border border-gray-200 aspect-square hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <CardContent className="p-0 h-full flex items-center justify-center">
                  <div className="text-xs text-center text-gray-700 font-medium">
                    {platform}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Market Activity Section */}
        <div className="px-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 bg-orange-500 rounded"></div>
            <div className="text-sm font-medium text-black">市场活动</div>
          </div>

          {/* Ongoing Activities */}
          <div className="mb-4">
            <div className="text-xs font-medium text-black mb-2">进行中</div>
            <div className="space-y-2 text-xs text-gray-700">
              <div className="flex justify-between">
                <span>社区攻略</span>
                <span>5篇，点赞最高 1.2K</span>
              </div>
              <div className="flex justify-between">
                <span>参与人数</span>
                <span>6,529</span>
              </div>
              <div className="flex justify-between">
                <span>奖励总价值</span>
                <span>100K PELL ($15K)</span>
              </div>
            </div>
          </div>

          {/* Historical Activities */}
          <div className="mb-4">
            <div className="text-xs font-medium text-black mb-2">历史活动</div>
            <div className="space-y-2 text-xs text-gray-700">
              <div className="flex justify-between">
                <span>社区攻略</span>
                <span>5篇，点赞最高 1.2K</span>
              </div>
              <div className="flex justify-between">
                <span>参与人数</span>
                <span>683.29K</span>
              </div>
              <div className="flex justify-between">
                <span>奖励总价值</span>
                <span>12.37M PELL ($105K)</span>
              </div>
            </div>
          </div>

          <Card className="bg-gray-100 border border-gray-200 h-36 mb-2">
            <CardContent className="p-0 h-full flex items-center justify-center">
              <div className="text-xs text-gray-500">活动数据图表</div>
            </CardContent>
          </Card>
          <div className="text-xs text-gray-500 text-center">
            update date: 2025-08-18 23:09:33
          </div>
        </div>

        {/* Tokenomics Section */}
        <div className="px-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 bg-orange-500 rounded"></div>
            <div className="text-sm font-medium text-black">Tokenomics</div>
          </div>

          <div className="space-y-2 text-xs mb-4">
            <div className="flex justify-between">
              <span className="text-gray-700">Token Symbol</span>
              <span className="text-black font-medium">PELL</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Circulating Supply</span>
              <span className="text-black">1,223,729,382</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Total Supply</span>
              <span className="text-black">2,100,000,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Support Chains</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Referral Docs</span>
              <span className="text-blue-600 underline cursor-pointer">
                Pell Tokenomics
              </span>
            </div>
          </div>

          <div className="text-xs text-gray-700 mb-2">
            Distribution Overview
          </div>
          <Card className="bg-gray-100 border border-gray-200 h-36 mb-2">
            <CardContent className="p-0 h-full flex items-center justify-center">
              <div className="text-xs text-gray-500">代币分布饼图</div>
            </CardContent>
          </Card>
          <div className="text-xs text-gray-500 text-center">
            update date: 2025-08-18 23:09:33
          </div>
        </div>

        {/* Markets Section */}
        <div className="px-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 bg-orange-500 rounded"></div>
            <div className="text-sm font-medium text-black">Markets</div>
          </div>

          <div className="space-y-2 text-xs mb-4">
            <div className="flex justify-between">
              <span className="text-gray-700">Trading Volume (24H)</span>
              <span className="text-black">
                $80.25M <span className="text-red-500">-32.46%</span>
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Circulating Market Cap</span>
              <span className="text-black">$43.56M #147</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Fully Diluted Valuation</span>
              <span className="text-black">$238.46M</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Support Exchanges</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <Card className="bg-gray-100 border border-gray-200 h-36 mb-2">
            <CardContent className="p-0 h-full flex items-center justify-center">
              <div className="text-xs text-gray-500">30 days 价格走势图</div>
            </CardContent>
          </Card>
          <div className="text-xs text-gray-500 text-center">
            update date: 2025-08-18 23:09:33
          </div>
        </div>

        {/* Project Data Section */}
        <div className="px-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 bg-orange-500 rounded"></div>
            <div className="text-sm font-medium text-black">项目数据</div>
          </div>
          <div className="text-xs text-gray-700 mb-3">社区热度与媒体报道</div>

          <div className="space-y-2 text-xs mb-4">
            <div className="flex justify-between">
              <span className="text-gray-700">X (Twitter)</span>
              <span className="text-black">
                220.09K <span className="text-green-500">(0.12%/7d)</span>
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Telegram</span>
              <span className="text-black">
                220.09K <span className="text-green-500">(0.12%/7d)</span>
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Discord</span>
              <span className="text-black">
                220.09K <span className="text-green-500">(0.12%/7d)</span>
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">推特提及量</span>
              <span className="text-black">
                6,529 <span className="text-green-500">(+1.25%/7d)</span>
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">社区情感</span>
              <span className="text-black">😀 68% 😡 12% 😐 20%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">媒体报道</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-2">
            <Card className="bg-gray-100 border border-gray-200 h-36">
              <CardContent className="p-0 h-full flex items-center justify-center">
                <div className="text-xs text-gray-500">
                  TVL 和协议交互地址数据折现图
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-100 border border-gray-200 h-36">
              <CardContent className="p-0 h-full flex items-center justify-center">
                <div className="text-xs text-gray-500">TVL 分布饼图</div>
              </CardContent>
            </Card>
          </div>
          <div className="text-xs text-gray-500 text-center">
            update date: 2025-08-18 23:09:33
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
