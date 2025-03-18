"use client";

import React from "react";
import {
  Button,
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Tag,
  Divider,
} from "antd";
import {
  BookOutlined,
  CalendarOutlined,
  TrophyOutlined,
  RocketOutlined,
  ExperimentOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useTranslation } from "./hooks/useTranslation";
import { useAuth } from "./hooks/useAuth";
import { useTheme } from "./contexts/ThemeContext";

const { Title, Text, Paragraph } = Typography;

// 示例AP课程数据
const featureCourses = [
  {
    id: 1,
    name: "AP Calculus BC",
    type: "ap",
    description:
      "Advanced Placement calculus course covering limits, derivatives, integrals, and series.",
    credits: 5,
  },
  {
    id: 2,
    name: "AP Physics C: Mechanics",
    type: "ap",
    description:
      "College-level physics course focused on mechanics, including kinematics, Newton's laws, and energy.",
    credits: 5,
  },
  {
    id: 3,
    name: "Honors World Literature",
    type: "honors",
    description:
      "An honors-level course examining major literary works from various cultures and historical periods.",
    credits: 4,
  },
  {
    id: 4,
    name: "AP Computer Science A",
    type: "ap",
    description:
      "Advanced programming course using Java, covering object-oriented design, algorithms, and data structures.",
    credits: 5,
  },
];

// 课程类型标签颜色
const courseTypeColor = {
  ap: "#f44336",
  honors: "#9c27b0",
  general: "#2196f3",
  elective: "#4caf50",
};

