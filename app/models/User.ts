import mongoose, { Schema } from "mongoose";
import { User } from "../types";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "用户名不能为空"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "邮箱不能为空"],
      unique: true,
      trim: true,
      lowercase: true,
      // 简单的邮箱验证
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "请提供有效的邮箱地址",
      ],
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    enrolledCourses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    // 如果使用密码认证，可以添加密码字段和相关方法
    // password: {
    //   type: String,
    //   required: [true, '密码不能为空'],
    //   minlength: [6, '密码不能少于6个字符'],
    //   select: false, // 默认查询不返回密码
    // },
  },
  {
    timestamps: true,
  },
);

// 创建索引，提高查询效率
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

// 检查模型是否已经存在，避免热重载时的警告
const UserModel =
  mongoose.models.User || mongoose.model<User>("User", UserSchema);

export default UserModel;
