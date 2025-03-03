"use client";

import React, { useState, useEffect } from "react";
import {
  Typography,
  Input,
  Select,
  Empty,
  Spin,
  Card,
  Row,
  Col,
  Button,
  Pagination,
  Modal,
  message,
} from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import Layout from "../components/Layout";
import CourseCard from "../components/CourseCard";
import CourseDetailModal from "../components/CourseDetailModal";
import SwapRequestForm from "../components/SwapRequestForm";
import { Course } from "../types";
import axios from "axios";

const { Title } = Typography;
const { Option } = Select;

// 模拟数据，实际应从API获取
const mockCourses: Course[] = [
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
    _id: "2",
    code: "MATH201",
    name: "微积分II",
    description: "高等微积分课程，包括多变量微积分、向量分析和微分方程。",
    credits: 4,
    teacher: "李教授",
    schedule: [
      { dayOfWeek: 2, startTime: "13:30", endTime: "15:00" },
      { dayOfWeek: 4, startTime: "13:30", endTime: "15:00" },
    ],
    location: "科学楼B202",
    capacity: 50,
    enrolled: 48,
    prerequisites: ["MATH101"],
    department: "数学系",
    isSwapable: false,
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

// 用户已选课程（模拟数据）
const mockEnrolledCourses: Course[] = [
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
];

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(mockCourses);
  const [searchTerm, setSearchTerm] = useState("");
  const [department, setDepartment] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSwapForm, setShowSwapForm] = useState(false);
  const [enrolledCourses, setEnrolledCourses] =
    useState<Course[]>(mockEnrolledCourses);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  // 模拟从API获取数据
  useEffect(() => {
    // 实际应用中，这里应该从API获取数据
    // fetchCourses();
    // fetchEnrolledCourses();
  }, []);

  // 筛选课程
  useEffect(() => {
    let result = courses;

    if (searchTerm) {
      result = result.filter(
        (course) =>
          course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.teacher.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (department) {
      result = result.filter((course) => course.department === department);
    }

    setFilteredCourses(result);
    setCurrentPage(1);
  }, [searchTerm, department, courses]);

  // 获取所有院系（用于筛选）
  const departments = Array.from(
    new Set(courses.map((course) => course.department)),
  );

  // 查看课程详情
  const handleViewCourse = (course: Course) => {
    setSelectedCourse(course);
    setShowDetailModal(true);
  };

  // 申请换课
  const handleSwapRequest = () => {
    if (selectedCourse) {
      setShowDetailModal(false);
      setShowSwapForm(true);
    }
  };

  // 换课申请成功
  const handleSwapSuccess = () => {
    setShowSwapForm(false);
    message.success("换课申请已提交，请等待审批");
  };

  // 分页设置
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <Layout>
      <div className="mb-8">
        <Title level={2}>课程列表</Title>
        <p className="text-gray-500">浏览所有可用课程，查看详情或申请换课</p>
      </div>

      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="搜索课程名称、代码或教师"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<SearchOutlined />}
            className="flex-1"
          />

          <Select
            placeholder="院系筛选"
            allowClear
            style={{ minWidth: 180 }}
            onChange={(value) => setDepartment(value)}
            value={department}
          >
            {departments.map((dept) => (
              <Option key={dept} value={dept}>
                {dept}
              </Option>
            ))}
          </Select>
        </div>
      </Card>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spin size="large" />
        </div>
      ) : filteredCourses.length > 0 ? (
        <>
          <Row gutter={[16, 16]}>
            {paginatedCourses.map((course) => (
              <Col xs={24} sm={12} lg={8} key={course._id}>
                <CourseCard
                  course={course}
                  onClick={() => handleViewCourse(course)}
                />
              </Col>
            ))}
          </Row>

          <div className="mt-6 flex justify-center">
            <Pagination
              current={currentPage}
              total={filteredCourses.length}
              pageSize={pageSize}
              onChange={setCurrentPage}
              showSizeChanger={false}
            />
          </div>
        </>
      ) : (
        <Empty description="没有找到匹配的课程" className="py-10" />
      )}

      {/* 课程详情模态框 */}
      {selectedCourse && (
        <CourseDetailModal
          course={selectedCourse}
          open={showDetailModal}
          onClose={() => setShowDetailModal(false)}
        />
      )}

      {/* 换课申请表单 */}
      {selectedCourse && (
        <Modal
          title="申请换课"
          open={showSwapForm}
          onCancel={() => setShowSwapForm(false)}
          footer={null}
          width={700}
        >
          <SwapRequestForm
            targetCourse={selectedCourse}
            enrolledCourses={enrolledCourses}
            onSuccess={handleSwapSuccess}
            onCancel={() => setShowSwapForm(false)}
          />
        </Modal>
      )}
    </Layout>
  );
};

export default CoursesPage;
