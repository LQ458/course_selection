"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  Row,
  Col,
  Tabs,
  Form,
  Input,
  Button,
  Divider,
  Avatar,
  List,
  Tag,
  Alert,
  Skeleton,
  Typography,
  Progress,
} from "antd";
import {
  UserOutlined,
  BookOutlined,
  EditOutlined,
  LockOutlined,
  MailOutlined,
  IdcardOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useTheme } from "../contexts/ThemeContext";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

type UserProfile = {
  id: string;
  name: string;
  email: string;
  studentId: string;
  grade: number;
  department: string;
  avatarUrl?: string;
  joinDate: string;
  gpa: number;
  weightedGpa: number;
  completedCredits: number;
  requiredCredits: number;
  enrolledCourses: EnrolledCourse[];
};

type EnrolledCourse = {
  id: string;
  name: string;
  courseType: "ap" | "honors" | "general" | "elective";
  credits: number;
  grade?: string;
  status: "completed" | "inProgress" | "upcoming";
};

// 模拟用户数据
const mockUserProfile: UserProfile = {
  id: "u123456",
  name: "张三",
  email: "zhangsan@example.com",
  studentId: "S20220001",
  grade: 11,
  department: "Science",
  joinDate: "2022-09-01",
  gpa: 3.8,
  weightedGpa: 4.2,
  completedCredits: 48,
  requiredCredits: 120,
  enrolledCourses: [
    {
      id: "c001",
      name: "AP Calculus BC",
      courseType: "ap",
      credits: 5,
      grade: "A",
      status: "completed",
    },
    {
      id: "c002",
      name: "Honors Physics",
      courseType: "honors",
      credits: 4,
      grade: "A-",
      status: "completed",
    },
    {
      id: "c003",
      name: "AP Chemistry",
      courseType: "ap",
      credits: 5,
      status: "inProgress",
    },
    {
      id: "c004",
      name: "English Literature",
      courseType: "general",
      credits: 3,
      status: "inProgress",
    },
    {
      id: "c005",
      name: "AP Computer Science",
      courseType: "ap",
      credits: 5,
      status: "inProgress",
    },
    {
      id: "c006",
      name: "World History",
      courseType: "general",
      credits: 3,
      status: "upcoming",
    },
    {
      id: "c007",
      name: "Art & Design",
      courseType: "elective",
      credits: 2,
      status: "upcoming",
    },
  ],
};

// 渲染课程类型标签
const renderCourseTypeTag = (courseType: string) => {
  switch (courseType) {
    case "ap":
      return <Tag className="ap-tag">AP</Tag>;
    case "honors":
      return <Tag className="honors-tag">Honors</Tag>;
    case "general":
      return <Tag className="general-tag">General</Tag>;
    case "elective":
      return <Tag className="elective-tag">Elective</Tag>;
    default:
      return null;
  }
};

// 渲染课程状态标签
const renderCourseStatusTag = (status: string, t: any) => {
  switch (status) {
    case "completed":
      return <Tag color="success">{t("courses.completed")}</Tag>;
    case "inProgress":
      return <Tag color="processing">{t("courses.inProgress")}</Tag>;
    case "upcoming":
      return <Tag color="default">{t("courses.upcoming")}</Tag>;
    default:
      return null;
  }
};

