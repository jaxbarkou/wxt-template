import { WalletButton } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import { PageProps } from "../types";
import _ from "lodash";
import { useLogin } from "@/hooks/useLogin";

interface WalletButtonCustomProps extends PageProps {
  showDetails?: boolean;
}

export const WalletButtonCustom: React.FC<WalletButtonCustomProps> = ({
  mode,
  showDetails = true,
}) => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { handleLogin } = useLogin("");
  // 格式化地址
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  useEffect(() => {
    const lighgData = JSON.parse(localStorage.getItem("trading-fox") || "{}");
    const token = _.get(lighgData, "state.token", "");
    if (isConnected && !token) {
      handleLogin();
    }
  }, [isConnected]);

  return (
    <div className={`w-full ${mode === "popup" ? "p-4" : "p-2"}`}>
      <div className="p-6 mb-6 border border-gray-200 shadow-lg rounded-2xl bg-gradient-to-br from-white to-gray-50">
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-bold text-gray-900">钱包连接</h3>
          <p className="text-sm text-gray-600">点击下方按钮连接您的钱包</p>
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
                <div className="w-full px-6 py-4 text-center text-gray-500 bg-gray-100 rounded-xl">
                  加载中...
                </div>
              );
            }

            if (error) {
              return (
                <button
                  onClick={connect}
                  type="button"
                  className="w-full px-6 py-4 font-medium text-white transition-colors duration-200 bg-red-600 rounded-xl hover:bg-red-700"
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
                  className="w-full px-6 py-4 font-medium text-white transition-all duration-300 transform shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-center space-x-3">
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                    ) : (
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    <span className="text-lg">
                      {loading ? "连接中..." : "连接钱包"}
                    </span>
                  </div>
                </button>
              );
            }

            return (
              <div className="space-y-4">
                <div className="p-4 border border-green-200 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-blue-500">
                        <span className="text-lg font-bold text-white">
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
                  className="w-full px-6 py-3 font-medium text-white transition-colors duration-200 bg-red-600 rounded-xl hover:bg-red-700"
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
        <div className="p-4 mb-6 border border-gray-200 bg-gray-50 rounded-xl">
          <h3 className="mb-3 text-lg font-semibold text-gray-800">连接信息</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-700">钱包地址:</span>
              <p className="mt-1 font-mono text-xs text-gray-600 break-all">
                {address}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">连接状态:</span>
              <span className="ml-2 font-medium text-green-600">已连接</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
