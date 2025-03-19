import { dbConnect } from "../app/lib/dbConnect";
import { Course, User, SwapRequest } from "../app/models";
import { hash } from "bcryptjs";
import { SwapStatus } from "../app/types";

async function createMockData() {
  try {
    await dbConnect();

    // 创建管理员账号
    const adminPassword = await hash("admin123", 12);
    const admin = await User.findOneAndUpdate(
      { username: "admin" },
      {
        username: "admin",
        password: adminPassword,
        name: "System Admin",
        role: "admin",
        email: "admin@example.com",
      },
      { upsert: true, new: true },
    );

    // 创建测试学生账号
    const studentPassword = await hash("student123", 12);
    const student = await User.findOneAndUpdate(
      { username: "student" },
      {
        username: "student",
        password: studentPassword,
        name: "测试学生",
        role: "student",
        email: "student@example.com",
        studentId: "2024001",
      },
      { upsert: true, new: true },
    );

    // 创建 AP/Honors 课程
    const courses = await Course.insertMany([
      {
        name: "AP Calculus BC",
        code: "AP-MATH201",
        credits: 4,
        teacher: "Mr. Smith",
        schedule: [
          {
            dayOfWeek: 1,
            startTime: "08:00",
            endTime: "09:40",
          },
          {
            dayOfWeek: 3,
            startTime: "08:00",
            endTime: "09:40",
          },
        ],
        location: "Math Building 101",
        capacity: 30,
        enrolled: 25,
        isSwapable: true,
        description:
          "本课程涵盖微积分BC级别的所有内容,包括极限、导数、积分、级数等高阶主题。课程结束后学生将具备参加AP考试的能力。",
        department: "Mathematics",
        semester: "2023-2024-2",
      },
      {
        name: "AP Physics C: Mechanics",
        code: "AP-PHYS101",
        credits: 4,
        teacher: "Ms. Johnson",
        schedule: [
          {
            dayOfWeek: 2,
            startTime: "10:00",
            endTime: "11:40",
          },
          {
            dayOfWeek: 4,
            startTime: "10:00",
            endTime: "11:40",
          },
        ],
        location: "Science Building 202",
        capacity: 35,
        enrolled: 30,
        isSwapable: true,
        description:
          "本课程是基于微积分的力学课程,涵盖运动学、牛顿力学、能量、动量等主题。包含大量实验和实践内容,为AP物理C力学考试做准备。",
        department: "Physics",
        semester: "2023-2024-2",
      },
    ]);

    // 创建换课申请(增加理由长度)
    const swapRequests = await SwapRequest.insertMany([
      {
        student: {
          id: student._id,
          name: student.name,
        },
        originalCourse: courses[0]._id,
        targetCourse: courses[1]._id,
        reason:
          "由于我的课程安排发生变化,原课程与其他必修课程时间产生冲突,希望能够调整到这个时间更合适的课程。",
        status: SwapStatus.PENDING,
        createdAt: new Date(),
      },
      {
        student: {
          id: student._id,
          name: student.name,
        },
        originalCourse: courses[1]._id,
        targetCourse: courses[0]._id,
        reason:
          "经过深思熟虑,我认为目标课程的教学方式和进度更适合我的学习需求,希望能够获准转入该课程。",
        status: SwapStatus.PENDING,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    ]);

    console.log("模拟数据创建成功");
    console.log("管理员账号:", { username: "admin", password: "admin123" });
    console.log("学生账号:", { username: "student", password: "student123" });
    console.log("创建的课程数:", courses.length);
    console.log("创建的换课申请数:", swapRequests.length);
  } catch (error) {
    console.error("创建模拟数据失败:", error);
  } finally {
    process.exit();
  }
}

createMockData();