export default function Home() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();

  // 根据主题设置样式类名
  const textClass = theme === "dark" ? "dark:text-white" : "";
  const secondaryTextClass =
    theme === "dark" ? "dark:text-gray-300" : "text-gray-700";

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 主横幅 */}
      <div className="text-center mb-16">
        <Title level={1} className={textClass}>
          {t("home.title")}
        </Title>
        <Paragraph
          className={`text-lg max-w-3xl mx-auto mb-8 ${secondaryTextClass}`}
        >
          {t("home.subtitle")}
        </Paragraph>
        {!isAuthenticated && (
          <div className="space-x-4">
            <Link href="/login">
              <Button type="primary" size="large">
                {t("nav.login")}
              </Button>
            </Link>
            <Link href="/register">
              <Button size="large">{t("nav.register")}</Button>
            </Link>
          </div>
        )}
      </div>

      {/* 统计数据 */}
      <Row gutter={[24, 24]} className="mb-16">
        <Col xs={24} sm={12} md={6}>
          <Card className="text-center course-card">
            <Statistic
              title={
                <span className={secondaryTextClass}>
                  {t("home.totalCourses")}
                </span>
              }
              value={220}
              prefix={<BookOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="text-center course-card">
            <Statistic
              title={
                <span className={secondaryTextClass}>
                  {t("home.apCourses")}
                </span>
              }
              value={38}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: "#f5222d" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="text-center course-card">
            <Statistic
              title={
                <span className={secondaryTextClass}>
                  {t("home.honorsCourses")}
                </span>
              }
              value={42}
              prefix={<RocketOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="text-center course-card">
            <Statistic
              title={
                <span className={secondaryTextClass}>
                  {t("home.electiveCourses")}
                </span>
              }
              value={55}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: "#13c2c2" }}
            />
          </Card>
        </Col>
      </Row>

      {/* 特色课程 */}
      <div className="mb-16">
        <Title level={2} className={`text-center mb-8 ${textClass}`}>
          {t("home.featuredCourses")}
        </Title>
        <Row gutter={[24, 24]}>
          {featureCourses.map((course) => (
            <Col xs={24} sm={12} md={6} key={course.id}>
              <Card
                title={
                  <div className={textClass}>
                    <Tag
                      color={
                        courseTypeColor[
                          course.type as keyof typeof courseTypeColor
                        ]
                      }
                      className="mb-2"
                    >
                      {t(`courses.${course.type}`).toUpperCase()}
                    </Tag>
                    <div>{course.name}</div>
                  </div>
                }
                hoverable
                className="h-full course-card"
              >
                <Text className={secondaryTextClass}>{course.description}</Text>
                <div className="mt-4 flex justify-between items-center">
                  <Tag color="blue">
                    {t("courses.credits")}: {course.credits}
                  </Tag>
                  <Link href={`/courses/${course.id}`}>
                    <Button type="link">{t("home.learnMore")}</Button>
                  </Link>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* 国际高中教育特点 */}
      <div className="mb-16">
        <Title level={2} className={`text-center mb-8 ${textClass}`}>
          {t("home.internationalEducation")}
        </Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <Card
              className="h-full course-card"
              title={
                <span className={textClass}>{t("education.apProgram")}</span>
              }
              extra={
                <ExperimentOutlined
                  style={{ fontSize: 20, color: "#f44336" }}
                />
              }
            >
              <Paragraph className={secondaryTextClass}>
                {t("education.apProgramDesc")}
              </Paragraph>
              <Divider />
              <div className="flex flex-wrap gap-2">
                <Tag color="red">AP Calculus BC</Tag>
                <Tag color="red">AP Physics C</Tag>
                <Tag color="red">AP Chemistry</Tag>
                <Tag color="red">AP Biology</Tag>
                <Tag color="red">AP Computer Science</Tag>
                <Tag color="red">AP English Literature</Tag>
              </div>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card
              className="h-full course-card"
              title={
                <span className={textClass}>
                  {t("education.honorsProgram")}
                </span>
              }
              extra={
                <BarChartOutlined style={{ fontSize: 20, color: "#9c27b0" }} />
              }
            >
              <Paragraph className={secondaryTextClass}>
                {t("education.honorsProgramDesc")}
              </Paragraph>
              <Divider />
              <div className="flex flex-wrap gap-2">
                <Tag color="purple">Honors Pre-Calculus</Tag>
                <Tag color="purple">Honors Chemistry</Tag>
                <Tag color="purple">Honors World Literature</Tag>
                <Tag color="purple">Honors U.S. History</Tag>
                <Tag color="purple">Honors Economics</Tag>
              </div>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card
              className="h-full course-card"
              title={
                <span className={textClass}>
                  {t("education.electiveProgram")}
                </span>
              }
              extra={
                <RocketOutlined style={{ fontSize: 20, color: "#4caf50" }} />
              }
            >
              <Paragraph className={secondaryTextClass}>
                {t("education.electiveProgramDesc")}
              </Paragraph>
              <Divider />
              <div className="flex flex-wrap gap-2">
                <Tag color="green">Digital Media Arts</Tag>
                <Tag color="green">Music Theory</Tag>
                <Tag color="green">Entrepreneurship</Tag>
                <Tag color="green">Psychology</Tag>
                <Tag color="green">Public Speaking</Tag>
                <Tag color="green">Web Development</Tag>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {/* 系统特点 */}
      <div>
        <Title level={2} className={`text-center mb-8 ${textClass}`}>
          {t("home.systemFeatures")}
        </Title>
        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} md={8}>
            <Card className="h-full course-card">
              <div className="text-center mb-4">
                <CalendarOutlined style={{ fontSize: 48, color: "#1890ff" }} />
              </div>
              <Title level={4} className={`text-center ${textClass}`}>
                {t("home.scheduleFeature")}
              </Title>
              <Paragraph className={`text-center ${secondaryTextClass}`}>
                {t("home.scheduleFeatureDesc")}
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className="h-full course-card">
              <div className="text-center mb-4">
                <BookOutlined style={{ fontSize: 48, color: "#52c41a" }} />
              </div>
              <Title level={4} className={`text-center ${textClass}`}>
                {t("home.courseFeature")}
              </Title>
              <Paragraph className={`text-center ${secondaryTextClass}`}>
                {t("home.courseFeatureDesc")}
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className="h-full course-card">
              <div className="text-center mb-4">
                <RocketOutlined style={{ fontSize: 48, color: "#722ed1" }} />
              </div>
              <Title level={4} className={`text-center ${textClass}`}>
                {t("home.requestFeature")}
              </Title>
              <Paragraph className={`text-center ${secondaryTextClass}`}>
                {t("home.requestFeatureDesc")}
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
