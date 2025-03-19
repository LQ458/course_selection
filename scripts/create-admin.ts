import { hash } from "bcryptjs";
import { dbConnect } from "../app/lib/dbConnect";
import UserModel from "../app/models/User";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" }); // 加载.env.local文件

async function createAdmin() {
  try {
    await dbConnect();

    // 检查是否已存在管理员账号
    const existingAdmin = await UserModel.findOne({ username: "admin" });
    if (existingAdmin) {
      console.log("管理员账号已存在");
      return;
    }

    // 创建新的管理员账号
    const hashedPassword = await hash("admin123", 12); // 使用 bcryptjs 加密密码

    const admin = await UserModel.create({
      username: "admin",
      password: hashedPassword,
      name: "System Admin",
      role: "admin",
      email: "admin@example.com",
    });

    console.log("管理员账号创建成功:", admin);
  } catch (error) {
    console.error("创建管理员账号失败:", error);
  } finally {
    // 确保关闭数据库连接
    await mongoose.connection.close();
    process.exit();
  }
}

createAdmin();
