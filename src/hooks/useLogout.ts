import { useRootStore } from "@/store";
import { useUserDetail } from "@/hooks/useUserDetail";
import { useCreditsInfo } from "@/hooks/useCreditsInfo";

export const useLogout = () => {
  const { clearUserDetail, updateToken, setLoginModalOpen } = useRootStore();
  const { clearUser } = useUserDetail();
  const { clearCredits } = useCreditsInfo();

  const logout = () => {
    // 清空用户信息
    clearUserDetail();
    clearUser();
    
    // 清空token
    updateToken("");
    
    // 清空积分信息
    clearCredits();
    
    // 关闭登录模态框（如果打开的话）
    setLoginModalOpen(false);
    
    // 清除本地存储
    localStorage.removeItem('token');
    localStorage.removeItem('userDetail');
    localStorage.removeItem('creditsInfo');
  };

  return { logout };
}; 