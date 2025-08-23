import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import BigNumber from "bignumber.js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function foramtAddress(address: string) {
  return `${address.substring(0, 4)}...${address.substring(
    address.length - 5,
    address.length
  )}`;
}

// numFormat
export const numFormat = (num: number | string, digits: number) => {
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