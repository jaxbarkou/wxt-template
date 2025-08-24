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

  const option: echarts.EChartsOption = {
    grid: { left: 1, right: 1, top: 1, bottom: 1, containLabel: false },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "line" },
      borderWidth: 0,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: x,
      axisLine: { lineStyle: { color: "#eeeeee" } },
      axisTick: { show: false },
      // [CHANGED] 隐藏 X 轴刻度数字
      axisLabel: { show: false }, // 原: { color: "#9CA3AF" }
      splitLine: { show: false },
    },
    yAxis: {
      type: "value",
      min: (val: { min: number; max: number }) => {
        if (val.min === val.max) return val.min - 1; // 单值时给点空间
        const pad = (val.max - val.min) * PADDING_RATIO;
        return Math.floor((val.min - pad) * 100) / 100;
      },
      max: (val: { min: number; max: number }) => {
        if (val.min === val.max) return val.max + 1;
        const pad = (val.max - val.min) * PADDING_RATIO;
        return Math.ceil((val.max + pad) * 100) / 100;
      },
      splitNumber: 3,
      nameTextStyle: { color: "#6B7280", padding: [0, 0, 0, -6] },
      axisLine: { show: false },
      axisTick: { show: false },
      // [CHANGED] 隐藏 Y 轴刻度数字
      axisLabel: { show: false }, // 原: { color: "#9CA3AF", formatter: (value) => formatYNun(value) }
      // [CHANGED] 关闭 Y 轴辅助线（网格线）
      splitLine: { show: false }, // 原: { show: true, lineStyle: { color: "#F3F4F6" } }
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
