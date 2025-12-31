"use client";

import { useEffect, useState } from "react";

export default function AISettingsPage() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      const res = await fetch("/api/admin/ai-config");
      const data = await res.json();
      setConfig(data);
      setLoading(false);
    };
    fetchConfig();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/admin/ai-config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    setSaving(false);
    alert("AI settings updated");
  };

  if (loading) return <p className="p-6">Loading AI settings…</p>;

  return (
    <div className="bg-[#FAF3E0] p-8 rounded-2xl shadow-xl max-w-xl space-y-6">

      <h1 className="text-2xl font-bold text-[#2e211a]">
        AI Configuration
      </h1>

      {/* Low stock */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Low Stock Threshold
        </label>
        <input
          type="number"
          value={config.lowStockLimit}
          onChange={(e) =>
            setConfig({ ...config, lowStockLimit: +e.target.value })
          }
          className="w-full p-2 rounded-md border"
        />
      </div>

      {/* Inactive days */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Inactive Item Days
        </label>
        <input
          type="number"
          value={config.inactiveDays}
          onChange={(e) =>
            setConfig({ ...config, inactiveDays: +e.target.value })
          }
          className="w-full p-2 rounded-md border"
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
        <span className="text-sm">Enable Discount Suggestions</span>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-[#3a2618] text-[#fffbd6] px-4 py-2 rounded-md"
      >
        {saving ? "Saving…" : "Save Settings"}
      </button>
    </div>
  );
}
