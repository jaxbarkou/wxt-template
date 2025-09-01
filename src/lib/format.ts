import BigNumber from "bignumber.js";
import moment from "moment";
import { parseUnits, formatUnits } from "ethers";

// 地址 脱敏
export const addressDes = (
  value: string | undefined,
  isContract: boolean = false
) => {
  if (value && isContract) {
    return value.replace(/^(.{6})(?:\w+)(.{6})$/, "$1....$2");
  }
  if (value) {
    return value.replace(/^(.{4})(?:\w+)(.{4})$/, "$1....$2");
  }
  return value || "-";
};

// separate
export const separate = (value: number | string, formatString?: number) => {
  let decimalPart = "";
  if (formatString) {
    decimalPart = ".".padEnd(formatString + 1, "0");
  }
  if (value && !Number.isNaN(value)) {
    const val = String(value);
    let integerPart = val;
    const integerLen = val.length;
    if (val.indexOf(".") >= 0) {
      [integerPart] = val.split(".");
      decimalPart = `.${val.split(".")[1]}`;
      if (formatString) {
        decimalPart = decimalPart.padEnd(formatString + 1, "0");
      }
    }

    if (integerLen <= 3) {
      return `${integerPart}${decimalPart}`;
    }
    return `${integerPart.replace(
      /(\d)(?=(?:\d{3})+$)/g,
      "$1,"
    )}${decimalPart}`;
  }
  return `0${decimalPart}`;
};

// numeral
export const numeral = (
  context: string | number | undefined,
  formatString = 2
) => {
  // let value = context;
  if (context) {
    let star = "";
    if (`${Number(context)}`.indexOf("e+") > -1) {
      const bigValue = `${context}`;
      if (bigValue.indexOf(".") > -1) {
        const int = bigValue.split(".")[0];
        let dec = bigValue.split(".")[1];
        dec = dec.slice(0, formatString);
        return Number(dec) === 0 ? `${int}` : `${int}.${dec}`;
      }
      return context.toString();
    }
    let value = Number(context);
    if (value < 0) {
      value = Math.abs(value);
      star = "-";
    }
    const bitLength = formatString > 8 ? 8 : formatString;
    let zoom = 1;
    for (let i = 0; i < bitLength; i += 1) {
      zoom *= 10;
    }

    value = new BigNumber(value).times(zoom).toNumber();
    value = Math.floor(value) / zoom;
    const resVal = value;
    const val = resVal.toString();
    if (val.indexOf("e-") > -1) {
      return value.toFixed(bitLength);
    }
    return star + resVal.toString();
  }
  if (Number(context) === 0) {
    return 0;
  }
  return 0;
};

// amountFormat
export const amountFormat = (
  value: number | string | undefined,
  formatString: number = 8
) => {
  const baseNum = 1 / Math.pow(10, formatString);
  if (Number(value) > 0 && Number(value) < baseNum) {
    return `< ${baseNum.toFixed(formatString)}`;
  }
  const parResult = separate(numeral(value, formatString), formatString);
  const result = parResult.toString().replace(/(?:\.0*|(\.\d+?)0+)$/, "$1");
  return result;
};

// bigAmountFormat

// 格式化函数
export const bigAmountFormat = (
  value: string | number | undefined,
  decimal: number = 18,
  formatString: number = 8
) => {
  let result = "0";
  if (value) {
    try {
      // **确保 value 是字符串**
      let valueStr = value.toString().trim();

      // **处理带小数的情况：直接去掉小数部分**
      if (valueStr.includes(".")) {
        const [intPart] = valueStr.split("."); // 只保留整数部分
        valueStr = intPart; // 只保留整数部分
      }

      // **将整数部分转换为 BigNumber**
      const bigValue = parseUnits(valueStr);

      // **转换回人类可读数值**
      const formattedValue = formatUnits(bigValue, decimal);

      // **格式化输出**
      result = formatString
        ? Number(formattedValue).toFixed(formatString)
        : formattedValue;
    } catch (error) {
      console.error("bigAmountFormat error:", error);
    }
  }
  return result;
};

// date
export const formatDate = (
  value: any,
  formatString = "YYYY-MM-DD HH:mm:ss"
) => {
  if (value) {
    return moment.unix(value).utc().format(formatString);
  }
  return "--";
};

