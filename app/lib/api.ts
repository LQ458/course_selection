import { NextResponse } from "next/server";
import { ApiResponse } from "../types";

/**
 * 成功响应
 */
export function successResponse<T>(
  data: T,
  message = "操作成功",
  status = 200,
) {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
  };
  return NextResponse.json(response, { status });
}

/**
 * 错误响应
 */
export function errorResponse(error: string, status = 400) {
  const response: ApiResponse<null> = {
    success: false,
    error,
  };
  return NextResponse.json(response, { status });
}

/**
 * 处理API请求中的错误
 */
export function handleApiError(error: any) {
  console.error("API错误:", error);

  // 处理不同类型的错误
  if (error.name === "ValidationError") {
    // Mongoose验证错误
    const errors = Object.values(error.errors)
      .map((err: any) => err.message)
      .join(", ");
    return errorResponse(`验证错误: ${errors}`, 400);
  }

  if (error.code === 11000) {
    // MongoDB重复键错误
    return errorResponse("数据已存在，请勿重复提交", 409);
  }

  // 其他错误
  return errorResponse(
    error.message || "服务器内部错误",
    error.statusCode || 500,
  );
}
