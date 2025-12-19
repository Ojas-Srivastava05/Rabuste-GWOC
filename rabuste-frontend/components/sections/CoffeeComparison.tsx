"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
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

import { coffeeComparisonData as coffeeData } from "@/data/coffeecomparison";

type FocusMode = "energy" | "taste" | "strength";

/* simple per-metric tooltip (works with per-metric two-bar layout) */
const MetricTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;
  const arabica = payload.find((p: any) => p.name === "Arabica")?.value ?? "-";
  const robusta = payload.find((p: any) => p.name === "Robusta")?.value ?? "-";
  const metric = payload[0]?.payload?.metricLabel ?? "";
  const unit = payload[0]?.payload?.unitLabel ?? "";
  return (
    <div
      style={{
        background: "rgba(8,8,8,0.95)",
        color: "#fff",
        padding: 10,
        borderRadius: 8,
        fontSize: 13,
        boxShadow: "0 6px 24px rgba(0,0,0,0.6)",
        minWidth: 160,
      }}
    >
      <div style={{ opacity: 0.85, fontSize: 12, marginBottom: 6 }}>
        {metric} {unit ? `• ${unit}` : ""}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div style={{ color: "#ddd" }}>Arabica</div>
        <div style={{ fontWeight: 700 }}>{arabica}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 6 }}>
        <div style={{ color: "#ddd" }}>Robusta</div>
        <div style={{ fontWeight: 700 }}>{robusta}</div>
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
    () => coffeeData.filter((d: any) => allowed.includes(String(d.metric).toLowerCase())),
    [allowed]
  );

  // convert a single metric entry to per-bar data for that metric
  const perMetricChartData = (entry: any) => {
    // data for chart: two bars (Arabica, Robusta)
    const rawArabica = Number(entry.Arabica ?? 0);
    const rawRobusta = Number(entry.Robusta ?? 0);
    // attach labels so tooltip can read them
    return [
      { name: "Arabica", value: rawArabica, metricLabel: entry.metric, unitLabel: entry.unit ?? "" },
      { name: "Robusta", value: rawRobusta, metricLabel: entry.metric, unitLabel: entry.unit ?? "" },
    ];
  };

  // compute per-metric yMax (so caffeine doesn't look tiny)
  const computeYMaxFor = (entry: any) => {
    const unit = String(entry.unit ?? "").toLowerCase();
    const maxVal = Math.max(Number(entry.Arabica ?? 0), Number(entry.Robusta ?? 0), 1);
    if (unit.includes("%")) {
      // fine-grain percent (like 1.4%) — keep small upper bound close to value, add padding
      return Math.ceil(maxVal * 1.25 * 10) / 10; // e.g. 1.4 -> ~1.8
    }
    if (unit.includes("relative")) {
      return 100;
    }
    // fallback: pad by 20%
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
    <section className="min-h-screen bg-[#0a0a0a] text-white px-6 py-12">
      <h2 className="text-3xl font-bold text-center mb-4">Not all beans are built the same.</h2>
      <p className="text-center text-gray-400 mb-8">Toggle a preference to focus the chart</p>

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded-md text-sm ${focus === "energy" ? "bg-[#f6e6dc]/10 ring-1 ring-[#cbbba0]" : "bg-transparent"}`}
            onClick={() => setFocus("energy")}
          >
            ⚡ Energy
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm ${focus === "taste" ? "bg-[#f6e6dc]/10 ring-1 ring-[#cbbba0]" : "bg-transparent"}`}
            onClick={() => setFocus("taste")}
          >
            🎨 Taste
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm ${focus === "strength" ? "bg-[#f6e6dc]/10 ring-1 ring-[#cbbba0]" : "bg-transparent"}`}
            onClick={() => setFocus("strength")}
          >
            💪 Strength
          </button>
        </div>

        {/* animate container on toggle */}
        <motion.div
          key={focus}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.36 }}
        >
          <div
            style={{
              padding: 18,
              borderRadius: 16,
              background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
              boxShadow: "0 10px 40px rgba(2,6,23,0.6), inset 0 1px 0 rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.03)",
            }}
          >
            {/* render one mini-chart per selected metric so each has its own scale */}
            <div style={{ display: "grid", gap: 18 }}>
              {filtered.map((entry: any, idx: number) => {
                const chartData = perMetricChartData(entry);
                const yMax = computeYMaxFor(entry);
                const singleHeight = filtered.length === 1 ? 380 : 180;
                return (
                  <motion.div
                    key={entry.metric + idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.36, delay: idx * 0.06 }}
                    style={{ background: "transparent", borderRadius: 12, padding: 8 }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                      <div style={{ fontSize: 14, color: "#e6e6e6", fontWeight: 700 }}>{entry.metric}</div>
                      <div style={{ color: "#bfbfbf", fontSize: 13 }}>{entry.unit ?? ""}</div>
                    </div>

                    <ResponsiveContainer width="100%" height={singleHeight}>
                      <BarChart
                        data={chartData}
                        margin={{ top: 8, right: 12, left: 6, bottom: 6 }}
                        barCategoryGap="30%"
                      >
                        <CartesianGrid stroke="#111" strokeDasharray="3 6" vertical={false} opacity={0.5} />
                        <XAxis dataKey="name" stroke="#bfbfbf" tickLine={false} axisLine={false} tick={{ fill: "#e6e6e6", fontSize: 13 }} />
                        <YAxis domain={[0, yMax]} tick={{ fill: "#e6e6e6", fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip content={<MetricTooltip />} />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]} animationDuration={700} animationEasing="cubicOut">
                          <LabelList dataKey="value" position="top" formatter={(v: any) => v} style={{ fill: "#f6efe9", fontSize: 12, fontWeight: 700 }} />
                          <Cell key="a" fill="url(#gradA)" />
                        </Bar>
                        {/* Recharts requires defs inside chart; use inline defs for good visuals */}
                        <defs>
                          <linearGradient id="gradA" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#f6e6dc" stopOpacity={1} />
                            <stop offset="100%" stopColor="#cbbba0" stopOpacity={1} />
                          </linearGradient>
                          <linearGradient id="gradB" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#81523f" stopOpacity={1} />
                            <stop offset="100%" stopColor="#4a2825" stopOpacity={1} />
                          </linearGradient>
                        </defs>
                        {/* We want different colors per bar name; override with Cells */}
                        {chartData.map((d: any, i: number) => (
                          <Cell key={d.name} fill={d.name === "Arabica" ? "url(#gradA)" : "url(#gradB)"} />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
