import { NextRequest, NextResponse } from "next/server";
import { SwapStatus } from "../../../../../types";

// 模拟数据库数据 - 与其他路由中的数据相同
const mockSwapRequests = [
  {
    _id: "1",
    student: {
      _id: "s1",
      name: "张三",
      studentId: "2023001",
    },
    originalCourseId: "c1",
    targetCourseId: "c2",
    reason: "原课程与我的其他课程时间冲突，希望能够换到这个课程。",
    status: SwapStatus.PENDING,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: null,
  },
  {
    _id: "2",
    student: {
      _id: "s2",
      name: "李四",
      studentId: "2023002",
    },
    originalCourseId: "c3",
    targetCourseId: "c4",
    reason: "目标课程的内容更符合我的学习计划和兴趣方向。",
    status: SwapStatus.APPROVED,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "3",
    student: {
      _id: "s3",
      name: "王五",
      studentId: "2023003",
    },
    originalCourseId: "c5",
    targetCourseId: "c6",
    reason: "我对目标课程的教学内容更感兴趣，希望能够进行课程替换。",
    status: SwapStatus.REJECTED,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "4",
    student: {
      _id: "s4",
      name: "赵六",
      studentId: "2023004",
    },
    originalCourseId: "c7",
    targetCourseId: "c8",
    reason: "目标课程的教师教学风格更适合我的学习方式。",
    status: SwapStatus.PENDING,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: null,
  },
  {
    _id: "5",
    student: {
      _id: "s5",
      name: "钱七",
      studentId: "2023005",
    },
    originalCourseId: "c9",
    targetCourseId: "c10",
    reason:
      "由于个人原因，原课程的上课时间对我来说不太方便，希望能换到这个时间更合适的课程。",
    status: SwapStatus.PENDING,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: null,
  },
];

