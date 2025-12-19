"use client";

import React, { useMemo, useState, useEffect } from "react";
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
  { metric: "Body", Arabica: 60, Robusta: 85, unit: "strength" },
  { metric: "Bitterness", Arabica: 45, Robusta: 80, unit: "intensity" },
  { metric: "Acidity", Arabica: 75, Robusta: 40, unit: "level" }
];

type FocusMode = "energy" | "taste" | "strength";

const MetricTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;
  
  const data = payload[0]?.payload;
  if (!data) return null;
  
  const metric = data.metricLabel ?? "";
  const unit = data.unitLabel ?? "";
  const value = payload[0]?.value ?? "-";
  const beanType = data.name ?? "";
  
  return (
    <div style={{
      background: "rgba(8,8,8,0.98)",
      color: "#FAD0C4",
      padding: "12px 16px",
      borderRadius: 8,
      fontSize: 12,
      boxShadow: "0 8px 32px rgba(0,0,0,0.8)",
      border: "1px solid rgba(196, 165, 116, 0.2)",
      backdropFilter: "blur(10px)"
    }}>
      <div style={{ opacity: 0.7, fontSize: 10, marginBottom: 6, letterSpacing: "0.5px", textTransform: "uppercase" }}>
        {metric} {unit ? `• ${unit}` : ""}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
        <div style={{ color: "#E6C9A8", fontSize: 11 }}>{beanType}</div>
        <div style={{ fontWeight: 700, color: "#c4a574" }}>{value}</div>
      </div>
    </div>
  );
};

