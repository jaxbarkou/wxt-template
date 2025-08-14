import React from 'react';
import { UserIcon, PromptBorIcon, RightIcon, GiftIcon,TabIcon } from '@/components/custom/svg';
import '@/shared/styles/Layout.css';
interface LoginStatusProps {
    isLoggedIn: boolean;
    userInfo?: {
        username: string;
        email: string;
    };
    credits?: {
        balance: string;
        dailyEarn: string;
        totalStaked: string;
        totalEarned: string;
    };
}

const LoginStatus: React.FC<LoginStatusProps> = ({ 
    isLoggedIn, 
    userInfo = { username: 'Kai', email: 'useremail@gmail.com' },
    credits = { balance: '1,500', dailyEarn: '+150', totalStaked: '0', totalEarned: '0' }
}) => {
    if (!isLoggedIn) {
        return (
            <div className="sign-info">
                <div className="user-info flex items-center justify-between mb-3">
                    <div className="user-info-left flex items-center">
                        <p className='text-[16px] font-bold'>Guest Mode</p>
                    </div>
                    <div className="user-info-right">
                        <button
                            className="px-3 py-1 text-sm text-white bg-[#FF9E3B] rounded-full hover:bg-[#FF9E3B]-700"
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
                    <div className="credits-row-left flex items-center">
                        <span className='mr-1'>Credits</span>
                        <PromptBorIcon color='#979797' size={16} />
                    </div>
                    <RightIcon color='#000' size={16} />
                </div>
                <div className="share-card">
                    <span>Sign in to Earn</span>
                    <RightIcon color='#000' size={16} />
                </div>
            </div>
        );
    }

    return (
      <div className="login-info">
        <div className="user-info flex items-center justify-between mb-3">
          <div className="user-info-left flex items-center">
            <UserIcon size={40} color="#F67C00" />
            <div className="user-info-text text-[#2C2C2C] ml-1">
              <p className="text-[14px] font-bold">
                Username - {userInfo.username}
              </p>
              <p className="text-[12px]">{userInfo.email}</p>
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
            <button className="px-3 py-1 text-sm text-white bg-[#FF9E3B] rounded-full hover:bg-[#FF9E3B]-700">
              Pop up
            </button>
          </div>
          <div className="credits-row border-b border-[#E9E9E9]">
            <div className="credits-row-left flex items-center">
              <span className="mr-1">
                {credits.balance} {credits.dailyEarn} /day
              </span>
            </div>
            <div className="credits-row-right">
              <RightIcon color="#000" size={16} />
            </div>
          </div>
          <div className="credits-row border-b border-[#E9E9E9]">
            <div className="credits-row-left flex items-center">
              <span className="mr-1">Total Staked</span>
              <PromptBorIcon color="#979797" size={16} />
            </div>
            <div className="credits-row-right">
              <RightIcon color="#000" size={16} />
            </div>
          </div>
          <div className="credits-row">
            <div className="credits-row-left flex items-center">
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