export default function ProfilePage() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  // 模拟加载数据
  useEffect(() => {
    setTimeout(() => {
      setProfile(mockUserProfile);
      setLoading(false);

      // 设置表单初始值
      form.setFieldsValue({
        name: mockUserProfile.name,
        email: mockUserProfile.email,
        studentId: mockUserProfile.studentId,
      });
    }, 1000);
  }, [form]);

  // 处理个人资料更新
  const handleProfileUpdate = (values: any) => {
    setLoading(true);

    // 模拟API调用
    setTimeout(() => {
      setProfile((prev) => (prev ? { ...prev, ...values } : null));
      setLoading(false);
      setUpdateSuccess(true);

      // 3秒后隐藏成功消息
      setTimeout(() => setUpdateSuccess(false), 3000);
    }, 1000);
  };

  // 处理密码更新
  const handlePasswordUpdate = (values: any) => {
    setLoading(true);

    // 模拟API调用
    setTimeout(() => {
      if (values.newPassword === values.confirmPassword) {
        setLoading(false);
        setUpdateSuccess(true);
        passwordForm.resetFields();

        // 3秒后隐藏成功消息
        setTimeout(() => setUpdateSuccess(false), 3000);
      } else {
        setLoading(false);
        setUpdateError(true);

        // 3秒后隐藏错误消息
        setTimeout(() => setUpdateError(false), 3000);
      }
    }, 1000);
  };

  const getGradeLabel = (grade: number) => {
    switch (grade) {
      case 9:
        return t("education.freshman");
      case 10:
        return t("education.sophomore");
      case 11:
        return t("education.junior");
      case 12:
        return t("education.senior");
      default:
        return `${t("education.grade")} ${grade}`;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Title level={2} className={theme === "dark" ? "dark:text-white" : ""}>
        {t("profile.title")}
      </Title>
      <Paragraph
        className={theme === "dark" ? "dark:text-gray-200" : "text-gray-700"}
      >
        {t("profile.subtitle")}
      </Paragraph>

      <Skeleton loading={loading} active avatar paragraph={{ rows: 4 }}>
        {profile && (
          <Row gutter={[24, 24]}>
            {/* 个人资料卡片 */}
            <Col xs={24} lg={8}>
              <Card className="course-card mb-6">
                <div className="text-center mb-6">
                  <Avatar
                    size={96}
                    icon={<UserOutlined />}
                    src={profile.avatarUrl}
                    className="mb-3"
                  />
                  <Title
                    level={3}
                    className={theme === "dark" ? "dark:text-white" : ""}
                  >
                    {profile.name}
                  </Title>
                  <Text
                    className={
                      theme === "dark" ? "dark:text-gray-300" : "text-gray-500"
                    }
                  >
                    {getGradeLabel(profile.grade)} • {profile.department}
                  </Text>
                </div>

                <Divider />

                <div>
                  <p>
                    <IdcardOutlined className="mr-2" />
                    <Text
                      strong
                      className={theme === "dark" ? "dark:text-gray-200" : ""}
                    >
                      {t("profile.studentId")}:
                    </Text>{" "}
                    <Text
                      className={theme === "dark" ? "dark:text-gray-300" : ""}
                    >
                      {profile.studentId}
                    </Text>
                  </p>
                  <p>
                    <MailOutlined className="mr-2" />
                    <Text
                      strong
                      className={theme === "dark" ? "dark:text-gray-200" : ""}
                    >
                      {t("profile.email")}:
                    </Text>{" "}
                    <Text
                      className={theme === "dark" ? "dark:text-gray-300" : ""}
                    >
                      {profile.email}
                    </Text>
                  </p>
                  <p>
                    <BookOutlined className="mr-2" />
                    <Text
                      strong
                      className={theme === "dark" ? "dark:text-gray-200" : ""}
                    >
                      {t("education.gpa")}:
                    </Text>{" "}
                    <Text
                      className={theme === "dark" ? "dark:text-gray-300" : ""}
                    >
                      {profile.gpa.toFixed(2)}
                    </Text>
                  </p>
                  <p>
                    <BookOutlined className="mr-2" />
                    <Text
                      strong
                      className={theme === "dark" ? "dark:text-gray-200" : ""}
                    >
                      {t("education.weightedGpa")}:
                    </Text>{" "}
                    <Text
                      className={theme === "dark" ? "dark:text-gray-300" : ""}
                    >
                      {profile.weightedGpa.toFixed(2)}
                    </Text>
                  </p>
                </div>

                <Divider />

                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <Text
                      className={theme === "dark" ? "dark:text-gray-200" : ""}
                    >
                      {t("profile.creditsProgress")}
                    </Text>
                    <Text
                      className={theme === "dark" ? "dark:text-gray-200" : ""}
                    >
                      {profile.completedCredits}/{profile.requiredCredits}
                    </Text>
                  </div>
                  <Progress
                    percent={Math.round(
                      (profile.completedCredits / profile.requiredCredits) *
                        100,
                    )}
                    status="active"
                    strokeColor={{ from: "#108ee9", to: "#87d068" }}
                  />
                </div>
              </Card>
            </Col>

            {/* 资料编辑标签页 */}
            <Col xs={24} lg={16}>
              <Card className="course-card">
                <Tabs defaultActiveKey="1">
                  <TabPane
                    tab={
                      <span>
                        <EditOutlined />
                        {t("profile.updateProfile")}
                      </span>
                    }
                    key="1"
                  >
                    {updateSuccess && (
                      <Alert
                        message={t("profile.updateSuccess")}
                        type="success"
                        showIcon
                        className="mb-4"
                      />
                    )}

                    <Form
                      form={form}
                      layout="vertical"
                      onFinish={handleProfileUpdate}
                    >
                      <Form.Item
                        name="name"
                        label={
                          <span
                            className={
                              theme === "dark" ? "dark:text-gray-200" : ""
                            }
                          >
                            {t("profile.name")}
                          </span>
                        }
                        rules={[
                          {
                            required: true,
                            message: t("profile.nameRequired"),
                          },
                        ]}
                      >
                        <Input prefix={<UserOutlined />} />
                      </Form.Item>

                      <Form.Item
                        name="email"
                        label={
                          <span
                            className={
                              theme === "dark" ? "dark:text-gray-200" : ""
                            }
                          >
                            {t("profile.email")}
                          </span>
                        }
                        rules={[
                          {
                            required: true,
                            message: t("profile.emailRequired"),
                          },
                          { type: "email", message: t("profile.emailInvalid") },
                        ]}
                      >
                        <Input prefix={<MailOutlined />} />
                      </Form.Item>

                      <Form.Item
                        name="studentId"
                        label={
                          <span
                            className={
                              theme === "dark" ? "dark:text-gray-200" : ""
                            }
                          >
                            {t("profile.studentId")}
                          </span>
                        }
                        rules={[
                          {
                            required: true,
                            message: t("profile.studentIdRequired"),
                          },
                        ]}
                      >
                        <Input prefix={<IdcardOutlined />} disabled />
                      </Form.Item>

                      <Form.Item>
                        <Button
                          type="primary"
                          htmlType="submit"
                          icon={<SaveOutlined />}
                          loading={loading}
                        >
                          {t("profile.saveChanges")}
                        </Button>
                      </Form.Item>
                    </Form>
                  </TabPane>

                  <TabPane
                    tab={
                      <span>
                        <LockOutlined />
                        {t("profile.updatePassword")}
                      </span>
                    }
                    key="2"
                  >
                    {updateSuccess && (
                      <Alert
                        message={t("profile.passwordUpdateSuccess")}
                        type="success"
                        showIcon
                        className="mb-4"
                      />
                    )}

                    {updateError && (
                      <Alert
                        message={t("profile.passwordUpdateError")}
                        type="error"
                        showIcon
                        className="mb-4"
                      />
                    )}

                    <Form
                      form={passwordForm}
                      layout="vertical"
                      onFinish={handlePasswordUpdate}
                    >
                      <Form.Item
                        name="currentPassword"
                        label={
                          <span
                            className={
                              theme === "dark" ? "dark:text-gray-200" : ""
                            }
                          >
                            {t("profile.currentPassword")}
                          </span>
                        }
                        rules={[
                          {
                            required: true,
                            message: t("profile.currentPasswordRequired"),
                          },
                        ]}
                      >
                        <Input.Password prefix={<LockOutlined />} />
                      </Form.Item>

                      <Form.Item
                        name="newPassword"
                        label={
                          <span
                            className={
                              theme === "dark" ? "dark:text-gray-200" : ""
                            }
                          >
                            {t("profile.newPassword")}
                          </span>
                        }
                        rules={[
                          {
                            required: true,
                            message: t("profile.newPasswordRequired"),
                          },
                          { min: 8, message: t("profile.passwordMinLength") },
                        ]}
                      >
                        <Input.Password prefix={<LockOutlined />} />
                      </Form.Item>

                      <Form.Item
                        name="confirmPassword"
                        label={
                          <span
                            className={
                              theme === "dark" ? "dark:text-gray-200" : ""
                            }
                          >
                            {t("profile.confirmPassword")}
                          </span>
                        }
                        rules={[
                          {
                            required: true,
                            message: t("profile.confirmPasswordRequired"),
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (
                                !value ||
                                getFieldValue("newPassword") === value
                              ) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                new Error(t("profile.passwordMismatch")),
                              );
                            },
                          }),
                        ]}
                      >
                        <Input.Password prefix={<LockOutlined />} />
                      </Form.Item>

                      <Form.Item>
                        <Button
                          type="primary"
                          htmlType="submit"
                          icon={<LockOutlined />}
                          loading={loading}
                        >
                          {t("profile.updatePassword")}
                        </Button>
                      </Form.Item>
                    </Form>
                  </TabPane>
                </Tabs>
              </Card>

              {/* 课程列表 */}
              <Card className="course-card mt-6">
                <Title
                  level={4}
                  className={theme === "dark" ? "dark:text-white" : ""}
                >
                  <BookOutlined className="mr-2" />
                  {t("profile.enrolledCourses")}
                </Title>

                <List
                  itemLayout="horizontal"
                  dataSource={profile.enrolledCourses}
                  renderItem={(item) => (
                    <List.Item
                      className={theme === "dark" ? "dark:border-gray-800" : ""}
                      actions={[
                        item.grade && (
                          <Text
                            strong
                            className={
                              theme === "dark" ? "dark:text-gray-200" : ""
                            }
                          >
                            {t("profile.grade")}: {item.grade}
                          </Text>
                        ),
                      ]}
                    >
                      <List.Item.Meta
                        title={
                          <div
                            className={
                              theme === "dark" ? "dark:text-white" : ""
                            }
                          >
                            {renderCourseTypeTag(item.courseType)} {item.name}
                          </div>
                        }
                        description={
                          <div
                            className={
                              theme === "dark"
                                ? "dark:text-gray-300"
                                : "text-gray-500"
                            }
                          >
                            {renderCourseStatusTag(item.status, t)}
                            <span className="ml-3">
                              {t("profile.credits")}: {item.credits}
                            </span>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
        )}
      </Skeleton>
    </div>
  );
}
