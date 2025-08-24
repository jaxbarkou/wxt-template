// TinyAreaLine.tsx
import React from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import { numFormat } from "@/lib/utils";

type Point = { date: string; value: number };

const ORANGE = "#F67C00";

const PADDING_RATIO = 0.1;

export default function PanelTvlChat({
  data,
}: {
  data: { date: string; value: number }[];
}) {
  const x = data.map((d) => d.date);
  const y = data.map((d) => d.value);

  const formatYNun = (num: number) => {
    if (num > 1) {
      return numFormat(num, 0);
    } else {
      return `${num}`;
    }
  };

  const option: echarts.EChartsOption = {
    grid: { left: 38, right: 8, top: 6, bottom: 22, containLabel: false },
    tooltip: { trigger: "axis", axisPointer: { type: "line" }, borderWidth: 0 },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: x,
      axisLine: { lineStyle: { color: "#eeeeee" } },
      axisTick: { show: false },
      axisLabel: { color: "#9CA3AF" }, // tailwind gray-400
      splitLine: { show: false },
    },
    yAxis: {
      type: "value",
      min: (val: { min: number; max: number }) => {
        if (val.min === val.max) return val.min - 1; // 单值时给点空间
        const pad = (val.max - val.min) * PADDING_RATIO;
        return Math.floor((val.min - pad) * 100) / 100; // 可按需保留小数
      },
      max: (val: { min: number; max: number }) => {
        if (val.min === val.max) return val.max + 1;
        const pad = (val.max - val.min) * PADDING_RATIO;
        return Math.ceil((val.max + pad) * 100) / 100;
      },
      // name: "($)",
      splitNumber: 3,
      nameTextStyle: { color: "#6B7280", padding: [0, 0, 0, -6] }, // gray-500
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: "#9CA3AF",
        formatter: (value) => {
          return formatYNun(value);
        },
      },
      splitLine: { show: true, lineStyle: { color: "#F3F4F6" } }, // light grid line
    },
    series: [
      {
        type: "line",
        smooth: true,
        data: y,
        symbol: "none",
        lineStyle: { width: 1, color: ORANGE },
        areaStyle: {
          color: new (echarts as any).graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(246,124,0,0.25)" },
            { offset: 1, color: "rgba(246,124,0,0.00)" },
          ]),
        },
        emphasis: { disabled: true },
      },
    ],
    animation: true,
  };

  return <ReactECharts option={option} style={{ width: "100%", height: 80 }} />;
}
