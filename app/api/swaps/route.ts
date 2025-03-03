import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { dbConnect } from "@/app/lib/dbConnect";
import { SwapRequest, Course, User } from "@/app/models";
import { successResponse, errorResponse, handleApiError } from "@/app/lib/api";
import { authOptions, getCurrentUserId } from "@/app/lib/auth";
import { SwapStatus } from "@/app/types";

/**
 * 获取当前用户的换课申请历史
 * GET /api/swaps
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return errorResponse("未授权", 401);
    }

    const userId = getCurrentUserId(session);
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // 构建查询条件
    const query: any = { "student.id": userId };
    if (status && Object.values(SwapStatus).includes(status as SwapStatus)) {
      query.status = status;
    }

    // 查询总数
    const total = await SwapRequest.countDocuments(query);

    // 查询换课申请列表
    const swapRequests = await SwapRequest.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("originalCourse", "name teacher schedule location")
      .populate("targetCourse", "name teacher schedule location")
      .lean();

    return successResponse({
      swapRequests,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * 创建换课申请
 * POST /api/swaps
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return errorResponse("未授权", 401);
    }

    const userId = getCurrentUserId(session);
    await dbConnect();

    const body = await request.json();
    const { originalCourseId, targetCourseId, reason } = body;

    // 验证课程是否存在
    const [originalCourse, targetCourse, user] = await Promise.all([
      Course.findById(originalCourseId),
      Course.findById(targetCourseId),
      User.findById(userId),
    ]);

    if (!originalCourse) {
      return errorResponse("原课程不存在", 404);
    }

    if (!targetCourse) {
      return errorResponse("目标课程不存在", 404);
    }

    if (!user) {
      return errorResponse("用户不存在", 404);
    }

    // 验证用户是否已选择原课程
    if (!user.enrolledCourses.includes(originalCourseId)) {
      return errorResponse("您未选择该原课程", 400);
    }

    // 验证目标课程是否可换
    if (!targetCourse.isSwapable) {
      return errorResponse("目标课程不可换", 400);
    }

    // 验证目标课程是否有名额
    if (targetCourse.enrolled >= targetCourse.capacity) {
      return errorResponse("目标课程已满员", 400);
    }

    // 检查是否已有相同的待审批申请
    const existingRequest = await SwapRequest.findOne({
      "student.id": userId,
      originalCourse: originalCourseId,
      targetCourse: targetCourseId,
      status: SwapStatus.PENDING,
    });

    if (existingRequest) {
      return errorResponse("您已提交相同的换课申请，请勿重复提交", 409);
    }

    // 创建换课申请
    const swapRequest = await SwapRequest.create({
      student: {
        id: userId,
        name: user.name,
      },
      originalCourse: originalCourseId,
      targetCourse: targetCourseId,
      reason,
      status: SwapStatus.PENDING,
    });

    return successResponse(swapRequest, "换课申请提交成功", 201);
  } catch (error) {
    return handleApiError(error);
  }
}
