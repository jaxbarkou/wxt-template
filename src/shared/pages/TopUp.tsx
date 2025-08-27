import { ArrowLeftIcon } from "lucide-react";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { AssetsNetworkItem, CreditsPlanItem } from "@/modal/user";
import {
  cancelCreditsOrder,
  getAssetsNetworkList,
  getCreditsPlans,
} from "@/lib/api/user";
import popularBg from "@/assets/images/popular-bg.png";
import popularImg from "@/assets/images/popular.png";
import { BaseDialog } from "@/components/custom/Modal/BaseDialog";

function moveByIdToFront(arr: AssetsNetworkItem[], symbol: string) {
  const idx = arr.findIndex((it) => it.symbol === symbol);
  return idx <= 0
    ? arr.slice()
    : [arr[idx], ...arr.slice(0, idx), ...arr.slice(idx + 1)];
}

const TopUp = () => {
  const navigate = useNavigate();
  const [selectedCurrency, setSelectedCurrency] = useState("USDT");
  const [currencyList, setCurrencyList] = useState<AssetsNetworkItem[]>([]);
  const [creditOptions, setCreditOptions] = useState<CreditsPlanItem[]>([]);
  const [unpaidOrders, setUnpaidOrders] = useState<string[]>([]);
  const isUnpaid = useMemo(() => unpaidOrders.length > 0, [unpaidOrders]);
  const [orderOpen, setOrderOpen] = useState<boolean>(false);
  const fetchAssetsNetworkList = async () => {
    try {
      const response = await getAssetsNetworkList();
      if (response.code === 1 && response.result) {
        let arr = moveByIdToFront(response.result, "USDT");
        setCurrencyList(arr);
        setSelectedCurrency(arr[0].symbol); // Set default selected currency
      }
    } catch (error) {
      console.error("Failed", error);
    }
  };

  const fetchPlans = useCallback(async () => {
    try {
      const response = await getCreditsPlans(selectedCurrency);
      if (response.result) {
        setCreditOptions(response.result?.plans);
        if (
          response.result?.unpaid_order_id_list &&
          response.result?.unpaid_order_id_list.length > 0
        ) {
          setUnpaidOrders(response.result?.unpaid_order_id_list);
        }
      }
    } catch (error) {
      console.error("Failed", error);
    }
  }, [selectedCurrency]);

  const goDetail = useCallback(
    (id: string) => {
      if (isUnpaid) {
        setOrderOpen(true);
        return;
      }
      navigate(`/top-up-detail?id=${id}&currency=${selectedCurrency}&unpay=0`);
    },
    [navigate, selectedCurrency, isUnpaid]
  );

  useEffect(() => {
    fetchAssetsNetworkList();
  }, []);

  useEffect(() => {
    if (selectedCurrency) {
      fetchPlans();
    }
  }, [selectedCurrency]);

  useEffect(() => {
    if (isUnpaid) {
      setOrderOpen(true);
    }
  }, [isUnpaid]);

  const handleCancelOrder = useCallback(async () => {
    try {
      if (isUnpaid) {
        let res = await cancelCreditsOrder(unpaidOrders[0]);
        if (res.result) {
          fetchPlans();
          setUnpaidOrders([]);
          setOrderOpen(false);
        }
      }
    } catch (error) {
      console.error("Failed to cancel order", error);
    }
  }, [isUnpaid, unpaidOrders]);

  const toContinueOrder = useCallback(() => {
    navigate(
      `/top-up-detail?id=${unpaidOrders[0]}&currency=${selectedCurrency}&unpay=1`
    );
  }, [unpaidOrders, selectedCurrency]);

  return (
    <div className="w-full min-h-screen mx-auto bg-white">
      <div className="pb-4">
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
        </div>

        <div className="w-full h-px mb-4 bg-brand-gray1/20" />

        <div className="flex items-center justify-between px-4 mb-4">
          <div className="text-xs font-normal text-brand-black">
            Pay with $PELL to get an extra 15% off
          </div>

          <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
            <SelectTrigger
              data-size="custom"
              className="w-auto px-3 py-1 h-auto rounded-[22px] border border-variable-collection bg-white h-6"
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

        <div className="bg-[#f6f6f8] rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4">
            {creditOptions.map((option, index) => (
              <Card
                key={index}
                className="relative py-0 overflow-visible transition-shadow duration-200 bg-white border-0 rounded-lg shadow-sm cursor-pointer hover:shadow-lg"
                onClick={() => {
                  goDetail(option.id);
                }}
              >
                <CardContent className="px-0 text-center min-h-[100px] flex flex-col">
                  <div className="flex flex-col items-center justify-center flex-1">
                    {option.is_popular === 1 && (
                      <div
                        style={{ backgroundImage: `url(${popularBg})` }}
                        className="absolute left-0 top-[-10px] flex items-center  bg-no-repeat bg-cover bg-center w-[96px] h-[25px]"
                      >
                        <img
                          className="w-[17px] h-auto mt-[-15px]"
                          src={popularImg}
                          alt=""
                        />
                        <span className="text-[10px] text-white leading-none mt-[-10px]">
                          {" "}
                          Popular Choice
                        </span>
                      </div>
                    )}

                    <div className="my-1 text-base font-bold text-brand-black">
                      {option.credits}
                    </div>

                    <div className="mb-3 text-sm font-normal text-brand-gray1">
                      Save {option.discount_percentage}%
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-full py-1.5 bg-brand-primary/20 rounded-b-lg ">
                    <div className="text-sm font-bold bottom-4 text-brand-black">
                      {option.list_price} {option.currency}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        {/* <div className="mt-8 text-xs font-normal text-center text-brand-gray1">
          Price from CoinGecko · Refreshes in 04:59
        </div> */}
        <BaseDialog open={orderOpen} onOpenChange={setOrderOpen}>
          <div className="bg-white rounded-lg border-0 h-[auto] p-4">
            <div className="p-0 space-y-4">
              {/* Header with title and close button */}
              <header className="flex items-center justify-between">
                <h2 className=" font-size-[16px] font-medium text-[#2c2c2c] text-base tracking-[0] leading-[normal]">
                  Tip
                </h2>
              </header>

              <div className="">
                <h3 className="">There are already pending payment orders</h3>
                {/* Action buttons */}
                <div className="flex gap-3 pt-2 mt-6">
                  <Button
                    variant="outline"
                    className="flex-1 h-[26px] rounded-[30px] font-medium text-sm text-center"
                    onClick={handleCancelOrder}
                  >
                    Cancel order
                  </Button>
                  <Button
                    className="flex-1 h-[26px] bg-[#f67c00] hover:bg-[#f67c00]/90  rounded-[30px] font-medium text-white text-sm text-center tracking-[0] leading-[normal] disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={toContinueOrder}
                  >
                    Continue to pay
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </BaseDialog>
      </div>
    </div>
  );
};

export default TopUp;
