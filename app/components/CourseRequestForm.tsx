"use client";

import React, { useState } from "react";
import {
  Form,
  Select,
  Checkbox,
  Input,
  Button,
  Card,
  Alert,
  message,
  Space,
  Divider,
  Typography,
} from "antd";
import {
  SwapOutlined,
  InfoCircleOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Course } from "../types";
import { useTranslation } from "../hooks/useTranslation";

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

interface CourseRequestFormProps {
  availableCourses: Course[];
  enrolledCourses: Course[];
  onSuccess: () => void;
  onCancel: () => void;
}

const CourseRequestForm: React.FC<CourseRequestFormProps> = ({
  availableCourses,
  enrolledCourses,
  onSuccess,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedCoursesToRemove, setSelectedCoursesToRemove] = useState<
    string[]
  >([]);
  const [selectedCoursesToAdd, setSelectedCoursesToAdd] = useState<string[]>(
    [],
  );

  // 提交表单
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // Here you can add API call to submit form data
      console.log("Form data:", values);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      message.success(t("courseRequest.successMessage"));
      onSuccess();
    } catch (error) {
      console.error("Submission failed:", error);
      message.error(t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  // 处理课程选择变化
  const handleCourseToRemoveChange = (value: string[]) => {
    setSelectedCoursesToRemove(value);
  };

  const handleCourseToAddChange = (value: string[]) => {
    setSelectedCoursesToAdd(value);
  };

  return (
    <Card className="course-request-form">
      <Title level={4} className="mb-4">
        {t("courseRequest.title")}
      </Title>
      <Divider />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark="optional"
      >
        {/* 要替换/删除的课程 */}
        <Form.Item
          name="coursesToRemove"
          label={t("courseRequest.coursesToRemove")}
          rules={[
            {
              required: true,
              message: t("courseRequest.validation.coursesToRemoveRequired"),
            },
          ]}
          tooltip={t("courseRequest.tooltip.coursesToRemove")}
        >
          <Select
            mode="multiple"
            placeholder={t("courseRequest.placeholder.coursesToRemove")}
            onChange={handleCourseToRemoveChange}
            optionFilterProp="children"
            style={{ width: "100%" }}
          >
            {enrolledCourses.map((course) => (
              <Option key={course._id} value={course._id}>
                {course.code} - {course.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* 要添加的课程 */}
        <Form.Item
          name="coursesToAdd"
          label={t("courseRequest.coursesToAdd")}
          rules={[
            {
              required: true,
              message: t("courseRequest.validation.coursesToAddRequired"),
            },
          ]}
          tooltip={t("courseRequest.tooltip.coursesToAdd")}
        >
          <Select
            mode="multiple"
            placeholder={t("courseRequest.placeholder.coursesToAdd")}
            onChange={handleCourseToAddChange}
            optionFilterProp="children"
            style={{ width: "100%" }}
          >
            {availableCourses
              .filter(
                (course) =>
                  !enrolledCourses.some(
                    (enrolled) => enrolled._id === course._id,
                  ),
              )
              .map((course) => (
                <Option key={course._id} value={course._id}>
                  {course.code} - {course.name}
                </Option>
              ))}
          </Select>
        </Form.Item>

        {/* 确认已阅读先决条件 */}
        <Form.Item
          name="confirmPrerequisites"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(
                      new Error(
                        t("courseRequest.validation.confirmPrerequisites"),
                      ),
                    ),
            },
          ]}
        >
          <Checkbox>{t("courseRequest.confirmPrerequisites")}</Checkbox>
        </Form.Item>

        {/* 附加说明 */}
        <Form.Item
          name="additionalNotes"
          label={t("courseRequest.additionalNotes")}
          tooltip={t("courseRequest.tooltip.additionalNotes")}
        >
          <TextArea
            rows={4}
            placeholder={t("courseRequest.placeholder.additionalNotes")}
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Alert
          message={t("courseRequest.noteTitle")}
          description={t("courseRequest.noteDescription")}
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
          className="mb-4"
        />

        <Form.Item className="mb-0">
          <div className="flex justify-end gap-2">
            <Button onClick={onCancel}>{t("common.cancel")}</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SendOutlined />}
            >
              {t("courseRequest.submit")}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CourseRequestForm;
