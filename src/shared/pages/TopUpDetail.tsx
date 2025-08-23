import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
import {
  AssetsNetworkItem,
  CreateOrderParams,
  CreditsPlanItem,
  DepositAddressType,
  NetworkItem,
} from "@/modal/user";
import {
  createCreditsOrder,
  getAssetsNetworkList,
  getCreditsPlans,
  getDepositAddress,
} from "@/lib/api/user";
import { QRCodeSVG } from "qrcode.react";
import { CopyIcon, CheckIcon } from "lucide-react";
import useCopyClipboard from "@/hooks/useCopyClipboard";

const TopUpDetail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isCopied, setCopied] = useCopyClipboard();
  const id = searchParams.get("id");
  const currency = searchParams.get("currency");
  const [selectedCurrency, setSelectedCurrency] = useState<
    string | undefined
  >();
  const [currencyList, setCurrencyList] = useState<AssetsNetworkItem[]>([]);
  const [curNetwork, setCurNetwork] = useState<string | null>(null);
  const [networkList, setNetworkList] = useState<NetworkItem[]>([]);
  const [curPlan, setCurPlan] = useState<CreditsPlanItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [request_id, setRequestId] = useState("");
  const [depositAddressData, setDepositAddressData] =
    useState<DepositAddressType | null>(null);
  const fetchAssetsNetworkList = useCallback(async () => {
    try {
      const response = await getAssetsNetworkList();
      if (response.code === 1 && response.result) {
        setCurrencyList(response.result);
        let networks: NetworkItem[] = [];
        response.result.forEach((item) => {
          if (item.symbol === currency) {
            networks = item.networks;
          }
        });
        setNetworkList(networks);
        setCurNetwork(networks[0].chain);
      }
    } catch (error) {
      console.error("Failed", error);
    }
  }, [currency]);

  const fetchPlans = useCallback(async () => {
    try {
      const response = await getCreditsPlans(selectedCurrency || "");
      if (
        response.result &&
        response.result?.plans &&
        response.result?.plans.length > 0
      ) {
        response.result?.plans.forEach((plan) => {
          if (plan.id === id) {
            setCurPlan(plan);
          }
        });
      }
      if (response.result?.request_id) {
        setRequestId(response.result?.request_id);
      }
    } catch (error) {
      console.error("Failed", error);
    }
  }, [selectedCurrency, id]);

  const curNetworkItem = useMemo(() => {
    return networkList.find((item) => item.chain === curNetwork);
  }, [curNetwork, networkList]);

  const toCreateOrder = useCallback(async () => {
    if (
      curNetworkItem &&
      !isLoading &&
      curPlan &&
      selectedCurrency &&
      request_id
    ) {
      // Create order logic here
      try {
        setIsLoading(true);
        let params: CreateOrderParams = {
          plan_id: curPlan?.id || "",
          chain_id: curNetworkItem.chainId,
          currency: selectedCurrency || "",
          token_address: curNetworkItem?.assetContract,
          plan_request_id: request_id,
        };
        const response = await createCreditsOrder(params);
        console.log("Order created", response);
      } catch (error) {
        console.error("Create order failed", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [curNetworkItem, isLoading, curPlan, selectedCurrency]);

  useEffect(() => {
    if (currency) {
      setSelectedCurrency(currency);
    }
  }, [currency]);

  useEffect(() => {
    if (selectedCurrency) {
      const selected = currencyList.find(
        (item) => item.symbol === selectedCurrency
      );
      if (selected && selected.networks) {
        setNetworkList(selected.networks);
        setCurNetwork(selected.networks[0].chain);
      }
    }
  }, [selectedCurrency, currencyList]);

  const curCurrencyItem = useMemo(() => {
    return currencyList.find((item) => item.symbol === selectedCurrency);
  }, [selectedCurrency, currencyList]);

  const fetchDepositAddress = useCallback(async () => {
    try {
      if (curNetworkItem?.chain) {
        const response = await getDepositAddress(curNetworkItem.chain);
        if (response.result) {
          setDepositAddressData(response.result);
        }
      }
    } catch (error) {
      console.error("Failed to fetch deposit address", error);
    }
  }, [curNetworkItem]);

  useEffect(() => {
    fetchAssetsNetworkList();
  }, []);

  useEffect(() => {
    if (selectedCurrency) {
      fetchPlans();
    }
  }, [selectedCurrency]);

  useEffect(() => {
    if (curNetworkItem && curPlan) {
      toCreateOrder();
    }
  }, [curNetworkItem, curPlan]);

  useEffect(() => {
    if (curNetworkItem) {
      fetchDepositAddress();
    }
  }, [curNetworkItem]);

  return (
    <div className="w-full  min-h-screen mx-auto bg-white">
      <div className="bg-[#f6f6f8] w-full min-h-screen relative">
        {/* Main Content */}
        <main className="">
          {/* Go Back and Currency Selector */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3 ">
              <Button
                onClick={() => navigate(-1)}
                variant="ghost"
                size="icon"
                className="h-6"
              >
                <ArrowLeftIcon className="w-5 h-5 text-brand-black" />
              </Button>
              <h1 className="text-base font-normal text-brand-black">
                Credits Top Up
              </h1>
            </div>
            <Select
              value={selectedCurrency}
              onValueChange={setSelectedCurrency}
              disabled
            >
              <SelectTrigger
                data-size="custom"
                className="w-auto px-3 py-1 h-auto rounded-[22px] border border-variable-collection bg-white h-6 mr-4"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-normal text-brand-black">
                    <SelectValue />
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent>
                {currencyList.map((currency) => (
                  <SelectItem key={currency.symbol} value={currency.symbol}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-normal ">
                        {currency.symbol}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="p-3">
            <div className="text-sm font-normal text-center text-brand-black">
              Top up {curPlan?.credits} Yomo's Credits
            </div>

            <div className="text-2xl font-bold text-center text-brand-black mt-2.5">
              {curPlan?.list_price} {curPlan?.currency}
            </div>

            {/* Promote Code Input */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="text-xs font-normal">Promote Code</span>
              <Input className="w-32 h-6 text-xs" placeholder="" />
            </div>

            {/* Network Selector */}
            <div className="flex items-center justify-center gap-2 mt-10">
              <span className="text-xs font-normal">Select Network</span>
              <Select value={curNetwork || ""} onValueChange={setCurNetwork}>
                <SelectTrigger
                  data-size="custom"
                  className="w-20 h-6 text-xs rounded-full border-variable-collection"
                >
                  <div className="flex items-center gap-1">
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {networkList.map((net) => (
                    <SelectItem key={net.chainId} value={net.chain}>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-normal ">
                          {net.chain}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-center mt-5">
              <div className="relative w-36 h-36">
                <QRCodeSVG
                  value={depositAddressData?.address || ""}
                  size={144}
                  level="M"
                />
                <img
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-7 h-7"
                  alt="Yomo Logo"
                  src={curCurrencyItem?.image || ""}
                />
              </div>
            </div>

            <div className="flex items-center justify-center mt-3 text-sm font-normal text-center break-all">
              <span>{depositAddressData?.address}</span>
              <Button
                variant="ghost"
                size="sm"
                className="w-6 h-6 p-0 hover:bg-gray-100"
                onClick={() => {
                  setCopied(depositAddressData?.address || "");
                }}
              >
                {isCopied ? (
                  <CheckIcon className="w-4 h-4 text-gray-400" />
                ) : (
                  <CopyIcon className="w-4 h-4 text-gray-400" />
                )}
              </Button>
            </div>
            {/* Notice Section */}
            <Card className="py-0 mt-5 bg-white rounded-lg">
              <CardContent className="p-4 space-y-3">
                <div className="text-xs font-normal">Notice:</div>

                <div className="text-xs font-normal ">
                  <span className="text-brand-gray1">Send only </span>
                  <span className="text-brand-primary">
                    {curCurrencyItem?.symbol}
                  </span>
                  <span className="text-brand-gray1"> to this address.</span>
                  <span className="text-brand-gray1">
                    Ensure the network is{" "}
                  </span>
                  <span className="text-brand-primary">
                    {curNetworkItem?.chain}
                  </span>
                  <span className="text-brand-gray1">.</span>
                </div>

                <div className="text-xs font-normal text-brand-gray1">
                  Expected arrival & unlock 15 Network Confirmations
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TopUpDetail;
