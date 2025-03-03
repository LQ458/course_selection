import React from "react";
import { Card, Typography, Tag, Progress, Space, Badge } from "antd";
import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Course } from "../types";
import dayjs from "dayjs";

const { Title, Text } = Typography;

// 将数字转换为星期几
const getDayOfWeekText = (day: number) => {
  const days = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  return days[day] || "";
};

// 格式化课程时间
const formatSchedule = (schedule: Course["schedule"]) => {
  return schedule
    .map((s) => {
      return `${getDayOfWeekText(s.dayOfWeek)} ${s.startTime}-${s.endTime}`;
    })
    .join(", ");
};

interface CourseCardProps {
  course: Course & { remainingSeats?: number };
  onClick?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onClick }) => {
  const { name, teacher, schedule, location, capacity, enrolled, isSwapable } =
    course;
  const remainingSeats =
    course.remainingSeats !== undefined
      ? course.remainingSeats
      : capacity - enrolled;
  const enrollmentPercentage = Math.round((enrolled / capacity) * 100);

  // 判断是否即将满员（剩余名额小于等于3）
  const isAlmostFull = remainingSeats <= 3 && remainingSeats > 0;

  return (
    <Card
      hoverable
      onClick={onClick}
      className="w-full"
      extra={
        <Badge
          status={isSwapable ? "success" : "error"}
          text={isSwapable ? "可换课" : "不可换"}
        />
      }
    >
      <Title level={4} className="mb-2">
        {name}
      </Title>

      <Space direction="vertical" className="w-full">
        <Text>
          <UserOutlined className="mr-2" />
          {teacher}
        </Text>

        <Text>
          <ClockCircleOutlined className="mr-2" />
          {formatSchedule(schedule)}
        </Text>

        <Text>
          <EnvironmentOutlined className="mr-2" />
          {location}
        </Text>

        <div className="mt-4">
          <div className="flex justify-between mb-1">
            <Text>课程容量</Text>
            <Text>
              {enrolled}/{capacity}
            </Text>
          </div>

          <Progress
            percent={enrollmentPercentage}
            status={isAlmostFull ? "exception" : "active"}
            strokeColor={isAlmostFull ? "#faad14" : undefined}
          />

          {isAlmostFull && (
            <Text type="warning" className="text-sm">
              即将满员，仅剩{remainingSeats}个名额
            </Text>
          )}
        </div>
      </Space>
    </Card>
  );
};

export default CourseCard;
