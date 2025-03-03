import mongoose, { Schema } from "mongoose";
import { SwapRequest, SwapStatus } from "../types";

const SwapRequestSchema = new Schema(
  {
    student: {
      id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
    originalCourse: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    targetCourse: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    reason: {
      type: String,
      required: [true, "申请理由不能为空"],
      minlength: [10, "申请理由不能少于10个字符"],
    },
    status: {
      type: String,
      enum: Object.values(SwapStatus),
      default: SwapStatus.PENDING,
    },
    reviewNote: {
      type: String,
      default: "",
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// 创建复合索引，提高查询效率
SwapRequestSchema.index({ student: 1, status: 1 });
SwapRequestSchema.index({ status: 1, createdAt: -1 });

// 检查模型是否已经存在，避免热重载时的警告
const SwapRequestModel =
  mongoose.models.SwapRequest ||
  mongoose.model<SwapRequest>("SwapRequest", SwapRequestSchema);

export default SwapRequestModel;
