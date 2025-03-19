import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { dbConnect } from "@/app/lib/dbConnect";
import { SwapRequest, Course, User } from "@/app/models";
import { successResponse, errorResponse, handleApiError } from "@/app/lib/api";
import { authOptions, isAdmin } from "@/app/api/auth/[...nextauth]/route";
import { SwapStatus } from "@/app/types";
import mongoose from "mongoose";

interface Params {
  params: {
    id: string;
  };
}

/**
 * 获取换课申请详情（管理员）
 * GET /api/admin/swaps/:id
 */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !isAdmin(session)) {
      return errorResponse("无权访问", 403);
    }

    await dbConnect();

    const swapRequest = await SwapRequest.findById(params.id)
      .populate("originalCourse")
      .populate("targetCourse")
      .lean();

    if (!swapRequest) {
      return errorResponse("换课申请不存在", 404);
    }

    return successResponse(swapRequest);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * 审批单个换课申请（管理员）
 * PATCH /api/admin/swaps/:id
 */
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !isAdmin(session)) {
      return errorResponse("无权访问", 403);
    }

    const adminId = session?.user?.id;
    await dbConnect();

    const body = await request.json();
    const { action, reviewNote, checkResults } = body;

    if (!action || !["approve", "reject"].includes(action)) {
      return errorResponse("无效的审批操作", 400);
    }

    // 查找申请
    const swapRequest = await SwapRequest.findById(params.id);

    if (!swapRequest) {
      return errorResponse("换课申请不存在", 404);
    }

    // 验证申请是否为待审批状态
    if (swapRequest.status !== SwapStatus.PENDING) {
      return errorResponse("该申请已被处理", 400);
    }

    // 验证并更新状态
    const status =
      action === "approve" ? SwapStatus.APPROVED : SwapStatus.REJECTED;

    // 构建审批备注
    let adminComment = `${action === "approve" ? "Approved" : "Rejected"}: `;
    if (checkResults.prerequisitesNotFulfilled) {
      adminComment += "Prerequisites not fulfilled. ";
    }
    if (checkResults.noSpace) {
      adminComment += "No space available. ";
    }
    if (reviewNote) {
      adminComment += reviewNote;
    }

    // 开启事务
    const session2 = await mongoose.startSession();
    session2.startTransaction();

    try {
      // 更新申请状态
      swapRequest.status = status;
      swapRequest.adminComment = adminComment;
      swapRequest.reviewedBy = adminId;
      swapRequest.reviewedAt = new Date();

      // 如果是批准申请，则更新课程和用户信息
      if (action === "approve") {
        const originalCourseId = swapRequest.originalCourse.toString();
        const targetCourseId = swapRequest.targetCourse.toString();
        const studentId = swapRequest.student.id.toString();

        // 更新课程人数
        await Promise.all([
          Course.findByIdAndUpdate(
            originalCourseId,
            { $inc: { enrolled: -1 } },
            { session: session2 },
          ),
          Course.findByIdAndUpdate(
            targetCourseId,
            { $inc: { enrolled: 1 } },
            { session: session2 },
          ),
        ]);

        // 更新用户选课信息
        await User.findByIdAndUpdate(
          studentId,
          {
            $pull: { enrolledCourses: originalCourseId },
            $addToSet: { enrolledCourses: targetCourseId },
          },
          { session: session2 },
        );
      }

      await swapRequest.save({ session: session2 });
      await session2.commitTransaction();
    } catch (error) {
      await session2.abortTransaction();
      throw error;
    } finally {
      session2.endSession();
    }

    return successResponse(
      swapRequest,
      `申请已${action === "approve" ? "通过" : "拒绝"}`,
    );
  } catch (error) {
    return handleApiError(error);
  }
}
