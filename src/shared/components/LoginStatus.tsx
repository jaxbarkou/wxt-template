import React from "react";
import {
  UserIcon,
  PromptBorIcon,
  RightIcon,
  GiftIcon,
  TabIcon,
} from "@/components/custom/svg";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import "@/shared/styles/Layout.css";
import { useRootStore } from "@/store";
import { useCreditsInfo } from "@/hooks/useCreditsInfo";
import { useNavigate } from "react-router-dom";
import { LoginType } from "@/modal";
import logoImg from "@/assets/images/logo.png";
import giftBg from "@/assets/images/gift-bg.png";

const LoginStatus: React.FC = () => {
  const { setLoginModalOpen, token, userDetail, loginType, googleProfile } =
    useRootStore();
  const { creditsInfo } = useCreditsInfo();
  const navigate = useNavigate();
  const goTopUp = () => {
    navigate("/top-up");
  };
  if (!token) {
    return (
      <div className="p-4 sign-info">
        <div className="flex items-center justify-between mb-3 user-info">
          <div className="flex items-center user-info-left">
            <p className="text-[16px] font-bold font-brand-medium">
              Guest Mode
            </p>
          </div>
          <div className="user-info-right">
            <button
              className="px-3 py-1 text-sm text-white bg-[#FF9E3B] rounded-full hover:bg-[#FF9E3B]-700 cursor-pointer"
              onClick={() => setLoginModalOpen(true)}
            >
              Sign in
            </button>
          </div>
        </div>
        <div className="sign-in-card bg-white border border-brand-gray1/20 p-[12px] mb-[12px] rounded-[8px]">
          <div className="sign-in-title text-center text-[16px] font-bold text-[#000000] mb-[5px]">
            <span>Sign in to unlock full features</span>
          </div>
          <div className="sign-in-content text-center text-[14px] text-[#979797]">
            <span>Sign up now and get 500 free credits!</span>
          </div>
        </div>
        <div className=" share-card hover:bg-brand-gray1/20">
          <div className="flex items-center credits-row-left">
            <span className="mr-1">Credits</span>
            <PromptBorIcon color="#979797" size={16} />
          </div>
          <RightIcon color="#000" size={16} />
        </div>
        <div className="share-card hover:bg-brand-gray1/20">
          <span>Sign in to Earn</span>
          <RightIcon color="#000" size={16} />
        </div>
      </div>
    );
  }

  return (
    <div className="login-info bg-[#F6F6F8]">
      <div className="flex items-center justify-between p-4 user-info">
        <div className="flex items-center user-info-left">
          <Avatar onClick={() => navigate("/settings")} className="w-10 h-10">
            <AvatarImage
              src={
                loginType === LoginType.Google
                  ? googleProfile?.picture
                  : userDetail?.avatarUrl
                  ? userDetail?.avatarUrl
                  : logoImg
              }
            />
          </Avatar>
          <div className="user-info-text text-[#2C2C2C] ml-1">
            <p className="text-[14px] font-bold">
              {loginType === LoginType.Google
                ? googleProfile?.name
                : userDetail?.nickName
                ? userDetail?.nickName
                : `Nickname`}
            </p>
            <p className="text-[12px]">
              {loginType === LoginType.Google
                ? userDetail?.gmail
                : userDetail?.email || "-"}
            </p>
          </div>
        </div>
        <div className="user-info-right">
          {/* <TabIcon size={16} color="#2C2C2C" /> */}
        </div>
      </div>
      <div className="rounded-t-[8px] bg-white pb-4">
        {/* Credits卡片 */}
        <div className="credits-card">
          <div className="credits-header">
            <div className="credits-title">
              <span>Credits</span>
              <PromptBorIcon color="#979797" size={16} />
            </div>
            <button
              onClick={goTopUp}
              className="px-3 py-1 text-sm text-white bg-[#FF9E3B] rounded-full hover:bg-[#FF9E3B]-700"
            >
              Top up
            </button>
          </div>
          <div className="credits-row">
            <div className="flex items-center credits-row-left">
              <span className="mr-1">
                {creditsInfo?.balance} +{creditsInfo?.daily_credits} /day
              </span>
            </div>
            <div className="credits-row-right">
              <RightIcon color="#000" size={16} />
            </div>
          </div>
          <div className="credits-row">
            <div className="flex items-center credits-row-left">
              <span className="mr-1">Total Staked</span>
              <PromptBorIcon color="#979797" size={16} />
            </div>
            <div className="credits-row-right">
              <RightIcon color="#000" size={16} />
            </div>
          </div>
          <div className="border-[#F6F6F8] border-b credits-row !pb-4">
            <div className="flex items-center credits-row-left">
              <span className="mr-1">Total Earned</span>
              <PromptBorIcon color="#979797" size={16} />
            </div>
            <div className="credits-row-right">
              <RightIcon color="#000" size={16} />
            </div>
          </div>
        </div>

        {/* Share Knowledge卡片 */}
        <div className="share-card">
          <span>Share Knowledge & Earn</span>
          <RightIcon color="#000" size={16} />
        </div>

        {/* Share Yomo卡片 */}
        <div className="px-4">
          <div
            style={{ backgroundImage: `url(${giftBg})` }}
            className="flex justify-end share-yomo-card pr-[30px]"
          >
            <div className="share-yomo-content">
              <div className="share-yomo-text">
                <div className="font-brand-medium text-[14px]">
                  Share Yomo with a friend
                </div>
                <div className="share-yomo-subtitle ">Get 500 credits each</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginStatus;
