"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Star, AlertTriangle, CheckCircle, Clock, TrendingUp, Filter, Search } from "lucide-react";
import { useRouter } from "next/navigation";

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
  foodQuality?: number;
  deliveryTime?: number;
  packaging?: number;
  ambience?: number;
  service?: number;
  cleanliness?: number;
  music?: number;
  easeOfUse?: number;
  design?: number;
  speed?: number;
  features?: number;
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
  const router = useRouter();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    sentiment: '',
    priority: '',
    flagged: '',
    search: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  const getAuthHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  useEffect(() => {
    fetchFeedbacks();
    fetchStats();
  }, [currentPage, filters]);

  const fetchFeedbacks = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
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
      setFeedbacks(data.feedbacks || []);
      setPagination(data.pagination || { total: 0, pages: 1 });
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
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '#10B981';
      case 'negative': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#DC2626';
      case 'high': return '#F59E0B';
      case 'medium': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  const filteredFeedbacks = feedbacks.filter(feedback => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        feedback.comments.toLowerCase().includes(searchLower) ||
        feedback.userName.toLowerCase().includes(searchLower) ||
        feedback.summary.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p style={{ color: '#B87333' }}>Loading feedback...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: '#F5F1E8' }}>
            CUSTOMER FEEDBACK
          </h1>
          <p style={{ color: '#8B6F47' }}>AI-analyzed feedback with sentiment analysis</p>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-xl border-2" style={{ background: 'rgba(26, 17, 16, 0.6)', borderColor: 'rgba(184, 115, 51, 0.3)' }}>
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare size={24} style={{ color: '#B87333' }} />
              <span className="text-sm" style={{ color: '#8B6F47' }}>Total Feedback</span>
            </div>
            <p className="text-3xl font-bold" style={{ color: '#D4A574', fontFamily: 'var(--font-heading)' }}>
              {stats.total}
            </p>
          </div>

          <div className="p-6 rounded-xl border-2" style={{ background: 'rgba(26, 17, 16, 0.6)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp size={24} style={{ color: '#10B981' }} />
              <span className="text-sm" style={{ color: '#8B6F47' }}>Avg Rating</span>
            </div>
            <p className="text-3xl font-bold" style={{ color: '#10B981', fontFamily: 'var(--font-heading)' }}>
              {stats.averageRating.toFixed(1)}/5
            </p>
          </div>

          <div className="p-6 rounded-xl border-2" style={{ background: 'rgba(26, 17, 16, 0.6)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle size={24} style={{ color: '#EF4444' }} />
              <span className="text-sm" style={{ color: '#8B6F47' }}>Flagged</span>
            </div>
            <p className="text-3xl font-bold" style={{ color: '#EF4444', fontFamily: 'var(--font-heading)' }}>
              {stats.flagged}
            </p>
          </div>

          <div className="p-6 rounded-xl border-2" style={{ background: 'rgba(26, 17, 16, 0.6)', borderColor: 'rgba(184, 115, 51, 0.3)' }}>
            <div className="flex items-center gap-3 mb-2">
              <Star size={24} style={{ color: '#B87333' }} />
              <span className="text-sm" style={{ color: '#8B6F47' }}>Positive</span>
            </div>
            <p className="text-3xl font-bold" style={{ color: '#10B981', fontFamily: 'var(--font-heading)' }}>
              {stats.bySentiment.positive}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="p-6 rounded-xl border-2" style={{ background: 'rgba(26, 17, 16, 0.6)', borderColor: 'rgba(184, 115, 51, 0.3)' }}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#8B6F47' }} />
            <input
              type="text"
              placeholder="Search feedback..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 rounded-lg"
              style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(184, 115, 51, 0.3)', color: '#F5F1E8' }}
            />
          </div>

          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="px-4 py-2 rounded-lg"
            style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(184, 115, 51, 0.3)', color: '#F5F1E8' }}
          >
            <option value="">All Types</option>
            <option value="order">Order</option>
            <option value="cafe">Cafe</option>
            <option value="website">Website</option>
          </select>

          <select
            value={filters.sentiment}
            onChange={(e) => setFilters({ ...filters, sentiment: e.target.value })}
            className="px-4 py-2 rounded-lg"
            style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(184, 115, 51, 0.3)', color: '#F5F1E8' }}
          >
            <option value="">All Sentiments</option>
            <option value="positive">Positive</option>
            <option value="negative">Negative</option>
            <option value="neutral">Neutral</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            className="px-4 py-2 rounded-lg"
            style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(184, 115, 51, 0.3)', color: '#F5F1E8' }}
          >
            <option value="">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.flagged === 'true'}
              onChange={(e) => setFilters({ ...filters, flagged: e.target.checked ? 'true' : '' })}
              className="w-5 h-5"
              style={{ accentColor: '#B87333' }}
            />
            <span style={{ color: '#F5F1E8' }}>Flagged Only</span>
          </label>
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredFeedbacks.length === 0 ? (
          <div className="p-12 text-center rounded-xl border-2" style={{ background: 'rgba(26, 17, 16, 0.6)', borderColor: 'rgba(184, 115, 51, 0.3)' }}>
            <p style={{ color: '#8B6F47' }}>No feedback found</p>
          </div>
        ) : (
          filteredFeedbacks.map((feedback) => (
            <div
              key={feedback._id}
              className="p-6 rounded-xl border-2 transition-all hover:border-opacity-60"
              style={{
                background: feedback.isFlagged
                  ? 'rgba(239, 68, 68, 0.1)'
                  : 'rgba(26, 17, 16, 0.6)',
                borderColor: feedback.isFlagged
                  ? 'rgba(239, 68, 68, 0.5)'
                  : 'rgba(184, 115, 51, 0.3)',
              }}
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className="px-3 py-1 rounded-lg text-sm font-bold uppercase"
                          style={{
                            background: `rgba(${feedback.type === 'order' ? '184, 115, 51' : feedback.type === 'cafe' ? '16, 185, 129' : '59, 130, 246'}, 0.2)`,
                            color: feedback.type === 'order' ? '#B87333' : feedback.type === 'cafe' ? '#10B981' : '#3B82F6',
                            fontFamily: 'var(--font-heading)',
                            letterSpacing: '0.05em',
                          }}
                        >
                          {feedback.type}
                        </span>
                        <span
                          className="px-3 py-1 rounded-lg text-sm font-bold"
                          style={{
                            background: `${getSentimentColor(feedback.sentiment)}20`,
                            color: getSentimentColor(feedback.sentiment),
                          }}
                        >
                          {feedback.sentiment}
                        </span>
                        <span
                          className="px-3 py-1 rounded-lg text-sm font-bold"
                          style={{
                            background: `${getPriorityColor(feedback.priority)}20`,
                            color: getPriorityColor(feedback.priority),
                          }}
                        >
                          {feedback.priority}
                        </span>
                        {feedback.isFlagged && (
                          <span className="px-3 py-1 rounded-lg text-sm font-bold bg-red-500/20 text-red-400">
                            ⚠️ FLAGGED
                          </span>
                        )}
                      </div>
                      <p className="text-sm mb-1" style={{ color: '#8B6F47' }}>
                        {feedback.userName} ({feedback.userEmail})
                      </p>
                      <p className="text-xs" style={{ color: '#6B7280' }}>
                        {new Date(feedback.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={20}
                          className={i < feedback.rating ? 'text-amber-500 fill-amber-500' : 'text-zinc-600'}
                        />
                      ))}
                      <span className="ml-2 text-lg font-bold" style={{ color: '#D4A574' }}>
                        {feedback.rating}/5
                      </span>
                    </div>
                  </div>

                  {/* AI Summary */}
                  <div className="mb-4 p-4 rounded-lg" style={{ background: 'rgba(0, 0, 0, 0.2)' }}>
                    <p className="text-sm font-bold mb-2" style={{ color: '#B87333' }}>
                      AI SUMMARY:
                    </p>
                    <p className="text-sm" style={{ color: '#F5F1E8' }}>
                      {feedback.summary}
                    </p>
                  </div>

                  {/* Categories */}
                  {feedback.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {feedback.categories.map((cat, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 rounded text-xs"
                          style={{ background: 'rgba(184, 115, 51, 0.2)', color: '#D4A574' }}
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Comments */}
                  {feedback.comments && (
                    <div className="mb-4">
                      <p className="text-sm font-bold mb-2" style={{ color: '#B87333' }}>
                        COMMENTS:
                      </p>
                      <p className="text-sm" style={{ color: '#F5F1E8' }}>
                        {feedback.comments}
                      </p>
                    </div>
                  )}

                  {/* Detailed Ratings */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    {feedback.foodQuality > 0 && (
                      <div>
                        <span style={{ color: '#8B6F47' }}>Food Quality: </span>
                        <span style={{ color: '#D4A574' }}>{feedback.foodQuality}/5</span>
                      </div>
                    )}
                    {feedback.deliveryTime > 0 && (
                      <div>
                        <span style={{ color: '#8B6F47' }}>Delivery: </span>
                        <span style={{ color: '#D4A574' }}>{feedback.deliveryTime}/5</span>
                      </div>
                    )}
                    {feedback.ambience > 0 && (
                      <div>
                        <span style={{ color: '#8B6F47' }}>Ambience: </span>
                        <span style={{ color: '#D4A574' }}>{feedback.ambience}/5</span>
                      </div>
                    )}
                    {feedback.service > 0 && (
                      <div>
                        <span style={{ color: '#8B6F47' }}>Service: </span>
                        <span style={{ color: '#D4A574' }}>{feedback.service}/5</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => updateFeedback(feedback._id, { isFlagged: !feedback.isFlagged })}
                    className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
                    style={{
                      background: feedback.isFlagged
                        ? 'rgba(16, 185, 129, 0.2)'
                        : 'rgba(239, 68, 68, 0.2)',
                      border: `1px solid ${feedback.isFlagged ? '#10B981' : '#EF4444'}`,
                      color: feedback.isFlagged ? '#10B981' : '#EF4444',
                    }}
                  >
                    {feedback.isFlagged ? 'Unflag' : 'Flag'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg disabled:opacity-50"
            style={{ background: 'rgba(184, 115, 51, 0.2)', border: '1px solid rgba(184, 115, 51, 0.3)', color: '#D4A574' }}
          >
            Previous
          </button>
          <span style={{ color: '#F5F1E8' }}>
            Page {currentPage} of {pagination.pages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(pagination.pages, p + 1))}
            disabled={currentPage === pagination.pages}
            className="px-4 py-2 rounded-lg disabled:opacity-50"
            style={{ background: 'rgba(184, 115, 51, 0.2)', border: '1px solid rgba(184, 115, 51, 0.3)', color: '#D4A574' }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
