"use client";

import React, { useState, useEffect } from "react";
import {
  Typography,
  Table,
  Tag,
  Button,
  Space,
  Modal,
  Form,
  Radio,
  Input,
  message,
  Spin,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import Layout from "@/app/components/Layout";
import { SwapRequest } from "@/app/types";
import axios from "axios";

const { Title } = Typography;
const { TextArea } = Input;

// 模拟数据
const mockRequests: SwapRequest[] = [
  {
    _id: "1",
    studentId: "ST001",
    studentName: "张三",
    fromCourseId: "1",
    fromCourseName: "计算机科学导论",
    toCourseId: "2",
    toCourseName: "微积分II",
    reason: "我对微积分更感兴趣，而且时间安排更适合我的日程",
    status: "pending",
    createdAt: "2023-08-10T10:30:00Z",
    updatedAt: "2023-08-10T10:30:00Z",
  },
  {
    _id: "2",
    studentId: "ST002",
    studentName: "李四",
    fromCourseId: "3",
    fromCourseName: "高级英语写作",
    toCourseId: "1",
    toCourseName: "计算机科学导论",
    reason: "我想转专业到计算机科学，因此需要学习该基础课程",
    status: "approved",
    createdAt: "2023-08-09T14:20:00Z",
    updatedAt: "2023-08-11T09:15:00Z",
    adminComment: "批准换课申请",
  },
  {
    _id: "3",
    studentId: "ST003",
    studentName: "王五",
    fromCourseId: "4",
    fromCourseName: "物理学基础",
    toCourseId: "3",
    toCourseName: "高级英语写作",
    reason: "我发现自己更适合文科类课程，想转向英语学习",
    status: "rejected",
    createdAt: "2023-08-08T11:45:00Z",
    updatedAt: "2023-08-10T16:30:00Z",
    adminComment: "物理学是您专业的必修课，不能替换",
  },
];

const SwapRequestsPage = () => {
  const [requests, setRequests] = useState<SwapRequest[]>(mockRequests);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<SwapRequest | null>(
    null,
  );
  const [form] = Form.useForm();

  // 模拟从API获取数据
  useEffect(() => {
    // 实际应用中从API获取数据
    // fetchRequests();
  }, []);

  // 处理查看详情
  const handleViewDetails = (request: SwapRequest) => {
    setCurrentRequest(request);
    form.setFieldsValue({
      status: request.status,
      adminComment: request.adminComment || "",
    });
    setModalVisible(true);
  };

  // 处理更新状态
  const handleUpdateStatus = async (values: any) => {
    if (!currentRequest) return;

    setLoading(true);
    try {
      // 实际应用中，这里应该调用API
      // const response = await axios.patch('/api/swaps', {
      //   id: currentRequest._id,
      //   status: values.status,
      //   adminComment: values.adminComment
      // });

      // 模拟API响应
      setTimeout(() => {
        // 更新本地状态
        const updatedRequests = requests.map((req) =>
          req._id === currentRequest._id
            ? {
                ...req,
                status: values.status,
                adminComment: values.adminComment,
                updatedAt: new Date().toISOString(),
              }
            : req,
        );

        setRequests(updatedRequests);
        message.success("申请状态已更新");
        setModalVisible(false);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("更新失败:", error);
      message.error("更新失败，请重试");
      setLoading(false);
    }
  };

  // 表格列定义
  const columns = [
    {
      title: "学生",
      dataIndex: "studentName",
      key: "studentName",
    },
    {
      title: "学号",
      dataIndex: "studentId",
      key: "studentId",
    },
    {
      title: "原课程",
      dataIndex: "fromCourseName",
      key: "fromCourseName",
    },
    {
      title: "目标课程",
      dataIndex: "toCourseName",
      key: "toCourseName",
    },
    {
      title: "申请时间",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "blue";
        let text = "待处理";

        if (status === "approved") {
          color = "green";
          text = "已批准";
        } else if (status === "rejected") {
          color = "red";
          text = "已拒绝";
        }

        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: SwapRequest) => (
        <Space size="middle">
          <Button
            type="primary"
            size="small"
            onClick={() => handleViewDetails(record)}
          >
            查看详情
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout>
      <div className="mb-6">
        <Title level={2}>换课申请管理</Title>
        <p className="text-gray-500">管理学生提交的换课申请，进行审批操作</p>
      </div>

      <Table
        columns={columns}
        dataSource={requests}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
      />

      {currentRequest && (
        <Modal
          title="换课申请详情"
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
        >
          <div className="mb-6">
            <p>
              <strong>学生:</strong> {currentRequest.studentName} (
              {currentRequest.studentId})
            </p>
            <p>
              <strong>从课程:</strong> {currentRequest.fromCourseName}
            </p>
            <p>
              <strong>至课程:</strong> {currentRequest.toCourseName}
            </p>
            <p>
              <strong>申请理由:</strong> {currentRequest.reason}
            </p>
            <p>
              <strong>申请时间:</strong>{" "}
              {new Date(currentRequest.createdAt).toLocaleString()}
            </p>

            {currentRequest.status !== "pending" && (
              <p>
                <strong>最后更新:</strong>{" "}
                {new Date(currentRequest.updatedAt).toLocaleString()}
              </p>
            )}
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdateStatus}
            initialValues={{
              status: currentRequest.status,
              adminComment: currentRequest.adminComment || "",
            }}
          >
            <Form.Item
              name="status"
              label="申请状态"
              rules={[{ required: true, message: "请选择申请状态" }]}
            >
              <Radio.Group>
                <Radio value="pending">待处理</Radio>
                <Radio value="approved">批准</Radio>
                <Radio value="rejected">拒绝</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item name="adminComment" label="管理员备注">
              <TextArea rows={4} placeholder="请输入处理意见或备注信息..." />
            </Form.Item>

            <Form.Item>
              <div className="flex justify-end gap-2">
                <Button onClick={() => setModalVisible(false)}>取消</Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  更新状态
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </Layout>
  );
};

export default SwapRequestsPage;
