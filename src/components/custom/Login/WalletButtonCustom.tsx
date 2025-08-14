import { useEffect } from "react";
import { WalletButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import _ from "lodash";
import { useLogin } from "@/hooks/useLogin";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

export const WalletButtonCustom: React.FC = () => {
  const { isConnected } = useAccount();
  const { handleLogin } = useLogin("");

  useEffect(() => {
    const lighgData = JSON.parse(localStorage.getItem("trading-fox") || "{}");
    const token = _.get(lighgData, "state.token", "");
    if (isConnected && !token) {
      handleLogin();
    }
  }, [isConnected]);

  return (
    <WalletButton.Custom wallet="walletconnect">
      {({ connect, loading }) => {
        return (
          <Button
            variant="outline"
            className="justify-start w-full h-12 gap-3 text-base bg-white rounded-2 border-neutral-200"
            onClick={connect}
            disabled={loading}
          >
            <Wallet className="w-5 h-5" />
            Continue with Crypto Wallet
          </Button>
        );
      }}
    </WalletButton.Custom>
  );
};
