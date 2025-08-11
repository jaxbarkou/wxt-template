import { useState, useEffect, useCallback, useMemo } from "react";
import { ArrowUpIcon, MenuIcon } from "lucide-react";
import { PageProps } from "../types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const Home: React.FC<PageProps> = ({ mode }) => {
  const categoryCards = [
    {
      title: "Hot Campaigns",
      description: "Trending airdrops and quests",
      position: "top-[394px] left-[18px]",
    },
    {
      title: "Alpha Narratives",
      description: "Early narratives worth watching",
      position: "top-[394px] left-[205px]",
    },
    {
      title: "Marketing Trends",
      description: "What's hot and moving the market",
      position: "top-[541px] left-[18px]",
    },
    {
      title: "Earn Rewards",
      description: "Contribute and Earn Rewards",
      position: "top-[541px] left-[205px]",
    },
  ];
  return (
    <>
      <div className="flex items-start justify-center min-h-screen ">
        <div className="bg-[#f9f9f9] w-[393px] min-h-[832px] flex flex-col px-4 py-3.5">
          {/* Header */}
          <header className="flex items-center justify-between mb-8">
            <MenuIcon className="w-6 h-6" />
            <h1 className=" font-normal text-black text-xl tracking-[0] leading-[normal]">
              Yomo
            </h1>
            <Button
              variant="outline"
              className="w-[66px] h-[26px] rounded-[10px] border border-solid border-[#00000080] p-0 text-white hover:text-white"
            >
              <span className=" font-normal text-sm tracking-[0] leading-[normal]">
                sign in
              </span>
            </Button>
          </header>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/"
              className="text-blue-300 transition-colors hover:text-blue-200"
            >
              返回首页
            </Link>
            <Link
              to="/user"
              className="text-blue-300 transition-colors hover:text-blue-200"
            >
              用户页面
            </Link>
            <Link
              to="/options"
              className="text-blue-300 transition-colors hover:text-blue-200"
            >
              设置页面
            </Link>
            <Link
              to="/login"
              className="text-blue-300 transition-colors hover:text-blue-200"
            >
              Login
            </Link>
          </div>
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className=" font-normal text-black text-xl tracking-[0] leading-[normal] mb-4">
              Hey,
            </h2>
            <p className=" font-normal text-black text-base tracking-[0] leading-[normal] mb-8">
              What do you feel like exploring today?
            </p>

            {/* Search Bar */}
            <div className="relative w-full h-[46px] bg-[#fafffa] rounded-[15px] border border-solid border-black mb-4">
              <Input
                className="absolute top-[3px] left-5 right-12 border-0 bg-transparent p-0  font-normal text-[#000000b2] text-sm tracking-[0] leading-[normal] focus-visible:ring-0"
                placeholder="Search tokens, projects or alpha..."
              />
              <ArrowUpIcon className="absolute w-6 h-6 top-[10px] right-5" />
            </div>
          </div>

          {/* Category Cards Section */}
          <div className="mb-8">
            <p className=" font-normal text-black text-sm tracking-[0] leading-[normal] mb-4">
              Not sure yet? Pick something below to get started.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {categoryCards.map((card, index) => (
                <Card
                  key={index}
                  className="w-full h-[125px] bg-[#d9d9d9] rounded-xl border-0 p-0"
                >
                  <CardContent className="flex flex-col justify-between h-full p-0">
                    <h3 className="pt-[15px] pl-[9px]  font-normal text-black text-base tracking-[0] leading-[normal]">
                      {card.title}
                    </h3>
                    <p className="pb-[15px] pl-[9px] pr-[9px]  font-normal text-[#000000cc] text-[13px] tracking-[0] leading-[normal]">
                      {card.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Community Section */}
          <div className="flex flex-col flex-1">
            <h2 className=" font-normal text-black text-base tracking-[0] leading-[normal] mb-2">
              Community Hot Topics
            </h2>
            <p className=" font-normal text-[#000000cc] text-[13px] tracking-[0] leading-[normal] mb-4">
              See what everyone is talking about right now.
            </p>

            {/* Community Content Placeholder */}
            <div className="w-full h-[58px] bg-[#d9d9d9] rounded-xl" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
