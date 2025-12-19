"use client";

import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
  Cell,
} from "recharts";

const coffeeComparisonData = [
  { metric: "Caffeine", Arabica: 1.2, Robusta: 2.2, unit: "%" },
  { metric: "Body / Strength", Arabica: 60, Robusta: 85, unit: "relative" },
  { metric: "Bitterness", Arabica: 45, Robusta: 80, unit: "relative" },
  { metric: "Acidity", Arabica: 75, Robusta: 40, unit: "relative" }
];

type FocusMode = "energy" | "taste" | "strength";

const MetricTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;
  
  // Get the metric data from the payload
  const data = payload[0]?.payload;
  if (!data) return null;
  
  const metric = data.metricLabel ?? "";
  const unit = data.unitLabel ?? "";
  const value = payload[0]?.value ?? "-";
  const beanType = data.name ?? "";
  
  return (
    <div
      style={{
        background: "rgba(8,8,8,0.98)",
        color: "#f6e6dc",
        padding: "14px 18px",
        borderRadius: 6,
        fontSize: 13,
        boxShadow: "0 8px 32px rgba(0,0,0,0.8)",
        border: "1px solid rgba(246,230,220,0.15)",
        minWidth: 140,
      }}
    >
      <div style={{ opacity: 0.7, fontSize: 11, marginBottom: 8, letterSpacing: "0.5px" }}>
        {metric} {unit ? `• ${unit}` : ""}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
        <div style={{ color: "#cbbba0", fontSize: 12 }}>{beanType}</div>
        <div style={{ fontWeight: 600, color: "#f6e6dc" }}>{value}</div>
      </div>
    </div>
  );
};

