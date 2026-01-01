import mongoose from "mongoose";

const aiConfigSchema = new mongoose.Schema({
  lowStockLimit: { type: Number, default: 5 },
  inactiveDays: { type: Number, default: 7 },
  enableDiscountAI: { type: Boolean, default: true },
  discountItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Menu",
    default: null,
  },
  discountPercent: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
}, { timestamps: true });

export default mongoose.model("AIConfig", aiConfigSchema);
