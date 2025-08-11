import { useMemo } from "react";
// thrid-lib
import { useAccount as useAccountEvm } from "wagmi";

export function useActiveAccount() {
  const { address: account } = useAccountEvm();

  const activeAccount: string = useMemo(() => {
    return account || "";
  }, [account]);

  return {
    account,
    activeAccount,
  };
}
