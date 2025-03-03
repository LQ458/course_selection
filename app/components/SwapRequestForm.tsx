import React, { useState, useEffect } from "react";
import { Form, Select, Input, Button, Steps, Card, Alert, message } from "antd";
import { Course, SwapStatus } from "../types";
import { isTimeConflict } from "../utils/timeUtils";
import axios from "axios";

const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;

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
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeConflict, setTimeConflict] = useState(false);

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

      const response = await axios.post("/api/swaps", {
        originalCourseId: values.originalCourseId,
        targetCourseId: targetCourse._id,
        reason: values.reason,
      });

      if (response.data.success) {
        message.success("换课申请提交成功");
        onSuccess();
      } else {
        message.error(response.data.error || "提交失败，请重试");
      }
    } catch (error: any) {
      message.error(error.response?.data?.error || "提交失败，请重试");
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
              label="选择要替换的课程"
              rules={[{ required: true, message: "请选择要替换的课程" }]}
            >
              <Select
                placeholder="请选择课程"
                onChange={handleCourseSelect}
                style={{ width: "100%" }}
              >
                {enrolledCourses.map((course) => (
                  <Option key={course._id} value={course._id}>
                    {course.name} - {course.teacher}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {selectedCourse && (
              <Card size="small" className="mt-4">
                <p>
                  <strong>课程名称:</strong> {selectedCourse.name}
                </p>
                <p>
                  <strong>教师:</strong> {selectedCourse.teacher}
                </p>
                <p>
                  <strong>地点:</strong> {selectedCourse.location}
                </p>
              </Card>
            )}

            {timeConflict && (
              <Alert
                message="时间冲突警告"
                description="您选择的课程与目标课程时间存在冲突，请确认是否继续申请。"
                type="warning"
                showIcon
                className="mt-4"
              />
            )}
          </div>
        );
      case 1:
        return (
          <div>
            <Form.Item
              name="reason"
              label="换课理由"
              rules={[
                { required: true, message: "请填写换课理由" },
                { min: 10, message: "理由不能少于10个字符" },
              ]}
            >
              <TextArea rows={6} placeholder="请详细说明您换课的原因..." />
            </Form.Item>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <Steps current={currentStep} className="mb-8">
        <Step title="选择课程" description="选择要替换的课程" />
        <Step title="填写理由" description="说明换课原因" />
        <Step title="完成" description="提交申请" />
      </Steps>

      <Form
        form={form}
        layout="vertical"
        initialValues={{ targetCourseId: targetCourse._id }}
      >
        <div className="mb-4">
          <Alert
            message={`目标课程: ${targetCourse.name} - ${targetCourse.teacher}`}
            type="info"
            showIcon
          />
        </div>

        {renderStepContent()}

        <div className="flex justify-end mt-6 space-x-2">
          {currentStep > 0 && <Button onClick={prevStep}>上一步</Button>}
          {currentStep < 1 ? (
            <Button type="primary" onClick={nextStep}>
              下一步
            </Button>
          ) : (
            <Button type="primary" onClick={nextStep} loading={loading}>
              提交申请
            </Button>
          )}
          <Button onClick={onCancel}>取消</Button>
        </div>
      </Form>
    </div>
  );
};

export default SwapRequestForm;
