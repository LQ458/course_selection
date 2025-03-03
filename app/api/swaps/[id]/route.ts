import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { dbConnect } from "@/app/lib/dbConnect";
import { SwapRequest } from "@/app/models";
import { successResponse, errorResponse, handleApiError } from "@/app/lib/api";
import { authOptions, getCurrentUserId } from "@/app/lib/auth";
import { SwapStatus } from "@/app/types";

interface Params {
  params: {
    id: string;
  };
}

/**
 * 获取换课申请详情
 * GET /api/swaps/:id
 */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return errorResponse("未授权", 401);
    }

    const userId = getCurrentUserId(session);
    await dbConnect();

    const swapRequest = await SwapRequest.findById(params.id)
      .populate("originalCourse")
      .populate("targetCourse")
      .lean();

    if (!swapRequest) {
      return errorResponse("换课申请不存在", 404);
    }

    // 验证是否是当前用户的申请
    if (swapRequest.student.id.toString() !== userId) {
      return errorResponse("无权查看此申请", 403);
    }

    return successResponse(swapRequest);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * 取消换课申请（仅限待审批状态）
 * DELETE /api/swaps/:id
 */
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return errorResponse("未授权", 401);
    }

    const userId = getCurrentUserId(session);
    await dbConnect();

    const swapRequest = await SwapRequest.findById(params.id);

    if (!swapRequest) {
      return errorResponse("换课申请不存在", 404);
    }

    // 验证是否是当前用户的申请
    if (swapRequest.student.id.toString() !== userId) {
      return errorResponse("无权取消此申请", 403);
    }

    // 验证申请是否为待审批状态
    if (swapRequest.status !== SwapStatus.PENDING) {
      return errorResponse("只能取消待审批的申请", 400);
    }

    // 删除申请
    await SwapRequest.findByIdAndDelete(params.id);

    return successResponse(null, "换课申请已取消");
  } catch (error) {
    return handleApiError(error);
  }
}
