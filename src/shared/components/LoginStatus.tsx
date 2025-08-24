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


const LoginStatus: React.FC = () => {
  const { setLoginModalOpen,token,userDetail } = useRootStore();
  const { creditsInfo } = useCreditsInfo();
  const navigate = useNavigate();
  const goTopUp = () => {
    navigate("/top-up");
  }; 
  if (!token) {
    return (
      <div className="sign-info">
        <div className="flex items-center justify-between mb-3 user-info">
          <div className="flex items-center user-info-left">
            <p className="text-[16px] font-bold">Guest Mode</p>
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
        <div className="sign-in-card bg-[#F6F6F8] p-[12px] mb-[12px] rounded-[8px]">
          <div className="sign-in-title text-center text-[16px] font-bold text-[#000000] mb-[5px]">
            <span>Sign in to unlock full features</span>
          </div>
          <div className="sign-in-content text-center text-[14px] text-[#979797]">
            <span>Sign up now and get 500 free credits!</span>
          </div>
        </div>
        <div className="share-card">
          <div className="flex items-center credits-row-left">
            <span className="mr-1">Credits</span>
            <PromptBorIcon color="#979797" size={16} />
          </div>
          <RightIcon color="#000" size={16} />
        </div>
        <div className="share-card">
          <span>Sign in to Earn</span>
          <RightIcon color="#000" size={16} />
        </div>
      </div>
    );
  }

  return (
    <div className="login-info">
      <div className="flex items-center justify-between mb-3 user-info">
        <div className="flex items-center user-info-left">
          <Avatar className="w-10 h-10">
            <AvatarImage src="https://c.animaapp.com/tsXhjynw/img/image-9@2x.png" />
          </Avatar>
          <div className="user-info-text text-[#2C2C2C] ml-1">
            <p className="text-[14px] font-bold">
               {userDetail?.nickName || 'Nickname'}
            </p>
            <p className="text-[12px]">{userDetail?.email||'-'}</p>
          </div>
        </div>
        <div className="user-info-right">
          <TabIcon size={16} color="#2C2C2C" />
        </div>
      </div>

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
        <div className="credits-row border-b border-[#E9E9E9]">
          <div className="flex items-center credits-row-left">
            <span className="mr-1">
              {creditsInfo?.balance} +{creditsInfo?.daily_credits} /day 
            </span>
          </div>
          <div className="credits-row-right">
            <RightIcon color="#000" size={16} />
          </div>
        </div>
        <div className="credits-row border-b border-[#E9E9E9]">
          <div className="flex items-center credits-row-left">
            <span className="mr-1">Total Staked</span>
            <PromptBorIcon color="#979797" size={16} />
          </div>
          <div className="credits-row-right">
            <RightIcon color="#000" size={16} />
          </div>
        </div>
        <div className="credits-row">
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
      <div className="share-yomo-card">
        <div className="share-yomo-content">
          <GiftIcon color="#000" size={20} />
          <div className="share-yomo-text">
            <div>Share Yomo with a friend</div>
            <div className="share-yomo-subtitle">Get 500 credits each</div>
          </div>
        </div>
        <RightIcon color="#000" size={16} />
      </div>
    </div>
  );
};

export default LoginStatus;
