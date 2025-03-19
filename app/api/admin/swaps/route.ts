import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { dbConnect } from "@/app/lib/dbConnect";
import { SwapRequest } from "@/app/models";
import { successResponse, errorResponse, handleApiError } from "@/app/lib/api";
import { authOptions, isAdmin } from "@/app/api/auth/[...nextauth]/route";
import { SwapStatus } from "@/app/types";

/**
 * 获取所有换课申请（管理员）
 * GET /api/admin/swaps
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !isAdmin(session)) {
      return errorResponse("无权访问", 403);
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // 构建查询条件
    const query: any = {};
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
 * 批量审批换课申请（管理员）
 * POST /api/admin/swaps
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !isAdmin(session)) {
      return errorResponse("无权访问", 403);
    }

    const adminId = session.user.id;
    await dbConnect();

    const body = await request.json();
    const { ids, action, reviewNote } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return errorResponse("请选择要审批的申请", 400);
    }

    if (!action || !["approve", "reject"].includes(action)) {
      return errorResponse("无效的审批操作", 400);
    }

    const status =
      action === "approve" ? SwapStatus.APPROVED : SwapStatus.REJECTED;

    // 批量更新申请状态
    const result = await SwapRequest.updateMany(
      { _id: { $in: ids }, status: SwapStatus.PENDING },
      {
        $set: {
          status,
          reviewNote: reviewNote || "",
          reviewedBy: adminId,
          reviewedAt: new Date(),
        },
      },
    );

    return successResponse(
      { modifiedCount: result.modifiedCount },
      `已${action === "approve" ? "通过" : "拒绝"}${result.modifiedCount}个申请`,
    );
  } catch (error) {
    return handleApiError(error);
  }
}
