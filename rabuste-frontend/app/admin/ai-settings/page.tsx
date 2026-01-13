"use client";

import { useEffect, useState } from "react";
import { Brain, Settings, TrendingDown, AlertTriangle, Package, Clock, CheckCircle, X } from "lucide-react";

type AIConfig = {
  lowStockLimit: number;
  inactiveDays: number;
  enableDiscountAI: boolean;
  discountItemId: string | null;
  discountPercent: number;
};

const DEFAULT_CONFIG: AIConfig = {
  lowStockLimit: 5,
  inactiveDays: 7,
  enableDiscountAI: false,
  discountItemId: null,
  discountPercent: 10,
};

type MenuItem = {
  _id: string;
  name: string;
};

type DiscountSuggestion = {
  _id: string;
  name: string;
  soldLast7Days: number;
};

export default function AISettingsPage() {
  const [config, setConfig] = useState<AIConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [suggestions, setSuggestions] = useState<DiscountSuggestion[]>([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const getAuthHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers: HeadersInit = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch("/api/admin/ai-config", {
          headers: {
            ...getAuthHeaders(),
          },
        });
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
      } catch (err) {
        console.error("Failed to fetch AI config:", err);
        setError("Failed to load AI settings");
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
        const res = await fetch("/api/admin/menu", {
          headers: {
            ...getAuthHeaders(),
          },
        });
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
      } catch (err) {
        console.error("Failed to fetch menu items:", err);
      }
    };

    fetchMenuItems();
  }, [config.enableDiscountAI]);

  useEffect(() => {
    if (!config.enableDiscountAI) return;

    const fetchSuggestions = async () => {
      try {
        const res = await fetch("/api/admin/discount-suggestions", {
          headers: {
            ...getAuthHeaders(),
          },
        });
        if (!res.ok) return;
        const data = await res.json();
        const list = Array.isArray(data?.suggestions) ? data.suggestions : [];
        const parsed: DiscountSuggestion[] = list
          .filter((s: any) => s && typeof s._id === "string")
          .map((s: any) => ({
            _id: s._id,
            name: String(s.name || ""),
            soldLast7Days: Number(s.soldLast7Days || 0),
          }));

        setSuggestions(parsed);

        if (!config.discountItemId && parsed[0]?._id) {
          setConfig((prev) => ({ ...prev, discountItemId: parsed[0]._id }));
        }
      } catch (err) {
        console.error("Failed to fetch suggestions:", err);
      }
    };

    fetchSuggestions();
  }, [config.enableDiscountAI]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);
    
    try {
      const updateData = {
        lowStockLimit: config.lowStockLimit,
        inactiveDays: config.inactiveDays,
        enableDiscountAI: config.enableDiscountAI,
        discountItemId: config.discountItemId,
        discountPercent: config.discountPercent,
      };
      
      const res = await fetch("/api/admin/ai-config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(updateData),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Failed to save (${res.status})`);
      }
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save AI settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading AI Settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">AI Settings</h1>
          <p className="text-gray-600 mt-1">Configure AI-powered business intelligence</p>
        </div>
      </div>

      {/* Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 flex items-center gap-3 animate-fadeIn">
          <CheckCircle size={20} />
          AI settings updated successfully!
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex items-center gap-3 animate-fadeIn">
          <AlertTriangle size={20} />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-3 text-black">
            <div className="p-2 bg-black rounded-lg">
              <Brain size={18} className="text-white" />
            </div>
            Inventory Intelligence
          </h2>

          <div className="space-y-6">
            {/* Low Stock Threshold */}
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Low Stock Threshold
              </label>
              <input
                type="number"
                min="0"
                value={config.lowStockLimit || 0}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') {
                    setConfig({ ...config, lowStockLimit: 0 });
                  } else if (/^\d+$/.test(value)) {
                    setConfig({ ...config, lowStockLimit: parseInt(value, 10) });
                  }
                }}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                placeholder="Enter stock limit..."
              />
              <p className="text-xs mt-2 text-gray-500">
                Alert when stock falls below this number
              </p>
            </div>

            {/* Inactive Days */}
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Inactive Item Days
              </label>
              <input
                type="number"
                min="0"
                value={config.inactiveDays || 0}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') {
                    setConfig({ ...config, inactiveDays: 0 });
                  } else if (/^\d+$/.test(value)) {
                    setConfig({ ...config, inactiveDays: parseInt(value, 10) });
                  }
                }}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                placeholder="Enter number of days..."
              />
              <p className="text-xs mt-2 text-gray-500">
                Flag items not sold for this many days
              </p>
            </div>
          </div>
        </div>

        {/* Discount AI Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-3 text-black">
            <div className="p-2 bg-black rounded-lg">
              <TrendingDown size={18} className="text-white" />
            </div>
            Discount Intelligence
          </h2>

          <div className="space-y-6">
            {/* Enable Discount AI */}
            <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-200">
              <input
                type="checkbox"
                id="enableDiscountAI"
                checked={config.enableDiscountAI}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    enableDiscountAI: e.target.checked,
                  })
                }
                className="w-5 h-5 rounded border-2 border-gray-300 text-black focus:ring-2 focus:ring-black"
              />
              <label htmlFor="enableDiscountAI" className="text-sm font-medium cursor-pointer text-black">
                Enable Automatic Discount Suggestions
              </label>
            </div>

            {config.enableDiscountAI && (
              <div className="space-y-4">
                {/* Suggestions */}
                {suggestions.length > 0 && suggestions[0]?._id && (
                  <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <p className="text-sm font-semibold mb-2 text-black">
                      📊 AI Discount Suggestions (Items with low recent sales):
                    </p>
                    <div className="space-y-2">
                      {suggestions.slice(0, 3).map((suggestion, index) => (
                        <div key={suggestion._id} className="flex justify-between items-center text-sm">
                          <span className="font-medium text-black">
                            {index + 1}. {suggestion.name}
                          </span>
                          <span className="text-gray-600">
                            {suggestion.soldLast7Days} sold (7 days)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Item Selection */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
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
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                  >
                    <option value="">Select an item…</option>
                    {menuItems.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  
                  {config.discountItemId && (
                    <div className="mt-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                      <p className="text-sm font-medium text-black">
                        🎯 Currently offering {config.discountPercent}% discount on:
                      </p>
                      <p className="text-sm font-bold text-black mt-1">
                        {menuItems.find(item => item._id === config.discountItemId)?.name || 'Unknown Item'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Discount Percent */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Discount Percent
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={config.discountPercent || 0}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '') {
                          setConfig({ ...config, discountPercent: 0 });
                        } else if (/^\d+$/.test(value)) {
                          const num = parseInt(value, 10);
                          setConfig({
                            ...config,
                            discountPercent: Math.min(100, Math.max(0, num)),
                          });
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                      placeholder="Enter percentage..."
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Settings size={20} />
              Save AI Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
}
