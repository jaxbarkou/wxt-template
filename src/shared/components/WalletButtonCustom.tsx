import { WalletButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';
import { PageProps } from '../types';

interface WalletButtonCustomProps extends PageProps {
  showDetails?: boolean;
}

export const WalletButtonCustom: React.FC<WalletButtonCustomProps> = ({ 
  mode, 
  showDetails = true 
}) => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  // 格式化地址
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className={`w-full ${mode === 'popup' ? 'p-4' : 'p-2'}`}>
      <div className="mb-6 p-6 border border-gray-200 rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-lg">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            钱包连接
          </h3>
          <p className="text-gray-600 text-sm">
            点击下方按钮连接您的钱包
          </p>
        </div>
        
        <WalletButton.Custom wallet="walletconnect">
          {({
            error,
            loading,
            connected,
            ready,
            mounted,
            connector,
            connect,
          }) => {
            if (!mounted) {
              return (
                <div className="w-full px-6 py-4 bg-gray-100 text-gray-500 rounded-xl text-center">
                  加载中...
                </div>
              );
            }

            if (error) {
              return (
                <button
                  onClick={connect}
                  type="button"
                  className="w-full px-6 py-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 font-medium"
                >
                  重试连接
                </button>
              );
            }

            if (!connected) {
              return (
                <button
                  onClick={connect}
                  type="button"
                  disabled={loading}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-center space-x-3">
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className="text-lg">
                      {loading ? '连接中...' : '连接钱包'}
                    </span>
                  </div>
                </button>
              );
            }

            return (
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {connector.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {connector.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {address && formatAddress(address)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => disconnect()}
                  type="button"
                  className="w-full px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 font-medium"
                >
                  断开连接
                </button>
              </div>
            );
          }}
        </WalletButton.Custom>
      </div>

      {/* 钱包信息详情 */}
      {showDetails && isConnected && (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-xl">
          <h3 className="mb-3 text-lg font-semibold text-gray-800">连接信息</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-700">钱包地址:</span>
              <p className="font-mono text-xs break-all text-gray-600 mt-1">
                {address}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">连接状态:</span>
              <span className="text-green-600 ml-2 font-medium">已连接</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 