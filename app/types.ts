// 课程时间安排
export interface CourseSchedule {
  dayOfWeek: number; // 0-6，0代表周日
  startTime: string; // 格式："HH:MM"
  endTime: string; // 格式："HH:MM"
}

// 课程
export interface Course {
  _id: string;
  code: string; // 课程代码，例如：CS101
  name: string; // 课程名称
  description: string; // 课程描述
  credits: number; // 学分
  teacher: string; // 教师名称
  schedule: CourseSchedule[]; // 课程时间安排
  location: string; // 上课地点
  capacity: number; // 课程容量
  enrolled: number; // 已报名人数
  prerequisites: string[]; // 先修课程列表
  department: string; // 所属院系
  isSwapable: boolean; // 是否可换课
  semester: string; // 学期，例如：Spring 2023
}

// 用户
export interface User {
  _id: string;
  username: string;
  email: string;
  role: "student" | "admin"; // 用户角色
  studentId?: string; // 学生ID
  name: string; // 用户姓名
  department?: string; // 学生所属院系
  enrolledCourses: string[]; // 已注册课程ID列表
}

// 换课请求
export interface SwapRequest {
  _id: string;
  studentId: string;
  studentName: string;
  fromCourseId: string;
  fromCourseName: string;
  toCourseId: string;
  toCourseName: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
  adminComment?: string;
}

// API响应
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 用户角色枚举
export enum UserRole {
  STUDENT = "student",
  ADMIN = "admin",
}

// 学生类型（User的子类型）
export interface Student extends User {
  role: UserRole.STUDENT;
  studentId: string;
  department: string;
  enrolledCourses: string[];
}

// 换课申请状态枚举
export enum SwapStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

// 分页响应类型
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
