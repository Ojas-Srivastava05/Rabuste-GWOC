import mongoose from "mongoose";

const aiConfigSchema = new mongoose.Schema({
  lowStockLimit: { type: Number, default: 5 },
  inactiveDays: { type: Number, default: 7 },
  enableDiscountAI: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("AIConfig", aiConfigSchema);
