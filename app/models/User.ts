import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import { User } from "../types";

export interface UserDocument extends Document, Omit<User, "_id"> {
  password?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

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
    username: {
      type: String,
      required: [true, "用户名不能为空"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "密码不能为空"],
      minlength: [6, "密码不能少于6个字符"],
      select: false, // 默认查询不返回密码
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    studentId: {
      type: String,
      sparse: true, // 允许非学生角色为空
    },
    department: {
      type: String,
      default: "",
    },
    enrolledCourses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

// 密码加密中间件
UserSchema.pre<UserDocument>("save", async function (next) {
  // 只有在密码被修改时才重新加密
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// 密码比较方法
UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

// 创建索引，提高查询效率
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ role: 1 });

// 检查模型是否已经存在，避免热重载时的警告
const UserModel =
  mongoose.models.User || mongoose.model<UserDocument>("User", UserSchema);

export default UserModel;
