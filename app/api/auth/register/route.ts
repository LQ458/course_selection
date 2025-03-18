import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect } from "@/app/lib/dbConnect";
import UserModel from "@/app/models/User";

// 注册表单验证模式
const registerSchema = z.object({
  name: z.string().min(1, "姓名不能为空"),
  email: z.string().email("请提供有效的邮箱地址"),
  username: z.string().min(3, "用户名至少需要3个字符"),
  password: z.string().min(6, "密码至少需要6个字符"),
  studentId: z.string().optional(),
  role: z.enum(["student", "admin"]).default("student"),
});

export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();

    // 验证输入
    const validatedData = registerSchema.parse(body);

    // 连接数据库
    await dbConnect();

    // 检查用户名和邮箱是否已存在
    const existingUser = await UserModel.findOne({
      $or: [
        { email: validatedData.email },
        { username: validatedData.username },
      ],
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error:
            existingUser.email === validatedData.email
              ? "该邮箱已被注册"
              : "该用户名已被使用",
        },
        { status: 400 },
      );
    }

    // 创建新用户
    const newUser = await UserModel.create({
      ...validatedData,
      department: "", // 设置为空字符串，保证字段存在
    });

    // 返回成功响应（不包含密码）
    return NextResponse.json({
      success: true,
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role,
        studentId: newUser.studentId,
      },
    });
  } catch (error) {
    console.error("注册错误:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, error: "注册失败，请稍后再试" },
      { status: 500 },
    );
  }
}
