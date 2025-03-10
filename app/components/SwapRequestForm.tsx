"use client";

import React, { useState, useEffect } from "react";
import {
  Form,
  Select,
  Input,
  Button,
  Steps,
  Card,
  Alert,
  message,
  Progress,
  Divider,
  Typography,
  Tag,
  Tooltip,
  Space,
} from "antd";
import {
  InfoCircleOutlined,
  ClockCircleOutlined,
  SwapOutlined,
  WarningOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Course } from "../types";
import { isTimeConflict, formatSchedule } from "../utils/timeUtils";
import { useTranslation } from "../hooks/useTranslation";
import axios from "axios";

const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

interface SwapRequestFormProps {
  targetCourse: Course;
  enrolledCourses: Course[];
  onSuccess: () => void;
  onCancel: () => void;
}

const SwapRequestForm: React.FC<SwapRequestFormProps> = ({
  targetCourse,
  enrolledCourses,
  onSuccess,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeConflict, setTimeConflict] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // 检查时间冲突
  useEffect(() => {
    if (selectedCourse && targetCourse) {
      const hasConflict = isTimeConflict(
        selectedCourse.schedule,
        targetCourse.schedule,
      );
      setTimeConflict(hasConflict);
    }
  }, [selectedCourse, targetCourse]);

  // 处理课程选择
  const handleCourseSelect = (courseId: string) => {
    const course = enrolledCourses.find((c) => c._id === courseId) || null;
    setSelectedCourse(course);

    // 如果有时间冲突，显示警告
    if (course) {
      const hasConflict = isTimeConflict(
        course.schedule,
        targetCourse.schedule,
      );
      setTimeConflict(hasConflict);
    }
  };

  // 下一步
  const nextStep = async () => {
    try {
      setSubmissionError(null);
      if (currentStep === 0) {
        // 验证第一步
        await form.validateFields(["originalCourseId"]);
        setCurrentStep(1);
      } else if (currentStep === 1) {
        // 验证第二步并提交
        await form.validateFields(["reason"]);
        submitForm();
      }
    } catch (error) {
      console.error("表单验证失败:", error);
    }
  };

  // 上一步
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // 提交表单
  const submitForm = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      setSubmissionError(null);

      // 实际应用中应使用API
      // 这里模拟API调用和响应
      setTimeout(() => {
        try {
          // 模拟成功响应
          message.success(t("swapRequest.successMessage"));
          onSuccess();
        } catch (error) {
          setSubmissionError(t("common.error"));
          message.error(t("common.error"));
        } finally {
          setLoading(false);
        }
      }, 1500);

      /* 实际API调用代码
      const response = await axios.post("/api/swaps", {
        originalCourseId: values.originalCourseId,
        targetCourseId: targetCourse._id,
        reason: values.reason,
      });

      if (response.data.success) {
        message.success(t('swapRequest.successMessage'));
        onSuccess();
      } else {
        setSubmissionError(response.data.error || t('common.error'));
        message.error(response.data.error || t('common.error'));
      }
      */
    } catch (error: any) {
      setSubmissionError(error.response?.data?.error || t("common.error"));
      message.error(error.response?.data?.error || t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  // 渲染步骤内容
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div>
            <Form.Item
              name="originalCourseId"
              label={t("swapRequest.selectCourse")}
              rules={[
                {
                  required: true,
                  message: t("swapRequest.validation.selectCourse"),
                },
              ]}
              tooltip={t("swapRequest.steps.selectCourseDesc")}
            >
              <Select
                placeholder={t("swapRequest.selectCoursePlaceholder")}
                onChange={handleCourseSelect}
                style={{ width: "100%" }}
                suffixIcon={<SwapOutlined />}
                showSearch
                optionFilterProp="children"
              >
                {enrolledCourses.map((course) => (
                  <Option key={course._id} value={course._id}>
                    {course.name} - {course.teacher}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {selectedCourse && (
              <Card
                size="small"
                className="mt-4"
                title={
                  <div className="flex justify-between items-center">
                    <span>{t("courseDetail.title")}</span>
                    <Tag color="blue">
                      {selectedCourse.credits} {t("courses.credits")}
                    </Tag>
                  </div>
                }
              >
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Text strong>{selectedCourse.name}</Text>
                    <Text type="secondary">{selectedCourse.code}</Text>
                  </div>
                  <p>
                    <strong>{t("courses.teacherInfo")}:</strong>{" "}
                    {selectedCourse.teacher}
                  </p>
                  <p>
                    <strong>{t("courses.location")}:</strong>{" "}
                    {selectedCourse.location}
                  </p>
                  <p>
                    <strong>{t("courses.schedule")}:</strong>
                  </p>
                  <ul className="list-disc pl-5">
                    {selectedCourse.schedule.map((s, index) => (
                      <li key={index}>{formatSchedule(s)}</li>
                    ))}
                  </ul>
                </div>
              </Card>
            )}

            <Divider />

            <Card
              title={
                <Space>
                  <span>{t("swapRequest.targetCourse")}</span>
                  <Tag color="green">
                    {targetCourse.credits} {t("courses.credits")}
                  </Tag>
                </Space>
              }
              size="small"
              className="mt-4"
            >
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Text strong>{targetCourse.name}</Text>
                  <Text type="secondary">{targetCourse.code}</Text>
                </div>
                <p>
                  <strong>{t("courses.teacherInfo")}:</strong>{" "}
                  {targetCourse.teacher}
                </p>
                <p>
                  <strong>{t("courses.location")}:</strong>{" "}
                  {targetCourse.location}
                </p>
                <p>
                  <strong>{t("courses.schedule")}:</strong>
                </p>
                <ul className="list-disc pl-5">
                  {targetCourse.schedule.map((s, index) => (
                    <li key={index}>{formatSchedule(s)}</li>
                  ))}
                </ul>
              </div>
            </Card>

            {timeConflict && (
              <Alert
                message={t("swapRequest.timeConflict")}
                description={t("swapRequest.timeConflictDesc")}
                type="warning"
                showIcon
                icon={<ClockCircleOutlined />}
                className="mt-4"
              />
            )}
          </div>
        );
      case 1:
        return (
          <div>
            <Alert
              message={
                <Space>
                  <InfoCircleOutlined />
                  <span>{t("courseDetail.swapNotice")}</span>
                </Space>
              }
              description={
                <ul className="list-disc pl-5 mt-2">
                  {t("courseDetail.swapNoticeItems").map(
                    (item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ),
                  )}
                </ul>
              }
              type="info"
              className="mb-6"
            />

            <Form.Item
              name="reason"
              label={t("swapRequest.reason")}
              rules={[
                { required: true, message: t("swapRequest.reasonRequired") },
                { min: 10, message: t("swapRequest.reasonMinLength") },
              ]}
              tooltip={t("swapRequest.steps.fillReasonDesc")}
            >
              <TextArea
                rows={6}
                placeholder={t("swapRequest.reasonPlaceholder")}
                showCount
                maxLength={500}
              />
            </Form.Item>

            {submissionError && (
              <Alert
                message={t("common.error")}
                description={submissionError}
                type="error"
                showIcon
                className="mt-4"
              />
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <Steps current={currentStep} className="mb-8">
        <Step
          title={t("swapRequest.steps.selectCourse")}
          description={t("swapRequest.steps.selectCourseDesc")}
          icon={currentStep === 0 ? <SwapOutlined /> : undefined}
        />
        <Step
          title={t("swapRequest.steps.fillReason")}
          description={t("swapRequest.steps.fillReasonDesc")}
          icon={currentStep === 1 ? <InfoCircleOutlined /> : undefined}
        />
        <Step
          title={t("swapRequest.steps.submitRequest")}
          description={t("swapRequest.steps.submitRequestDesc")}
          icon={<CheckCircleOutlined />}
        />
      </Steps>

      <Progress
        percent={(currentStep + 1) * 33}
        showInfo={false}
        className="mb-8"
        strokeColor="#1890ff"
      />

      <Form
        form={form}
        layout="vertical"
        initialValues={{ targetCourseId: targetCourse._id }}
        scrollToFirstError
      >
        <Title level={4} className="mb-6">
          {t("swapRequest.title")}
        </Title>

        {renderStepContent()}

        <div className="flex justify-end mt-6 space-x-2">
          {currentStep > 0 && (
            <Button onClick={prevStep} disabled={loading}>
              {t("common.back")}
            </Button>
          )}
          {currentStep < 1 ? (
            <Button type="primary" onClick={nextStep}>
              {t("common.submit")}
            </Button>
          ) : (
            <Button type="primary" onClick={nextStep} loading={loading}>
              {t("swapRequest.steps.submitRequest")}
            </Button>
          )}
          <Button onClick={onCancel} disabled={loading}>
            {t("common.cancel")}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default SwapRequestForm;
