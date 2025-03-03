import mongoose, { Schema } from "mongoose";
import { Course } from "../types";

const CourseSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "课程名称不能为空"],
      trim: true,
    },
    teacher: {
      type: String,
      required: [true, "教师姓名不能为空"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "课程描述不能为空"],
    },
    schedule: [
      {
        dayOfWeek: {
          type: Number,
          required: true,
          min: 0,
          max: 6,
        },
        startTime: {
          type: String,
          required: true,
          match: /^([01]\d|2[0-3]):([0-5]\d)$/,
        },
        endTime: {
          type: String,
          required: true,
          match: /^([01]\d|2[0-3]):([0-5]\d)$/,
        },
      },
    ],
    location: {
      type: String,
      required: [true, "教室位置不能为空"],
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, "课程容量不能为空"],
      min: 1,
    },
    enrolled: {
      type: Number,
      default: 0,
      min: 0,
    },
    isSwapable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// 检查模型是否已经存在，避免热重载时的警告
const CourseModel =
  mongoose.models.Course || mongoose.model<Course>("Course", CourseSchema);

export default CourseModel;
