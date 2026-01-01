"use client";

import { useEffect, useState } from "react";

type AIConfig = {
  lowStockLimit: number;
  inactiveDays: number;
  enableDiscountAI: boolean;
  discountItemId: string | null;
  discountPercent: number;
};

const DEFAULT_CONFIG: AIConfig = {
  lowStockLimit: 0,
  inactiveDays: 0,
  enableDiscountAI: false,
  discountItemId: null,
  discountPercent: 0,
};

type MenuItem = {
  _id: string;
  name: string;
};

export default function AISettingsPage() {
  const [config, setConfig] = useState<AIConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch("/api/admin/ai-config");
        if (!res.ok) throw new Error("Failed to fetch AI config");
        const data = await res.json();

        setConfig((prev) => ({
          ...prev,
          ...data,
          lowStockLimit: Number.isFinite(Number(data?.lowStockLimit))
            ? Number(data.lowStockLimit)
            : prev.lowStockLimit,
          inactiveDays: Number.isFinite(Number(data?.inactiveDays))
            ? Number(data.inactiveDays)
            : prev.inactiveDays,
          enableDiscountAI:
            typeof data?.enableDiscountAI === "boolean"
              ? data.enableDiscountAI
              : prev.enableDiscountAI,
        }));
      } catch {
        // Keep defaults if API fails; page still remains usable.
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    if (!config.enableDiscountAI) return;

    const fetchMenuItems = async () => {
      try {
        const res = await fetch("/api/admin/menu");
        if (!res.ok) return;
        const data = await res.json();
        const items = Array.isArray(data) ? data : data?.items;
        if (Array.isArray(items)) {
          setMenuItems(
            items
              .filter((i) => i && typeof i._id === "string")
              .map((i) => ({ _id: i._id, name: String(i.name || "") }))
          );
        }
      } catch {
        // ignore
      }
    };

    fetchMenuItems();
  }, [config.enableDiscountAI]);

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/admin/ai-config", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    setSaving(false);
    alert("AI settings updated");
  };

  if (loading) return <p className="p-6 text-[#F5F1E8]">Loading AI settings…</p>;

  return (
    <div className="p-8">
      <div className="bg-[#FAF3E0] text-[#2e211a] p-8 rounded-2xl shadow-xl max-w-xl space-y-6">

      <h1 className="text-2xl font-bold text-[#2e211a]">
        AI Configuration
      </h1>

      {/* Low stock */}
      <div>
        <label className="block text-sm font-medium mb-1 text-[#6b4a2f]">
          Low Stock Threshold
        </label>
        <input
          type="number"
          value={config.lowStockLimit}
          onChange={(e) =>
            setConfig({ ...config, lowStockLimit: +e.target.value })
          }
          className="w-full p-2 rounded-md border bg-[#FFFDF2] text-[#2e211a] border-[#E8C39E] focus:outline-none focus:ring-2 focus:ring-[#c68642]"
        />
      </div>

      {/* Inactive days */}
      <div>
        <label className="block text-sm font-medium mb-1 text-[#6b4a2f]">
          Inactive Item Days
        </label>
        <input
          type="number"
          value={config.inactiveDays}
          onChange={(e) =>
            setConfig({ ...config, inactiveDays: +e.target.value })
          }
          className="w-full p-2 rounded-md border bg-[#FFFDF2] text-[#2e211a] border-[#E8C39E] focus:outline-none focus:ring-2 focus:ring-[#c68642]"
        />
      </div>

      {/* Discount toggle */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={config.enableDiscountAI}
          onChange={(e) =>
            setConfig({
              ...config,
              enableDiscountAI: e.target.checked,
            })
          }
        />
        <span className="text-sm text-[#3a2618]">Enable Discount Suggestions</span>
      </div>

      {config.enableDiscountAI && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-[#6b4a2f]">
              Select Item
            </label>
            <select
              value={config.discountItemId ?? ""}
              onChange={(e) =>
                setConfig({
                  ...config,
                  discountItemId: e.target.value || null,
                })
              }
              className="w-full p-2 rounded-md border bg-[#FFFDF2] text-[#2e211a] border-[#E8C39E] focus:outline-none focus:ring-2 focus:ring-[#c68642]"
            >
              <option value="">Select an item…</option>
              {menuItems.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-[#6b4a2f]">
              Discount Percent
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={config.discountPercent}
              onChange={(e) =>
                setConfig({
                  ...config,
                  discountPercent: Number(e.target.value),
                })
              }
              className="w-full p-2 rounded-md border bg-[#FFFDF2] text-[#2e211a] border-[#E8C39E] focus:outline-none focus:ring-2 focus:ring-[#c68642]"
            />
          </div>
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-[#3a2618] text-[#fffbd6] px-4 py-2 rounded-md"
      >
        {saving ? "Saving…" : "Save Settings"}
      </button>
      </div>
    </div>
  );
}
