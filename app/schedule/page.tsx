"use client";

import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  Badge,
  Tag,
  Empty,
  Spin,
  Tabs,
  Calendar,
  Modal,
  Descriptions,
  Button,
} from "antd";
import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import Layout from "../components/Layout";
import { Course } from "../types";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { getDayOfWeekText } from "../utils/timeUtils";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

// 模拟数据
const mockEnrolledCourses: Course[] = [
  {
    _id: "1",
    code: "CS101",
    name: "计算机科学导论",
    description: "计算机科学的基础课程，涵盖计算机系统、算法和编程基础。",
    credits: 3,
    teacher: "张教授",
    schedule: [
      { dayOfWeek: 1, startTime: "08:30", endTime: "10:00" },
      { dayOfWeek: 3, startTime: "08:30", endTime: "10:00" },
    ],
    location: "科学楼A101",
    capacity: 60,
    enrolled: 45,
    prerequisites: [],
    department: "计算机科学系",
    isSwapable: true,
    semester: "2023秋季学期",
  },
  {
    _id: "4",
    code: "PHYS101",
    name: "物理学基础",
    description: "物理学基础课程，包括力学、热学和电磁学基础知识。",
    credits: 4,
    teacher: "刘教授",
    schedule: [
      { dayOfWeek: 1, startTime: "10:30", endTime: "12:00" },
      { dayOfWeek: 3, startTime: "10:30", endTime: "12:00" },
    ],
    location: "科学楼A201",
    capacity: 55,
    enrolled: 40,
    prerequisites: [],
    department: "物理系",
    isSwapable: true,
    semester: "2023秋季学期",
  },
  {
    _id: "3",
    code: "ENG301",
    name: "高级英语写作",
    description: "提高学生的英语写作技能，集中于论文写作和学术表达。",
    credits: 3,
    teacher: "王教授",
    schedule: [{ dayOfWeek: 5, startTime: "10:30", endTime: "12:00" }],
    location: "人文楼C303",
    capacity: 40,
    enrolled: 22,
    prerequisites: ["ENG201"],
    department: "英语系",
    isSwapable: true,
    semester: "2023秋季学期",
  },
];

// 颜色映射，用于区分不同课程
const courseColors = [
  "#1890ff",
  "#52c41a",
  "#722ed1",
  "#fa8c16",
  "#eb2f96",
  "#faad14",
  "#13c2c2",
  "#fadb14",
  "#a0d911",
  "#eb4034",
];

