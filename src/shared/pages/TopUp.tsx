import { ArrowLeftIcon } from "lucide-react";
import React, { useState } from "react";
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

const TopUp = () => {
  const [selectedCurrency, setSelectedCurrency] = useState("USDT");
  const navigate = useNavigate();
  const currencies = [
    {
      value: "USDT",
      label: "USDT",
      icon: "https://c.animaapp.com/nRJll2SP/img/---1.png",
    },
    {
      value: "PELL",
      label: "$PELL",
      icon: "https://c.animaapp.com/nRJll2SP/img/---1.png",
    },
    {
      value: "BTC",
      label: "BTC",
      icon: "https://c.animaapp.com/nRJll2SP/img/---1.png",
    },
    {
      value: "ETH",
      label: "ETH",
      icon: "https://c.animaapp.com/nRJll2SP/img/---1.png",
    },
  ];

  const creditOptions = [
    {
      credits: "+2000 Credits",
      savings: "Save 20%",
      price: "16 USDT",
      isPopular: true,
    },
    {
      credits: "+5000 Credits",
      savings: "Save 20%",
      price: "37.5 USDT",
      isPopular: false,
    },
    {
      credits: "+1,500 Credits",
      savings: "Save 20%",
      price: "13.5 USDT",
      isPopular: false,
    },
    {
      credits: "+1,000 Credits",
      savings: "Save 20%",
      price: "9.5 USDT",
      isPopular: false,
    },
    {
      credits: "+500 Credits",
      savings: "",
      price: "5 USDT",
      isPopular: false,
    },
    {
      credits: "+100 Credits",
      savings: "",
      price: "1 USDT",
      isPopular: false,
    },
  ];

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
            <SelectTrigger className="w-auto px-3 py-1 h-auto rounded-[22px] border border-variable-collection bg-white">
              <div className="flex items-center gap-2">
                <span className="text-xs font-normal text-brand-black">
                  <SelectValue />
                </span>
              </div>
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={currency.value} value={currency.value}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-normal ">
                      {currency.label}
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
                className="relative py-0 overflow-hidden transition-shadow duration-200 bg-white border-0 rounded-lg shadow-sm cursor-pointer hover:shadow-lg"
                onClick={() => {
                  navigate("/top-up-detail");
                }}
              >
                <CardContent className="px-0 text-center min-h-[100px] flex flex-col">
                  <div className="flex flex-col items-center justify-center flex-1">
                    {option.isPopular && (
                      <div className="absolute flex items-center transform -translate-x-1/2 -top-2 left-1/2"></div>
                    )}

                    <div className="my-1 text-base font-bold text-brand-black">
                      {option.credits}
                    </div>

                    {option.savings && (
                      <div className="mb-3 text-sm font-normal text-brand-gray1">
                        {option.savings}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-center w-full py-1.5 bg-brand-primary/20">
                    <div className="text-sm font-bold bottom-4 text-brand-black">
                      {option.price}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div className="mt-8 text-xs font-normal text-center text-brand-gray1">
          Price from CoinGecko · Refreshes in 04:59
        </div>
      </div>
    </div>
  );
};

export default TopUp;