// rate
export const rate = (
  value: string | number | undefined,
  decimal?: number,
  isNull?: boolean
) => {
  if (value || value === 0) {
    const val = Number(value) * 100;
    const de = decimal || decimal === 0 ? decimal : 2;
    const baseNum = 1 / Math.pow(10, de || 0);
    if (Number(val) > 0 && Number(val) < baseNum) {
      return `< ${baseNum.toFixed(de)}%`;
    }
    return `${val
      .toFixed(de)
      .toString()
      .replace(/(?:\.0*|(\.\d+?)0+)$/, "$1")}%`;
  }
  return isNull ? "" : "--";
};

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
/**
 * multiplyBigNumbers
 */
export const multiplyBigNumbers = (
  value1: string | number,
  value2: string | number
) => {
  try {
    const num1 = new BigNumber(value1);
    const num2 = new BigNumber(value2);

    const result = num1.multipliedBy(num2);

    return result.toFixed(8);
  } catch (error) {
    console.error("BigNumber 乘法失败:", error);
    throw new Error("无效的输入，无法完成乘法运算");
  }
};

export const toHalfAmount = (value: string | number) => {
  const num = new BigNumber(value || 0).times(0.5).toFixed(8);
  const val = num.replace(/(?:\.0*|(\.\d+?)0+)$/, "$1");
  return val;
};

// time
export const formatTimeRemaining = (endTimestamp: number) => {
  const now = Math.floor(Date.now() / 1000);
  const secondsLeft = endTimestamp - now;
  if (secondsLeft <= 0) return "已过期";
  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  // 格式化输出（分钟保持两位数）
  return `有效期${hours}h${minutes.toString().padStart(2, "0")}m`;
};

// time
export const formatElapsedTime = (startTimestamp: number) => {
  const now = Math.floor(Date.now() / 1000);
  const elapsedSeconds = now - startTimestamp;
  if (elapsedSeconds <= 0) return "0m";
  const days = Math.floor(elapsedSeconds / (24 * 3600));
  if (days > 0) return `${days}d`;
  const hours = Math.floor(elapsedSeconds / 3600);
  if (hours < 1) {
    const minutes = Math.floor(elapsedSeconds / 60);
    return `${minutes}m`;
  }
  // 超过1小时但不足1天，显示小时和分钟
  const minutes = Math.floor((elapsedSeconds % 3600) / 60);
  return `${hours}h${minutes.toString().padStart(2, "0")}m`;
};

// number zero
export const formatSmallNumber = (value: number) => {
  const str = value.toString();
  if (!str.includes(".")) {
    return str;
  }
  const [, decimalPart] = str.split(".");
  let zeroCount = 0;
  for (const digit of decimalPart) {
    if (digit === "0") {
      zeroCount++;
    } else {
      break;
    }
  }
  const subscriptMap: { [key: string]: string } = {
    "0": "₀",
    "1": "₁",
    "2": "₂",
    "3": "₃",
    "4": "₄",
    "5": "₅",
    "6": "₆",
    "7": "₇",
    "8": "₈",
    "9": "₉",
  };

  const subscript = zeroCount
    .toString()
    .split("")
    .map((d) => subscriptMap[d] || d)
    .join("");
  const remaining = decimalPart.slice(zeroCount);

  return `0.0${subscript}${remaining}`;
};

export const formatAddress = (address: string) => {
  return addressDes(address, true);
};

// 数字缩写格式化，如1000->1K, 1000000->1M
export const formatNumberShort = (num: number | string, digits = 2): string => {
  if (typeof num === "string") num = parseFloat(num);
  if (isNaN(num)) return "-";
  const units = [
    { value: 1e12, symbol: "T" },
    { value: 1e9, symbol: "B" },
    { value: 1e6, symbol: "M" },
    { value: 1e3, symbol: "K" },
  ];
  for (let i = 0; i < units.length; i++) {
    if (num >= units[i].value) {
      return (num / units[i].value).toFixed(digits) + units[i].symbol;
    }
  }
  // 小于1000时也保留digits位小数
  return num.toFixed(digits);
};

export const formatSeconds = (seconds: number): string => {
  const duration = moment.duration(seconds, "seconds");
  if (seconds < 60) {
    return `${Math.floor(duration.asSeconds())}s`;
  } else if (seconds < 3600) {
    return `${Math.floor(duration.asMinutes())}m`;
  } else {
    return `${Math.floor(duration.asHours())}h`;
  }
};
