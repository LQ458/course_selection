import React from "react";
import { Modal, Typography, Descriptions, Divider, Tag, Alert } from "antd";
import { Course } from "../types";

const { Title, Paragraph, Text } = Typography;

// 将数字转换为星期几
const getDayOfWeekText = (day: number) => {
  const days = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  return days[day] || "";
};

interface CourseDetailModalProps {
  course: Course & { remainingSeats?: number };
  open: boolean;
  onClose: () => void;
}

const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  open,
  onClose,
}) => {
  const {
    name,
    teacher,
    description,
    schedule,
    location,
    capacity,
    enrolled,
    isSwapable,
  } = course;
  const remainingSeats =
    course.remainingSeats !== undefined
      ? course.remainingSeats
      : capacity - enrolled;

  return (
    <Modal
      title={<Title level={4}>{name}</Title>}
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Descriptions column={2} bordered>
        <Descriptions.Item label="教师">{teacher}</Descriptions.Item>
        <Descriptions.Item label="地点">{location}</Descriptions.Item>
        <Descriptions.Item label="容量">{`${enrolled}/${capacity} (剩余: ${remainingSeats})`}</Descriptions.Item>
        <Descriptions.Item label="状态">
          <Tag color={isSwapable ? "green" : "red"}>
            {isSwapable ? "可换课" : "不可换课"}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="上课时间" span={2}>
          {schedule.map((s, index) => (
            <div key={index}>
              {getDayOfWeekText(s.dayOfWeek)} {s.startTime}-{s.endTime}
            </div>
          ))}
        </Descriptions.Item>
      </Descriptions>

      <Divider orientation="left">课程简介</Divider>
      <Paragraph>{description}</Paragraph>

      <Divider orientation="left">换课规则</Divider>
      <Alert
        message="换课申请须知"
        description={
          <ul className="list-disc pl-5">
            <li>换课申请提交后需等待管理员审批，请耐心等待</li>
            <li>审批通过后，系统将自动更新您的选课记录</li>
            <li>每门课程每学期仅允许换课一次</li>
            <li>换课申请一旦被拒绝，需重新提交申请</li>
            <li>目标课程必须有剩余名额才能申请换课</li>
          </ul>
        }
        type="info"
        showIcon
      />
    </Modal>
  );
};

export default CourseDetailModal;
