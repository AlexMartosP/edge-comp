"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Separator } from "./ui/Separator";

type ChartProps = {
  data: object[];
  width: number;
  height: number;
  line1Key: string;
  line2Key: string;
};

export default function Chart({
  data,
  width,
  height,
  line1Key,
  line2Key,
}: ChartProps) {
  return (
    <AreaChart width={width} height={height} data={data}>
      <defs>
        <linearGradient id={line1Key} x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
          <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
        </linearGradient>
        <linearGradient id={line2Key} x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
          <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
        </linearGradient>
      </defs>
      <XAxis
        type="number"
        dataKey="fetchNum"
        ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
        domain={[1, 10]}
      />
      <YAxis />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip
        isAnimationActive={false}
        content={<CustomTooltip line1={line1Key} line2={line2Key} />}
      />
      <Area
        type="linear"
        dataKey={line1Key}
        stroke="#8884d8"
        fillOpacity={1}
        fill={`url(#${line1Key})`}
        name="Edge"
        dot={true}
        isAnimationActive={false}
      />
      <Area
        type="linear"
        dataKey={line2Key}
        stroke="#82ca9d"
        fillOpacity={1}
        fill={`url(#${line2Key})`}
        name="Serverless"
        dot={true}
        isAnimationActive={false}
      />
    </AreaChart>
  );
}

function CustomTooltip({ active, payload, line1, line2 }: any) {
  if (active && payload && payload.length) {
    console.log(payload);
    return (
      <div className="py-2 pl-4 pr-8 bg-white border rounded-sm">
        <p>#{payload[0].payload.fetchNum}</p>
        <div className="py-1"></div>
        {line1 in payload[0].payload && (
          <>
            <p className="text-[#8884d8]">
              Global: {payload[0].payload[line1]}
            </p>
            <p className="text-[#8884d8]">
              Cold start: {payload[0].payload.global_coldStart.toString()}
            </p>
          </>
        )}
        <Separator className="my-2" />
        {line2 in payload[0].payload && (
          <>
            <p className="text-[#82ca9d]">
              Regional: {payload[0].payload[line2]}
            </p>
            <p className="text-[#82ca9d]">
              Cold start: {payload[0].payload.regional_coldStart.toString()}
            </p>
          </>
        )}
      </div>
    );
  }

  return null;
}
