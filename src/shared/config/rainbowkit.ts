import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, arbitrum, base, sepolia } from 'wagmi/chains';

// RainbowKit配置 - 只使用默认配置，避免Coinbase Wallet的CSP问题
export const rainbowKitConfig = getDefaultConfig({
  appName: 'WXT Extension',
  projectId: '38a19caaa676151aa1520c5b421819ca',
  chains: [mainnet, polygon, optimism, arbitrum, base, sepolia],
  ssr: false, // 浏览器扩展不需要SSR
});