export default function CoffeeComparison() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const [focus, setFocus] = useState<FocusMode>("energy");

  const focusMap: Record<FocusMode, string[]> = {
    energy: ["Caffeine", "Body"],
    taste: ["Bitterness", "Acidity"],
    strength: ["Body", "Bitterness"],
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
    return 100;
  };

  return (
    <section style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "30px 20px",
      position: "relative",
      overflow: "hidden"
    }}>
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
        .animate-fade-in-up {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .bar-elegant {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .bar-elegant:hover {
          filter: brightness(1.15) drop-shadow(0 4px 12px rgba(196, 165, 116, 0.3));
        }
      `}</style>

      {/* Decorative glow */}
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '10%',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(196, 165, 116, 0.06) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        pointerEvents: 'none'
      }} />

      <div style={{
        maxWidth: "1200px",
        width: "100%",
        position: "relative",
        zIndex: 1
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h2 style={{
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 800,
            color: "#FAD0C4",
            margin: "0 0 8px 0",
            letterSpacing: "-0.02em",
            background: 'linear-gradient(135deg, #FAD0C4 0%, #c4a574 50%, #E6C9A8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Not All Beans Are Built the Same
          </h2>
          <p style={{
            color: "#E6C9A8",
            fontSize: "0.9rem",
            margin: 0,
            opacity: 0.9
          }}>
            Compare Arabica vs Robusta across key metrics
          </p>
        </div>

        {/* Focus Buttons */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          marginBottom: "30px",
          flexWrap: "wrap"
        }}>
          {[
            { id: "energy" as FocusMode, label: "Energy", icon: "⚡" },
            { id: "taste" as FocusMode, label: "Taste", icon: "🎨" },
            { id: "strength" as FocusMode, label: "Strength", icon: "💪" }
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFocus(btn.id)}
              style={{
                padding: "10px 20px",
                borderRadius: "10px",
                fontSize: "0.9rem",
                fontWeight: 600,
                border: `1px solid ${focus === btn.id ? "#c4a574" : "rgba(42, 42, 42, 0.8)"}`,
                background: focus === btn.id 
                  ? "linear-gradient(135deg, rgba(74, 40, 37, 0.4) 0%, rgba(26, 26, 26, 0.6) 100%)"
                  : "rgba(26, 26, 26, 0.5)",
                color: focus === btn.id ? "#FAD0C4" : "#E6C9A8",
                cursor: "pointer",
                transition: "all 0.3s ease",
                backdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                letterSpacing: "0.02em",
                boxShadow: focus === btn.id ? "0 4px 20px rgba(196, 165, 116, 0.2)" : "none"
              }}
              onMouseEnter={(e) => {
                if (focus !== btn.id) {
                  e.currentTarget.style.borderColor = "#c4a574";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                if (focus !== btn.id) {
                  e.currentTarget.style.borderColor = "rgba(42, 42, 42, 0.8)";
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              <span style={{ fontSize: "1.1rem" }}>{btn.icon}</span>
              {btn.label}
            </button>
          ))}
        </div>

        {/* Charts */}
        <div key={focus} style={{
          opacity: 0,
          animation: "fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards"
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : (filtered.length === 1 ? "1fr" : "repeat(auto-fit, minmax(450px, 1fr))"),
            gap: isMobile ? "12px" : "20px"
          }}>
            {filtered.map((entry: any, idx: number) => {
              const chartData = perMetricChartData(entry);
              const yMax = computeYMaxFor(entry);
              // on mobile show taller stacked charts so each is readable without awkward clipping
              const singleHeight = isMobile ? 360 : (filtered.length === 1 ? 380 : 280);
              
              return (
                <div
                  key={entry.metric + idx}
                  style={{
                    background: isMobile ? "rgba(26,26,26,0.35)" : "linear-gradient(135deg, rgba(26, 26, 26, 0.6) 0%, rgba(42, 42, 42, 0.4) 100%)",
                    borderRadius: 16,
                    padding: "20px",
                    border: "1px solid rgba(196, 165, 116, 0.15)",
                    backdropFilter: "blur(20px)",
                    opacity: 0,
                    animation: `fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + idx * 0.08}s forwards`,
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)"
                  }}
                >
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                    paddingBottom: 12,
                    borderBottom: "1px solid rgba(196, 165, 116, 0.1)"
                  }}>
                    <div style={{
                      fontSize: 16,
                      color: "#FAD0C4",
                      fontWeight: 700,
                      letterSpacing: "-0.01em"
                    }}>
                      {entry.metric}
                    </div>
                    <div style={{
                      color: "#c4a574",
                      fontSize: 11,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      background: "rgba(196, 165, 116, 0.1)",
                      padding: "4px 10px",
                      borderRadius: 6
                    }}>
                      {entry.unit ?? ""}
                    </div>
                  </div>

                  <ResponsiveContainer width="100%" height={singleHeight}>
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
                      barCategoryGap={isMobile ? "12%" : "30%"}
                    >
                      <defs>
                        <linearGradient id={`arabicaGrad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#FAD0C4" stopOpacity={0.95} />
                          <stop offset="100%" stopColor="#E6C9A8" stopOpacity={0.85} />
                        </linearGradient>
                        <linearGradient id={`robustaGrad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#c4a574" stopOpacity={0.9} />
                          <stop offset="100%" stopColor="#81523f" stopOpacity={0.75} />
                        </linearGradient>
                        <filter id={`shadow-${idx}`}>
                          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#000" floodOpacity="0.5"/>
                        </filter>
                      </defs>
                      <CartesianGrid 
                        stroke="rgba(196, 165, 116, 0.08)" 
                        strokeDasharray="4 8" 
                        vertical={false} 
                      />
                      <XAxis 
                        dataKey="name" 
                        stroke="rgba(196, 165, 116, 0.3)" 
                        tickLine={false} 
                        axisLine={{ stroke: "rgba(196, 165, 116, 0.15)" }} 
                        tick={{ fill: "#E6C9A8", fontSize: 13, fontWeight: 600 }} 
                      />
                      <YAxis 
                        domain={[0, yMax]} 
                        tick={{ fill: "#c4a574", fontSize: 11 }} 
                        axisLine={false} 
                        tickLine={false}
                        stroke="rgba(196, 165, 116, 0.3)"
                      />
                      <Tooltip 
                        content={<MetricTooltip />} 
                        cursor={{ fill: "rgba(196, 165, 116, 0.05)" }}
                        wrapperStyle={{ zIndex: 1000 }}
                      />
                      <Bar 
                        dataKey="value" 
                        radius={[8, 8, 0, 0]} 
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
                            fill: "#FAD0C4", 
                            fontSize: 14, 
                            fontWeight: 700,
                            textShadow: "0 2px 6px rgba(0,0,0,0.7)"
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