// 模拟课程数据
const mockCourses = {
  c1: {
    _id: "c1",
    name: "高等数学",
    code: "MATH101",
    credits: 4,
    teacher: "张教授",
    capacity: 100,
    enrolled: 80,
    description: "本课程介绍微积分的基本概念和应用。",
    location: "理学院101",
    schedule: [
      { day: "周一", startTime: "08:00", endTime: "09:50" },
      { day: "周三", startTime: "08:00", endTime: "09:50" },
    ],
    department: "数学系",
    semester: "2023-2024-1",
  },
  c2: {
    _id: "c2",
    name: "线性代数",
    code: "MATH102",
    credits: 3,
    teacher: "李教授",
    capacity: 90,
    enrolled: 75,
    description: "本课程介绍线性代数的基本概念和应用。",
    location: "理学院102",
    schedule: [
      { day: "周二", startTime: "10:00", endTime: "11:50" },
      { day: "周四", startTime: "10:00", endTime: "11:50" },
    ],
    department: "数学系",
    semester: "2023-2024-1",
  },
  c3: {
    _id: "c3",
    name: "大学物理",
    code: "PHYS101",
    credits: 4,
    teacher: "王教授",
    capacity: 80,
    enrolled: 70,
    description: "本课程介绍经典力学和电磁学的基本概念。",
    location: "理学院201",
    schedule: [
      { day: "周一", startTime: "14:00", endTime: "15:50" },
      { day: "周三", startTime: "14:00", endTime: "15:50" },
    ],
    department: "物理系",
    semester: "2023-2024-1",
  },
  c4: {
    _id: "c4",
    name: "量子力学",
    code: "PHYS201",
    credits: 3,
    teacher: "赵教授",
    capacity: 60,
    enrolled: 45,
    description: "本课程介绍量子力学的基本原理和应用。",
    location: "理学院202",
    schedule: [
      { day: "周二", startTime: "14:00", endTime: "15:50" },
      { day: "周四", startTime: "14:00", endTime: "15:50" },
    ],
    department: "物理系",
    semester: "2023-2024-1",
  },
  c5: {
    _id: "c5",
    name: "数据结构",
    code: "CS101",
    credits: 4,
    teacher: "钱教授",
    capacity: 120,
    enrolled: 110,
    description: "本课程介绍基本数据结构和算法。",
    location: "信息楼101",
    schedule: [
      { day: "周一", startTime: "10:00", endTime: "11:50" },
      { day: "周三", startTime: "10:00", endTime: "11:50" },
    ],
    department: "计算机系",
    semester: "2023-2024-1",
  },
  c6: {
    _id: "c6",
    name: "算法设计",
    code: "CS201",
    credits: 3,
    teacher: "孙教授",
    capacity: 100,
    enrolled: 90,
    description: "本课程介绍高级算法设计和分析技术。",
    location: "信息楼102",
    schedule: [
      { day: "周二", startTime: "08:00", endTime: "09:50" },
      { day: "周四", startTime: "08:00", endTime: "09:50" },
    ],
    department: "计算机系",
    semester: "2023-2024-1",
  },
  c7: {
    _id: "c7",
    name: "有机化学",
    code: "CHEM101",
    credits: 4,
    teacher: "周教授",
    capacity: 70,
    enrolled: 60,
    description: "本课程介绍有机化学的基本概念和反应机理。",
    location: "化学楼101",
    schedule: [
      { day: "周一", startTime: "14:00", endTime: "15:50" },
      { day: "周三", startTime: "14:00", endTime: "15:50" },
    ],
    department: "化学系",
    semester: "2023-2024-1",
  },
  c8: {
    _id: "c8",
    name: "物理化学",
    code: "CHEM201",
    credits: 3,
    teacher: "吴教授",
    capacity: 60,
    enrolled: 50,
    description: "本课程介绍物理化学的基本原理和应用。",
    location: "化学楼102",
    schedule: [
      { day: "周二", startTime: "14:00", endTime: "15:50" },
      { day: "周四", startTime: "14:00", endTime: "15:50" },
    ],
    department: "化学系",
    semester: "2023-2024-1",
  },
  c9: {
    _id: "c9",
    name: "微观经济学",
    code: "ECON101",
    credits: 3,
    teacher: "郑教授",
    capacity: 150,
    enrolled: 130,
    description: "本课程介绍微观经济学的基本原理和应用。",
    location: "经管楼101",
    schedule: [
      { day: "周一", startTime: "08:00", endTime: "09:50" },
      { day: "周三", startTime: "08:00", endTime: "09:50" },
    ],
    department: "经济系",
    semester: "2023-2024-1",
  },
  c10: {
    _id: "c10",
    name: "宏观经济学",
    code: "ECON201",
    credits: 3,
    teacher: "王教授",
    capacity: 140,
    enrolled: 120,
    description: "本课程介绍宏观经济学的基本原理和政策应用。",
    location: "经管楼102",
    schedule: [
      { day: "周二", startTime: "10:00", endTime: "11:50" },
      { day: "周四", startTime: "10:00", endTime: "11:50" },
    ],
    department: "经济系",
    semester: "2023-2024-1",
  },
};

// GET 获取换课申请相关的课程信息
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = params.id;

    // 查找申请
    const application = mockSwapRequests.find((app) => app._id === id);
    if (!application) {
      return NextResponse.json(
        { success: false, error: "找不到指定的申请" },
        { status: 404 },
      );
    }

    // 获取原课程和目标课程
    const originalCourse = mockCourses[application.originalCourseId];
    const targetCourse = mockCourses[application.targetCourseId];

    if (!originalCourse || !targetCourse) {
      return NextResponse.json(
        { success: false, error: "找不到相关课程信息" },
        { status: 404 },
      );
    }

    // 模拟延迟
    await new Promise((resolve) => setTimeout(resolve, 300));

    return NextResponse.json({
      success: true,
      originalCourse,
      targetCourse,
    });
  } catch (error) {
    console.error("获取课程信息失败:", error);
    return NextResponse.json(
      { success: false, error: "获取课程信息失败" },
      { status: 500 },
    );
  }
}
