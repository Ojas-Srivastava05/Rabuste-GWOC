import express from "express";
import Feedback from "../models/feedback.js";
import { analyzeSentiment, generateSummary, extractCategories, determinePriority } from "../utils/sentimentAnalysis.js";
import auth from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";

const router = express.Router();

// POST - Submit feedback
router.post("/", async (req, res) => {
  try {
    const feedbackData = req.body;

    // Perform AI analysis
    const sentimentResult = analyzeSentiment(
      feedbackData.comments || '',
      feedbackData.rating || 0,
      feedbackData
    );

    const summary = generateSummary(feedbackData);
    const categories = extractCategories(feedbackData);
    const isFlagged = sentimentResult.sentiment === 'negative' && (feedbackData.rating || 0) <= 2;
    const priority = determinePriority(sentimentResult.sentiment, feedbackData.rating || 0, isFlagged);

    // Create feedback with AI analysis
    const feedback = await Feedback.create({
      ...feedbackData,
      sentiment: sentimentResult.sentiment,
      sentimentScore: sentimentResult.score,
      summary,
      categories,
      isFlagged,
      priority,
    });

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully. Thank you!",
      feedback,
    });
  } catch (err) {
    console.error("Feedback creation error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// GET - Get all feedback (for admin)
router.get("/", auth, admin, async (req, res) => {
  try {
    const { type, sentiment, priority, flagged, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (type) query.type = type;
    if (sentiment) query.sentiment = sentiment;
    if (priority) query.priority = priority;
    if (flagged === 'true') query.isFlagged = true;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const feedbacks = await Feedback.find(query)
      .sort({ createdAt: -1, priority: 1 }) // Sort by newest first, then by priority
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'name email')
      .lean();

    const total = await Feedback.countDocuments(query);

    res.json({
      feedbacks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error("Failed to fetch feedback:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch feedback",
    });
  }
});

// GET - Get feedback statistics
router.get("/stats", auth, admin, async (req, res) => {
  try {
    const stats = {
      total: await Feedback.countDocuments(),
      byType: {
        order: await Feedback.countDocuments({ type: 'order' }),
        cafe: await Feedback.countDocuments({ type: 'cafe' }),
        website: await Feedback.countDocuments({ type: 'website' }),
      },
      bySentiment: {
        positive: await Feedback.countDocuments({ sentiment: 'positive' }),
        negative: await Feedback.countDocuments({ sentiment: 'negative' }),
        neutral: await Feedback.countDocuments({ sentiment: 'neutral' }),
      },
      flagged: await Feedback.countDocuments({ isFlagged: true }),
      averageRating: 0,
    };

    // Calculate average rating
    const ratingSum = await Feedback.aggregate([
      { $group: { _id: null, avgRating: { $avg: "$rating" } } }
    ]);
    stats.averageRating = ratingSum[0]?.avgRating || 0;

    res.json(stats);
  } catch (err) {
    console.error("Failed to fetch feedback stats:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch feedback statistics",
    });
  }
});

// GET - Get single feedback by ID
router.get("/:id", auth, admin, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate('userId', 'name email')
      .lean();

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    res.json(feedback);
  } catch (err) {
    console.error("Failed to fetch feedback:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch feedback",
    });
  }
});

// PATCH - Update feedback (e.g., mark as reviewed)
router.patch("/:id", auth, admin, async (req, res) => {
  try {
    const { isFlagged, priority } = req.body;
    const update = {};
    if (isFlagged !== undefined) update.isFlagged = isFlagged;
    if (priority) update.priority = priority;

    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    res.json({
      success: true,
      feedback,
    });
  } catch (err) {
    console.error("Failed to update feedback:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update feedback",
    });
  }
});

export default router;
