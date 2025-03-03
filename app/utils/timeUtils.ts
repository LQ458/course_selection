import { Course, CourseSchedule } from "../types";
import dayjs from "dayjs";

/**
 * 将时间字符串转换为分钟数
 * @param timeStr 时间字符串，格式为 "HH:MM"
 * @returns 从00:00开始的分钟数
 */
export const timeToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

/**
 * 检查两个时间段是否冲突
 * @param schedule1 第一个时间段
 * @param schedule2 第二个时间段
 * @returns 是否冲突
 */
export const isTimeSlotConflict = (
  schedule1: CourseSchedule,
  schedule2: CourseSchedule,
): boolean => {
  // 如果不是同一天，则不冲突
  if (schedule1.dayOfWeek !== schedule2.dayOfWeek) {
    return false;
  }

  const start1 = timeToMinutes(schedule1.startTime);
  const end1 = timeToMinutes(schedule1.endTime);
  const start2 = timeToMinutes(schedule2.startTime);
  const end2 = timeToMinutes(schedule2.endTime);

  // 检查时间重叠：如果一个时间段的开始时间早于另一个时间段的结束时间，
  // 并且结束时间晚于另一个时间段的开始时间，则冲突
  return start1 < end2 && end1 > start2;
};

/**
 * 检查两组课程时间安排是否有冲突
 * @param schedules1 第一组课程时间安排
 * @param schedules2 第二组课程时间安排
 * @returns 是否存在冲突
 */
export const isTimeConflict = (
  schedules1: CourseSchedule[],
  schedules2: CourseSchedule[],
): boolean => {
  for (const schedule1 of schedules1) {
    for (const schedule2 of schedules2) {
      if (isTimeSlotConflict(schedule1, schedule2)) {
        return true;
      }
    }
  }
  return false;
};

/**
 * 格式化时间字符串
 * @param timeStr 时间字符串，格式为 "HH:MM"
 * @returns 格式化后的时间字符串，例如 "14:30" -> "14:30"
 */
export const formatTime = (timeStr: string): string => {
  return timeStr;
};

/**
 * 获取星期几的文本表示
 * @param day 数字表示的星期几 (0-6, 0表示周日)
 * @returns 星期几的文本表示
 */
export const getDayOfWeekText = (day: number): string => {
  const days = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  return days[day] || "";
};

/**
 * 格式化课程时间安排为可读字符串
 * @param schedule 课程时间安排
 * @returns 格式化后的字符串，例如 "周一 14:30-16:00"
 */
export const formatSchedule = (schedule: CourseSchedule): string => {
  return `${getDayOfWeekText(schedule.dayOfWeek)} ${schedule.startTime}-${
    schedule.endTime
  }`;
};

/**
 * 检查两个时间段是否有冲突
 * @param time1 第一个时间段 [开始时间, 结束时间]
 * @param time2 第二个时间段 [开始时间, 结束时间]
 * @returns 是否有冲突
 */
export function isTimeRangeConflict(
  time1: [number, number],
  time2: [number, number],
): boolean {
  // 时间段有交集的条件：一个时间段的开始时间小于另一个时间段的结束时间，
  // 且一个时间段的结束时间大于另一个时间段的开始时间
  return time1[0] < time2[1] && time1[1] > time2[0];
}

/**
 * 格式化日期时间
 * @param date 日期对象或字符串
 * @param format 格式化模式
 * @returns 格式化后的日期字符串
 */
export function formatDateTime(
  date: Date | string,
  format = "YYYY-MM-DD HH:mm:ss",
): string {
  return dayjs(date).format(format);
}

/**
 * 获取相对时间（例如：3小时前）
 * @param date 日期对象或字符串
 * @returns 相对时间字符串
 */
export function getRelativeTime(date: Date | string): string {
  const now = dayjs();
  const target = dayjs(date);
  const diffMinutes = now.diff(target, "minute");

  if (diffMinutes < 1) {
    return "刚刚";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes}分钟前`;
  }

  const diffHours = now.diff(target, "hour");
  if (diffHours < 24) {
    return `${diffHours}小时前`;
  }

  const diffDays = now.diff(target, "day");
  if (diffDays < 30) {
    return `${diffDays}天前`;
  }

  const diffMonths = now.diff(target, "month");
  if (diffMonths < 12) {
    return `${diffMonths}个月前`;
  }

  return `${now.diff(target, "year")}年前`;
}
