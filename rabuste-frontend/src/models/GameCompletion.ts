import mongoose, { Schema, models, model } from "mongoose";

const GameCompletionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    gameType: {
      type: String,
      enum: ["memory", "trivia", "origin"],
      required: true,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
GameCompletionSchema.index({ userId: 1, gameType: 1 });

const GameCompletion = models.GameCompletion || model("GameCompletion", GameCompletionSchema);

export default GameCompletion;
