import { useCallback } from 'react';
import { useRootStore } from '@/store';
import { getUserDetail } from '@/lib/api/user';

/**
 * 用户详情 Hook
 */
export const useUserDetail = () => {
  const { userDetail, setUserDetail, clearUserDetail } = useRootStore();

  // 获取用户详情
  const fetchUserDetail = useCallback(async () => {
    try {
      const response = await getUserDetail();
      if (response.code === 1 && response.result) {
        setUserDetail(response.result);
        return response.result;
      } else {
        console.error('获取用户详情失败:', response.message);
        return null;
      }
    } catch (error) {
      console.error('获取用户详情出错:', error);
      return null;
    }
  }, [setUserDetail]);

  // 清除用户详情
  const clearUser = useCallback(() => {
    clearUserDetail();
  }, [clearUserDetail]);

  return {
    userDetail,
    fetchUserDetail,
    clearUser,
  };
}; 