const SchedulePage = () => {
  const [enrolledCourses, setEnrolledCourses] =
    useState<Course[]>(mockEnrolledCourses);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  // 模拟从API获取数据
  useEffect(() => {
    // fetchEnrolledCourses();
  }, []);

  // 根据星期几获取该天的课程
  const getCoursesByDay = (day: number) => {
    return enrolledCourses.filter((course) =>
      course.schedule.some((s) => s.dayOfWeek === day),
    );
  };

  // 根据日期获取星期几（0-6，0表示周日）
  const getDayOfWeek = (date: Date) => {
    return date.getDay();
  };

  // 获取课程对应的颜色
  const getCourseColor = (courseId: string) => {
    const index = enrolledCourses.findIndex((c) => c._id === courseId);
    return courseColors[index % courseColors.length];
  };

  // 渲染日历单元格
  const dateCellRender = (date: dayjs.Dayjs) => {
    const day = date.day(); // 0-6，0表示周日
    const dayCourses = getCoursesByDay(day);

    if (dayCourses.length === 0) return null;

    return (
      <ul className="p-0 list-none">
        {dayCourses.map((course) => (
          <li key={course._id} className="mb-1">
            <Badge
              color={getCourseColor(course._id)}
              text={
                <span
                  className="text-xs cursor-pointer"
                  onClick={() => handleCourseClick(course)}
                >
                  {course.name.length > 6
                    ? `${course.name.substring(0, 6)}...`
                    : course.name}
                </span>
              }
            />
          </li>
        ))}
      </ul>
    );
  };

  // 处理课程点击
  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setDetailModalVisible(true);
  };

  // 准备周视图数据
  const weekDays = [1, 2, 3, 4, 5, 6, 0]; // 周一到周日，与dayjs一致
  const timeSlots = [
    "08:00-09:00",
    "09:00-10:00",
    "10:00-11:00",
    "11:00-12:00",
    "13:00-14:00",
    "14:00-15:00",
    "15:00-16:00",
    "16:00-17:00",
    "18:00-19:00",
    "19:00-20:00",
    "20:00-21:00",
  ];

  // 检查时间段是否有课程
  const checkCourseInTimeSlot = (day: number, timeSlot: string) => {
    const [slotStart, slotEnd] = timeSlot.split("-").map((t) => {
      const [hour, minute] = t.split(":").map(Number);
      return hour * 60 + minute; // 转换为分钟表示
    });

    return enrolledCourses.filter((course) => {
      return course.schedule.some((s) => {
        if (s.dayOfWeek !== day) return false;

        const [courseStartHour, courseStartMinute] = s.startTime
          .split(":")
          .map(Number);
        const [courseEndHour, courseEndMinute] = s.endTime
          .split(":")
          .map(Number);
        const courseStart = courseStartHour * 60 + courseStartMinute;
        const courseEnd = courseEndHour * 60 + courseEndMinute;

        // 检查是否有重叠
        return courseStart < slotEnd && courseEnd > slotStart;
      });
    });
  };

  return (
    <Layout>
      <div className="mb-8">
        <Title level={2}>我的课表</Title>
        <p className="text-gray-500">查看您的课程安排和上课时间</p>
      </div>

      <Tabs defaultActiveKey="week">
        <TabPane tab="周视图" key="week">
          <Card className="overflow-auto">
            <div className="min-w-[900px]">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2 bg-gray-50">时间 / 日期</th>
                    {weekDays.map((day) => (
                      <th key={day} className="border p-2 bg-gray-50 w-1/7">
                        {getDayOfWeekText(day)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((timeSlot) => (
                    <tr key={timeSlot}>
                      <td className="border p-2 text-center bg-gray-50">
                        {timeSlot}
                      </td>
                      {weekDays.map((day) => {
                        const coursesInSlot = checkCourseInTimeSlot(
                          day,
                          timeSlot,
                        );

                        return (
                          <td
                            key={`${day}-${timeSlot}`}
                            className="border p-1 h-16"
                          >
                            {coursesInSlot.length > 0 ? (
                              <div className="flex flex-col gap-1">
                                {coursesInSlot.map((course) => (
                                  <div
                                    key={course._id}
                                    className="text-white rounded p-1 cursor-pointer text-xs"
                                    style={{
                                      backgroundColor: getCourseColor(
                                        course._id,
                                      ),
                                    }}
                                    onClick={() => handleCourseClick(course)}
                                  >
                                    <div className="font-bold">
                                      {course.name}
                                    </div>
                                    <div>{course.location}</div>
                                  </div>
                                ))}
                              </div>
                            ) : null}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabPane>

        <TabPane tab="月视图" key="month">
          <Card>
            <Calendar
              cellRender={dateCellRender}
              onSelect={(date) => setSelectedDate(date.toDate())}
              locale="zh-cn"
            />
          </Card>
        </TabPane>

        <TabPane tab="课程列表" key="list">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrolledCourses.map((course) => (
              <Card
                key={course._id}
                className="h-full"
                hoverable
                onClick={() => handleCourseClick(course)}
              >
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-2">
                    <Title level={4} className="!mb-0">
                      {course.name}
                    </Title>
                    <Tag color="blue">{course.credits}学分</Tag>
                  </div>

                  <Text type="secondary" className="mb-2">
                    {course.code}
                  </Text>

                  <div className="flex flex-col gap-2 mt-auto">
                    <div className="flex items-center">
                      <TeamOutlined className="mr-2 text-gray-500" />
                      <Text>{course.teacher}</Text>
                    </div>

                    <div className="flex items-center">
                      <EnvironmentOutlined className="mr-2 text-gray-500" />
                      <Text>{course.location}</Text>
                    </div>

                    <div className="flex items-center">
                      <ClockCircleOutlined className="mr-2 text-gray-500" />
                      <div>
                        {course.schedule.map((s, index) => (
                          <div key={index}>
                            {getDayOfWeekText(s.dayOfWeek)} {s.startTime}-
                            {s.endTime}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabPane>
      </Tabs>

      {/* 课程详情模态框 */}
      {selectedCourse && (
        <Modal
          title="课程详情"
          open={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setDetailModalVisible(false)}>
              关闭
            </Button>,
          ]}
          width={600}
        >
          <Descriptions bordered column={1} className="mt-4">
            <Descriptions.Item label="课程名称">
              {selectedCourse.name}
            </Descriptions.Item>
            <Descriptions.Item label="课程代码">
              {selectedCourse.code}
            </Descriptions.Item>
            <Descriptions.Item label="教师">
              {selectedCourse.teacher}
            </Descriptions.Item>
            <Descriptions.Item label="学分">
              {selectedCourse.credits}
            </Descriptions.Item>
            <Descriptions.Item label="上课地点">
              {selectedCourse.location}
            </Descriptions.Item>
            <Descriptions.Item label="上课时间">
              {selectedCourse.schedule.map((s, index) => (
                <div key={index}>
                  {getDayOfWeekText(s.dayOfWeek)} {s.startTime}-{s.endTime}
                </div>
              ))}
            </Descriptions.Item>
            <Descriptions.Item label="院系">
              {selectedCourse.department}
            </Descriptions.Item>
            <Descriptions.Item label="描述">
              {selectedCourse.description}
            </Descriptions.Item>
          </Descriptions>
        </Modal>
      )}
    </Layout>
  );
};

export default SchedulePage;
