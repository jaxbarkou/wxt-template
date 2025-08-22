import { useCallback } from 'react';
import { useRootStore } from '@/store';
import { getCreditsInfo } from '@/lib/api/user';

/**
 * 积分信息 Hook
 */
export const useCreditsInfo = () => {
  const { creditsInfo, setCreditsInfo, clearCreditsInfo } = useRootStore();

  // 获取积分信息
  const fetchCreditsInfo = useCallback(async () => {
    try {
      const response = await getCreditsInfo();
      if (response.code === 1 && response.result?.account) {
        setCreditsInfo(response.result.account);
        return response.result.account;
      } else {
        console.error('获取积分信息失败:', response.message);
        return null;
      }
    } catch (error) {
      console.error('获取积分信息出错:', error);
      return null;
    }
  }, [setCreditsInfo]);

  // 清除积分信息
  const clearCredits = useCallback(() => {
    clearCreditsInfo();
  }, [clearCreditsInfo]);

  return {
    creditsInfo,
    fetchCreditsInfo,
    clearCredits,
  };
};

/**
 * 使用示例:
 * 
 * import { useCreditsInfo } from '@/hooks/useCreditsInfo';
 * 
 * const MyComponent = () => {
 *   const { creditsInfo, fetchCreditsInfo, clearCredits } = useCreditsInfo();
 * 
 *   useEffect(() => {
 *     // 在组件挂载时获取积分信息
 *     fetchCreditsInfo();
 *   }, [fetchCreditsInfo]);
 * 
 *   return (
 *     <div>
 *       <p>当前积分: {creditsInfo?.balance || '0'}</p>
 *       <p>每日积分: {creditsInfo?.daily_credits || '0'}</p>
 *       <button onClick={fetchCreditsInfo}>刷新积分</button>
 *       <button onClick={clearCredits}>清除积分</button>
 *     </div>
 *   );
 * };
 */ 