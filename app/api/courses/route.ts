import { NextRequest } from "next/server";
import { dbConnect } from "@/app/lib/dbConnect";
import { Course } from "@/app/models";
import { successResponse, errorResponse, handleApiError } from "@/app/lib/api";
import { CourseStatus } from "@/app/types";
import mongoose from "mongoose";

/**
 * 获取课程列表
 * GET /api/courses
 */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const query: any = {};
    if (filter === CourseStatus.AVAILABLE) {
      query.isSwapable = true;
      query.enrolled = { $lt: "$capacity" }; // 使用MongoDB聚合表达式查询
    }

    // 查询课程总数
    const total = await Course.countDocuments(query);

    // 查询课程列表，并计算剩余名额
    const courses = await Course.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // 添加剩余名额信息
    const coursesWithRemainingSeats = courses.map((course) => ({
      ...course,
      remainingSeats: course.capacity - course.enrolled,
    }));

    return successResponse({
      courses: coursesWithRemainingSeats,
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
 * 创建新课程（管理员）
 * POST /api/courses
 */
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    // 创建新课程
    const course = await Course.create(body);

    return successResponse(course, "课程创建成功", 201);
  } catch (error) {
    return handleApiError(error);
  }
}

// 定义课程模型
const CourseSchema = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  credits: { type: Number, required: true },
  teacher: { type: String, required: true },
  schedule: [
    {
      dayOfWeek: { type: Number, required: true }, // 0-6, 0表示周日
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
    },
  ],
  location: { type: String, required: true },
  capacity: { type: Number, required: true },
  enrolled: { type: Number, required: true, default: 0 },
  prerequisites: [{ type: String }],
  department: { type: String, required: true },
  isSwapable: { type: Boolean, default: true },
  semester: { type: String, required: true },
});

let Course: mongoose.Model<any>;
try {
  // 如果已经存在课程模型，使用现有的
  Course = mongoose.model("Course");
} catch {
  // 否则创建新的模型
  Course = mongoose.model("Course", CourseSchema);
}

// 获取所有课程
export async function getAllCourses() {
  try {
    await dbConnect();
    const courses = await Course.find({}).lean();

    return { success: true, data: courses };
  } catch (error) {
    console.error("获取课程失败", error);
    return { success: false, error: "获取课程失败" };
  }
}

// 创建新课程
export async function createNewCourse(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    const newCourse = await Course.create(body);

    return { success: true, data: newCourse };
  } catch (error) {
    console.error("创建课程失败", error);
    return { success: false, error: "创建课程失败" };
  }
}
