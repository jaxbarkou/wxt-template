import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import BigNumber from "bignumber.js";
import moment from "moment";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function foramtAddress(address: string) {
  return `${address.substring(0, 4)}...${address.substring(
    address.length - 5,
    address.length
  )}`;
}

// numFormat
export const numFormat = (num: number | string, digits: number = 2) => {
  if (num !== undefined) {
    num = Number(String(num).replace(/\$\s?|(,*)/g, ""));
    const si = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "K" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "B" },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    let i;
    for (i = si.length - 1; i > 0; i--) {
      if (num >= si[i].value) {
        break;
      }
    }
    return (
      new BigNumber(num)
        .div(new BigNumber(si[i].value))
        .toNumber()
        .toFixed(digits)
        .replace(rx, "$1") + si[i].symbol
    );
  }
  return "--";
};

export const toMonthDay = (ts: number | string, tz?: string) => {
  const n = Number(ts);
  const ms = n < 1e12 ? n * 1000 : n; // 10位秒 → 毫秒
  return tz
    ? require("moment-timezone")(ms).tz(tz).format("MM-DD")
    : moment(ms).format("MM-DD");
};

export function getStateValue(path: string): any {
  const obj = JSON.parse(localStorage.getItem("yomo") || "{}");
  if (!obj || !obj.state) return undefined;
  
  return path.split('.').reduce((acc, key) => {
    if (acc && acc.hasOwnProperty(key)) {
      return acc[key];
    }
    return undefined;
  }, obj);
}
