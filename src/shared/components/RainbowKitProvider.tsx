import { RainbowKitProvider as Provider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { rainbowKitConfig } from '../config/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

// 创建React Query客户端
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

interface RainbowKitProviderProps {
  children: React.ReactNode;
}

export const RainbowKitProvider: React.FC<RainbowKitProviderProps> = ({ children }) => {
  return (
    <WagmiProvider config={rainbowKitConfig}>
      <QueryClientProvider client={queryClient}>
        <Provider
          locale="zh-CN"
        >
          {children}
        </Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}; 