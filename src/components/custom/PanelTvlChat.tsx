// TinyAreaLine.tsx
import React from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";

type Point = { date: string; value: number };

const defaultData: Point[] = [
  { date: "07.01", value: 12 },
  { date: "07.02", value: 28 },
  { date: "07.03", value: 5 },
  { date: "07.04", value: 45 },
  { date: "07.05", value: 33 },
  { date: "07.06", value: 50 },
  { date: "07.07", value: 40 },
  { date: "07.08", value: 44 },
];

const ORANGE = "#F67C00";

export default function PanelTvlChat({
  data = defaultData,
}: {
  data?: Point[];
}) {
  const x = data.map((d) => d.date);
  const y = data.map((d) => d.value);

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
      min: 0,
      max: 100,
      // name: "($)",
      splitNumber: 3,
      nameTextStyle: { color: "#6B7280", padding: [0, 0, 0, -6] }, // gray-500
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: "#9CA3AF" },
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
