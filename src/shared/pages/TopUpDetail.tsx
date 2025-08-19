import React from "react";
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
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";

const TopUpDetail = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full max-w-sm min-h-screen mx-auto bg-white">
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
          </div>
          <div className="p-3">
            <div className="text-sm font-normal text-center text-brand-black">
              Top up 2,000 Yomo's Credits
            </div>

            <div className="text-2xl font-bold text-center text-brand-black mt-2.5">
              12.85 USDT
            </div>

            {/* Promote Code Input */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="text-xs font-normal">Promote Code</span>
              <Input className="w-32 h-6 text-xs" placeholder="" />
            </div>

            {/* Network Selector */}
            <div className="flex items-center justify-center gap-2 mt-10">
              <span className="text-xs font-normal">Select Network</span>
              <Select defaultValue="bsc">
                <SelectTrigger
                  data-size="custom"
                  className="w-20 h-6 text-xs rounded-full border-variable-collection"
                >
                  <div className="flex items-center gap-1">
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bsc">BSC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-center mt-5">
              <div className="relative w-36 h-36">
                <img
                  className="w-full h-full"
                  alt="QR Code"
                  src="https://c.animaapp.com/ZCTEL7lb/img/rectangle-44@2x.png"
                />
                <img
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-7 h-7"
                  alt="Yomo Logo"
                  src="https://c.animaapp.com/ZCTEL7lb/img/2b5c7d80-7bcd-4cfb-8bd9-d1760a752afc-1@2x.png"
                />
              </div>
            </div>

            <div className="text-xs font-normal text-center break-all">
              0xec7842178520bb71f30523bcce4c10adc7e1cec4
            </div>
            {/* Notice Section */}
            <Card className="py-0 mt-5 bg-white rounded-lg">
              <CardContent className="p-4 space-y-3">
                <div className="text-xs font-normal">Notice:</div>

                <div className="text-xs font-normal ">
                  <span className="text-brand-gray1">Send only </span>
                  <span className="text-brand-primary">USDT</span>
                  <span className="text-brand-gray1"> to this address.</span>
                  <br />
                  <span className="text-brand-gray1">
                    Ensure the network is{" "}
                  </span>
                  <span className="text-brand-primary">BSC (BEP20)</span>
                  <span className="text-brand-gray1">.</span>
                </div>

                <div className="text-xs font-normal text-brand-gray1">
                  Expected arrival & unlock
                  <br />
                  15 Network Confirmations
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
