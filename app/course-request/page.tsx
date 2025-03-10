"use client";

import React, { useState, useEffect } from "react";
import { Typography, Button, Modal, Spin, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Layout from "../components/Layout";
import CourseRequestForm from "../components/CourseRequestForm";
import { Course } from "../types";
import { useTranslation } from "../hooks/useTranslation";

const { Title, Paragraph } = Typography;

// 模拟数据
const mockAvailableCourses: Course[] = [
  {
    _id: "1",
    code: "CS101",
    name: "Introduction to Computer Science",
    description:
      "A foundational course in computer science covering systems, algorithms, and programming basics.",
    credits: 3,
    teacher: "Prof. Zhang",
    schedule: [
      { dayOfWeek: 1, startTime: "08:30", endTime: "10:00" },
      { dayOfWeek: 3, startTime: "08:30", endTime: "10:00" },
    ],
    location: "Science Building A101",
    capacity: 60,
    enrolled: 45,
    prerequisites: [],
    department: "Computer Science",
    isSwapable: true,
    semester: "Fall 2023",
  },
  {
    _id: "2",
    code: "MATH201",
    name: "Calculus II",
    description:
      "Advanced calculus course covering multivariable calculus, vector analysis, and differential equations.",
    credits: 4,
    teacher: "Prof. Li",
    schedule: [
      { dayOfWeek: 2, startTime: "13:30", endTime: "15:00" },
      { dayOfWeek: 4, startTime: "13:30", endTime: "15:00" },
    ],
    location: "Science Building B202",
    capacity: 50,
    enrolled: 48,
    prerequisites: ["MATH101"],
    department: "Mathematics",
    isSwapable: false,
    semester: "Fall 2023",
  },
  {
    _id: "3",
    code: "ENG301",
    name: "Advanced English Writing",
    description:
      "Enhances students' English writing skills with a focus on essay composition and academic expression.",
    credits: 3,
    teacher: "Prof. Wang",
    schedule: [{ dayOfWeek: 5, startTime: "10:30", endTime: "12:00" }],
    location: "Humanities Building C303",
    capacity: 40,
    enrolled: 22,
    prerequisites: ["ENG201"],
    department: "English",
    isSwapable: true,
    semester: "Fall 2023",
  },
  {
    _id: "5",
    code: "PHYS202",
    name: "Electromagnetism",
    description:
      "An important branch of physics studying electric fields, magnetic fields, and their interactions.",
    credits: 4,
    teacher: "Prof. Zhao",
    schedule: [
      { dayOfWeek: 2, startTime: "10:30", endTime: "12:00" },
      { dayOfWeek: 4, startTime: "10:30", endTime: "12:00" },
    ],
    location: "Science Building A201",
    capacity: 40,
    enrolled: 35,
    prerequisites: ["PHYS101"],
    department: "Physics",
    isSwapable: true,
    semester: "Fall 2023",
  },
  {
    _id: "6",
    code: "CHEM101",
    name: "General Chemistry",
    description:
      "Introduction to chemical principles and applications, including material structure, chemical reactions, and thermodynamics.",
    credits: 4,
    teacher: "Prof. Qian",
    schedule: [
      { dayOfWeek: 1, startTime: "13:30", endTime: "15:00" },
      { dayOfWeek: 3, startTime: "13:30", endTime: "15:00" },
    ],
    location: "Science Building B101",
    capacity: 60,
    enrolled: 50,
    prerequisites: [],
    department: "Chemistry",
    isSwapable: true,
    semester: "Fall 2023",
  },
];

const mockEnrolledCourses: Course[] = [
  {
    _id: "4",
    code: "PHYS101",
    name: "Fundamentals of Physics",
    description:
      "Basic physics course covering mechanics, thermodynamics, and fundamentals of electromagnetism.",
    credits: 4,
    teacher: "Prof. Liu",
    schedule: [
      { dayOfWeek: 1, startTime: "10:30", endTime: "12:00" },
      { dayOfWeek: 3, startTime: "10:30", endTime: "12:00" },
    ],
    location: "Science Building A201",
    capacity: 55,
    enrolled: 40,
    prerequisites: [],
    department: "Physics",
    isSwapable: true,
    semester: "Fall 2023",
  },
  {
    _id: "7",
    code: "HIST101",
    name: "World History Survey",
    description:
      "Introduction to the historical development of major civilizations and significant historical events.",
    credits: 3,
    teacher: "Prof. Sun",
    schedule: [{ dayOfWeek: 2, startTime: "15:30", endTime: "17:00" }],
    location: "Humanities Building B203",
    capacity: 80,
    enrolled: 65,
    prerequisites: [],
    department: "History",
    isSwapable: true,
    semester: "Fall 2023",
  },
];

const CourseRequestPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [availableCourses, setAvailableCourses] =
    useState<Course[]>(mockAvailableCourses);
  const [enrolledCourses, setEnrolledCourses] =
    useState<Course[]>(mockEnrolledCourses);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 模拟从API获取数据
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // In a real application, you would call the API here
        // const availableCoursesResponse = await axios.get('/api/courses');
        // const enrolledCoursesResponse = await axios.get('/api/user/courses');
        // setAvailableCourses(availableCoursesResponse.data);
        // setEnrolledCourses(enrolledCoursesResponse.data);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        setAvailableCourses(mockAvailableCourses);
        setEnrolledCourses(mockEnrolledCourses);
      } catch (error) {
        console.error("Failed to fetch course data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 打开表单模态框
  const showModal = () => {
    setIsModalOpen(true);
  };

  // 关闭表单模态框
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // 处理表单提交成功
  const handleSuccess = () => {
    setIsModalOpen(false);
    // 可以在这里重新获取数据或更新状态
  };

  return (
    <Layout>
      <div className="mb-8">
        <Title level={2} className="text-gray-800 dark:text-gray-100">
          {t("courseRequest.pageTitle")}
        </Title>
        <Paragraph className="text-gray-600 dark:text-gray-300">
          {t("courseRequest.pageDescription")}
        </Paragraph>
      </div>

      <div className="mb-6 flex justify-end">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showModal}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {t("courseRequest.newRequest")}
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <Spin size="large" />
          <p className="mt-4">{t("common.loading")}</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <Space direction="vertical" className="w-full">
            <Title level={4} className="text-gray-800 dark:text-gray-100">
              {t("courseRequest.currentCourses")}
            </Title>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {enrolledCourses.map((course) => (
                <div
                  key={course._id}
                  className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        {course.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {course.code} | {course.credits} {t("courses.credits")}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">
                    {t("courses.teacherInfo")}: {course.teacher}
                  </p>
                </div>
              ))}
            </div>
          </Space>
        </div>
      )}

      <Modal
        title={t("courseRequest.modalTitle")}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={700}
      >
        <CourseRequestForm
          availableCourses={availableCourses}
          enrolledCourses={enrolledCourses}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </Modal>
    </Layout>
  );
};

export default CourseRequestPage;