export default function CoffeeComparison() {
  const [focus, setFocus] = useState<FocusMode>("energy");

  const focusMap: Record<FocusMode, string[]> = {
    energy: ["Caffeine", "Body / Strength"],
    taste: ["Bitterness", "Acidity"],
    strength: ["Body / Strength", "Bitterness"],
  };

  const allowed = useMemo(() => focusMap[focus].map((s) => s.toLowerCase()), [focus]);

  const filtered = useMemo(
    () => coffeeComparisonData.filter((d: any) => allowed.includes(String(d.metric).toLowerCase())),
    [allowed]
  );

  const perMetricChartData = (entry: any) => {
    const rawArabica = Number(entry.Arabica ?? 0);
    const rawRobusta = Number(entry.Robusta ?? 0);
    return [
      { name: "Arabica", value: rawArabica, metricLabel: entry.metric, unitLabel: entry.unit ?? "" },
      { name: "Robusta", value: rawRobusta, metricLabel: entry.metric, unitLabel: entry.unit ?? "" },
    ];
  };

  const computeYMaxFor = (entry: any) => {
    const unit = String(entry.unit ?? "").toLowerCase();
    const maxVal = Math.max(Number(entry.Arabica ?? 0), Number(entry.Robusta ?? 0), 1);
    if (unit.includes("%")) {
      return Math.ceil(maxVal * 1.3 * 10) / 10;
    }
    if (unit.includes("relative")) {
      return 100;
    }
    return Math.ceil(maxVal * 1.2);
  };

  if (!filtered.length) {
    return (
      <section className="min-h-screen bg-[#0a0a0a] text-white px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-400">No metrics available for selected focus.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen text-white px-6 py-12" style={{ background: "transparent" }}>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .bar-elegant {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .bar-elegant:hover {
          filter: brightness(1.15) drop-shadow(0 4px 12px rgba(246, 230, 220, 0.3));
        }
      `}</style>

      <h2 className="text-3xl font-bold text-center mb-4 text-[#f6e6dc]" style={{ letterSpacing: "-0.02em" }}>
        Not all beans are built the same.
      </h2>
      <p className="text-center text-[#8a7a6a] mb-10 text-sm" style={{ letterSpacing: "0.03em" }}>
        Toggle a preference to focus the chart
      </p>

      <div className="max-w-5xl mx-auto">
        <div className="flex justify-center gap-3 mb-10">
          <button
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
              focus === "energy"
                ? "bg-[#f6e6dc]/12 ring-1 ring-[#cbbba0]/40 text-[#f6e6dc] shadow-lg"
                : "bg-transparent text-[#8a7a6a] hover:text-[#cbbba0] hover:bg-[#f6e6dc]/5"
            }`}
            style={{ letterSpacing: "0.02em" }}
            onClick={() => setFocus("energy")}
          >
            ⚡ Energy
          </button>
          <button
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
              focus === "taste"
                ? "bg-[#f6e6dc]/12 ring-1 ring-[#cbbba0]/40 text-[#f6e6dc] shadow-lg"
                : "bg-transparent text-[#8a7a6a] hover:text-[#cbbba0] hover:bg-[#f6e6dc]/5"
            }`}
            style={{ letterSpacing: "0.02em" }}
            onClick={() => setFocus("taste")}
          >
            🎨 Taste
          </button>
          <button
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
              focus === "strength"
                ? "bg-[#f6e6dc]/12 ring-1 ring-[#cbbba0]/40 text-[#f6e6dc] shadow-lg"
                : "bg-transparent text-[#8a7a6a] hover:text-[#cbbba0] hover:bg-[#f6e6dc]/5"
            }`}
            style={{ letterSpacing: "0.02em" }}
            onClick={() => setFocus("strength")}
          >
            💪 Strength
          </button>
        </div>

        <div
          key={focus}
          style={{
            opacity: 0,
            animation: "fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards"
          }}
        >
          <div style={{ display: "grid", gap: 20 }}>
            {filtered.map((entry: any, idx: number) => {
              const chartData = perMetricChartData(entry);
              const yMax = computeYMaxFor(entry);
              const singleHeight = filtered.length === 1 ? 420 : 220;
              return (
                <div
                  key={entry.metric + idx}
                  style={{
                    background: "transparent",
                    borderRadius: 10,
                    padding: "16px 12px 12px",
                    border: "1px solid rgba(246,230,220,0.06)",
                    opacity: 0,
                    animation: `fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + idx * 0.08}s forwards`
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12, paddingLeft: 8 }}>
                    <div style={{ fontSize: 15, color: "#f6e6dc", fontWeight: 600, letterSpacing: "-0.01em" }}>
                      {entry.metric}
                    </div>
                    <div style={{ color: "#8a7a6a", fontSize: 12, letterSpacing: "0.02em" }}>
                      {entry.unit ?? ""}
                    </div>
                  </div>

                  <ResponsiveContainer width="100%" height={singleHeight}>
                    <BarChart
                      data={chartData}
                      margin={{ top: 12, right: 16, left: 8, bottom: 8 }}
                      barCategoryGap="35%"
                    >
                      <defs>
                        <linearGradient id={`arabicaGrad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f6e6dc" stopOpacity={0.95} />
                          <stop offset="100%" stopColor="#cbbba0" stopOpacity={0.85} />
                        </linearGradient>
                        <linearGradient id={`robustaGrad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#81523f" stopOpacity={0.9} />
                          <stop offset="100%" stopColor="#4a2825" stopOpacity={0.75} />
                        </linearGradient>
                        <filter id={`shadow-${idx}`}>
                          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.4"/>
                        </filter>
                      </defs>
                      <CartesianGrid 
                        stroke="rgba(246,230,220,0.06)" 
                        strokeDasharray="4 8" 
                        vertical={false} 
                      />
                      <XAxis 
                        dataKey="name" 
                        stroke="#8a7a6a" 
                        tickLine={false} 
                        axisLine={{ stroke: "rgba(246,230,220,0.1)" }} 
                        tick={{ fill: "#cbbba0", fontSize: 13, fontWeight: 500 }} 
                      />
                      <YAxis 
                        domain={[0, yMax]} 
                        tick={{ fill: "#8a7a6a", fontSize: 11 }} 
                        axisLine={false} 
                        tickLine={false}
                        stroke="#8a7a6a"
                      />
                      <Tooltip 
                        content={<MetricTooltip />} 
                        cursor={{ fill: "rgba(246,230,220,0.03)" }}
                        wrapperStyle={{ zIndex: 1000 }}
                      />
                      <Bar 
                        dataKey="value" 
                        radius={[6, 6, 0, 0]} 
                        animationDuration={900}
                        animationEasing="ease-out"
                        className="bar-elegant"
                        filter={`url(#shadow-${idx})`}
                      >
                        <LabelList 
                          dataKey="value" 
                          position="top" 
                          formatter={(v: any) => v} 
                          style={{ 
                            fill: "#f6e6dc", 
                            fontSize: 13, 
                            fontWeight: 600,
                            textShadow: "0 1px 4px rgba(0,0,0,0.6)"
                          }} 
                        />
                        {chartData.map((d: any, i: number) => (
                          <Cell 
                            key={d.name} 
                            fill={d.name === "Arabica" ? `url(#arabicaGrad-${idx})` : `url(#robustaGrad-${idx})`} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}