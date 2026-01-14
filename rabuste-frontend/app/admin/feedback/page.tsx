"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Star, AlertTriangle, CheckCircle, Clock, TrendingUp, Filter, Search, X } from "lucide-react";

type Feedback = {
  _id: string;
  type: 'order' | 'cafe' | 'website';
  userName: string;
  userEmail: string;
  rating: number;
  comments: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  sentimentScore: number;
  summary: string;
  categories: string[];
  isFlagged: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  orderId?: string;
};

type Stats = {
  total: number;
  byType: {
    order: number;
    cafe: number;
    website: number;
  };
  bySentiment: {
    positive: number;
    negative: number;
    neutral: number;
  };
  flagged: number;
  averageRating: number;
};

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [filters, setFilters] = useState({
    type: '',
    sentiment: '',
    priority: '',
    flagged: '',
    search: '',
  });

  const getAuthHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  useEffect(() => {
    fetchFeedbacks();
    fetchStats();
  }, [filters]);

  const fetchFeedbacks = async () => {
    try {
      const params = new URLSearchParams({
        limit: '100',
        ...(filters.type && { type: filters.type }),
        ...(filters.sentiment && { sentiment: filters.sentiment }),
        ...(filters.priority && { priority: filters.priority }),
        ...(filters.flagged === 'true' && { flagged: 'true' }),
      });

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/feedback?${params}`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      let feedbacksList = data.feedbacks || data || [];
      
      // Filter by search if provided
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        feedbacksList = feedbacksList.filter((f: Feedback) =>
          f.comments.toLowerCase().includes(searchLower) ||
          f.userName.toLowerCase().includes(searchLower) ||
          f.summary.toLowerCase().includes(searchLower)
        );
      }
      
      setFeedbacks(feedbacksList);
    } catch (err) {
      console.error("Failed to fetch feedback:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/feedback/stats`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const updateFeedback = async (id: string, updates: { isFlagged?: boolean; priority?: string }) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/feedback/${id}`, {
        method: 'PATCH',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!res.ok) throw new Error("Failed to update");

      fetchFeedbacks();
      fetchStats();
    } catch (err) {
      console.error("Failed to update feedback:", err);
      alert("Failed to update feedback");
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-700';
      case 'negative': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-black';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-black';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">Feedback Management</h1>
          <p className="text-black mt-1">AI-analyzed customer feedback with sentiment analysis</p>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-black mb-1">Total Feedback</p>
                <p className="text-2xl font-bold text-black">{stats.total}</p>
              </div>
              <div className="p-3 bg-black rounded-lg">
                <MessageSquare size={20} className="text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-black mb-1">Avg Rating</p>
                <p className="text-2xl font-bold text-green-600">{stats.averageRating.toFixed(1)}/5</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp size={20} className="text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-black mb-1">Flagged</p>
                <p className="text-2xl font-bold text-red-600">{stats.flagged}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-black mb-1">Positive</p>
                <p className="text-2xl font-bold text-green-600">{stats.bySentiment.positive}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Star size={20} className="text-green-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" />
            <input
              type="text"
              placeholder="Search feedback..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black placeholder:text-black"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
            />
          </div>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
          >
            <option value="">All Types</option>
            <option value="order">Order</option>
            <option value="cafe">Cafe</option>
            <option value="website">Website</option>
          </select>
          <select
            value={filters.sentiment}
            onChange={(e) => setFilters({ ...filters, sentiment: e.target.value })}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
          >
            <option value="">All Sentiments</option>
            <option value="positive">Positive</option>
            <option value="negative">Negative</option>
            <option value="neutral">Neutral</option>
          </select>
          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
          >
            <option value="">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <label className="flex items-center gap-2 cursor-pointer px-4 py-2 border border-gray-200 rounded-lg">
            <input
              type="checkbox"
              checked={filters.flagged === 'true'}
              onChange={(e) => setFilters({ ...filters, flagged: e.target.checked ? 'true' : '' })}
              className="w-5 h-5"
            />
            <span className="text-black">Flagged Only</span>
          </label>
        </div>
      </div>

      {/* Feedback List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-black">Loading feedback...</p>
          </div>
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <MessageSquare size={64} className="mx-auto mb-4 text-black" />
          <p className="text-black">No feedback found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedbacks.map((feedback) => (
            <div
              key={feedback._id}
              className={`bg-white rounded-lg border-2 p-6 hover:shadow-lg transition-all cursor-pointer ${
                feedback.isFlagged ? 'border-red-200' : 'border-gray-200'
              }`}
              onClick={() => setSelectedFeedback(feedback)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="font-semibold text-black mb-1">{feedback.userName}</p>
                  <p className="text-xs text-black mb-2">
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < feedback.rating ? 'text-amber-500 fill-amber-500' : 'text-black'}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  feedback.type === 'order' ? 'bg-blue-100 text-blue-700' :
                  feedback.type === 'cafe' ? 'bg-green-100 text-green-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {feedback.type}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${getSentimentColor(feedback.sentiment)}`}>
                  {feedback.sentiment}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(feedback.priority)}`}>
                  {feedback.priority}
                </span>
                {feedback.isFlagged && (
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-700">
                    ⚠️ FLAGGED
                  </span>
                )}
              </div>

              <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-bold text-black mb-1">AI SUMMARY:</p>
                <p className="text-xs text-black line-clamp-2">{feedback.summary}</p>
              </div>

              {feedback.comments && (
                <p className="text-xs text-black line-clamp-2 mb-3">{feedback.comments}</p>
              )}

              <div className="pt-3 border-t border-gray-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateFeedback(feedback._id, { isFlagged: !feedback.isFlagged });
                  }}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                    feedback.isFlagged
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  {feedback.isFlagged ? '✓ UNFLAG' : '⚠️ FLAG'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedFeedback && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedFeedback(null)}
        >
          <div 
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-black">Feedback Details</h2>
              <button
                onClick={() => setSelectedFeedback(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all text-black hover:bg-red-50 hover:text-red-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-black mb-1">User</p>
                <p className="text-lg font-semibold text-black">{selectedFeedback.userName}</p>
                <p className="text-sm text-black">{selectedFeedback.userEmail}</p>
              </div>
              <div>
                <p className="text-sm text-black mb-1">Rating</p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={i < selectedFeedback.rating ? 'text-amber-500 fill-amber-500' : 'text-black'}
                    />
                  ))}
                  <span className="ml-2 text-black font-semibold">{selectedFeedback.rating}/5</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-black mb-1">AI Summary</p>
                <p className="text-black bg-gray-50 p-3 rounded-lg">{selectedFeedback.summary}</p>
              </div>
              {selectedFeedback.comments && (
                <div>
                  <p className="text-sm text-black mb-1">Comments</p>
                  <p className="text-black bg-gray-50 p-3 rounded-lg">{selectedFeedback.comments}</p>
                </div>
              )}
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    updateFeedback(selectedFeedback._id, { isFlagged: !selectedFeedback.isFlagged });
                    setSelectedFeedback({ ...selectedFeedback, isFlagged: !selectedFeedback.isFlagged });
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                    selectedFeedback.isFlagged
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  {selectedFeedback.isFlagged ? 'Unflag' : 'Flag'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
