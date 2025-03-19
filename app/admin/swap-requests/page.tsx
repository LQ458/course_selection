"use client";

import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Checkbox,
  message,
  Space,
  Tooltip,
} from "antd";
import type { TableProps } from "antd";
import { SwapRequest, SwapStatus } from "@/app/types";
import {
  QuestionCircleOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";

export default function SwapRequestsPage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SwapRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<SwapRequest | null>(
    null,
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/swaps");
      const json = await res.json();
      if (json.success) {
        setData(json.data.swapRequests);
      }
    } catch (error) {
      message.error("获取数据失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReview = (record: SwapRequest) => {
    setSelectedRequest(record);
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const { action, reviewNote, checkResults } = values;

      setLoading(true);

      const res = await fetch(`/api/admin/swaps/${selectedRequest?._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reviewNote, checkResults }),
      });

      const json = await res.json();
      if (json.success) {
        message.success({
          content: `${action === "approve" ? "通过" : "拒绝"}申请成功`,
          duration: 3,
        });
        setIsModalVisible(false);
        form.resetFields();
        fetchData();
      } else {
        message.error({
          content: json.error || "操作失败",
          duration: 3,
        });
      }
    } catch (error) {
      message.error({
        content: "操作失败，请重试",
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  const columns: TableProps<SwapRequest>["columns"] = [
    {
      title: "学生姓名",
      dataIndex: ["student", "name"],
    },
    {
      title: "原课程",
      dataIndex: ["originalCourse", "name"],
    },
    {
      title: "目标课程",
      dataIndex: ["targetCourse", "name"],
    },
    {
      title: "申请原因",
      dataIndex: "reason",
    },
    {
      title: "状态",
      dataIndex: "status",
      render: (status: SwapStatus) => {
        const statusMap = {
          [SwapStatus.PENDING]: "待审批",
          [SwapStatus.APPROVED]: "已通过",
          [SwapStatus.REJECTED]: "已拒绝",
        };
        return statusMap[status];
      },
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) =>
        record.status === SwapStatus.PENDING && (
          <Space size="middle">
            <Tooltip title="点击查看详情并进行审批">
              <Button type="primary" onClick={() => handleReview(record)}>
                审批
              </Button>
            </Tooltip>
          </Space>
        ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">换课申请管理</h1>
        <p className="text-gray-600 mt-2">
          <QuestionCircleOutlined className="mr-2" />
          在这里您可以审批学生的换课申请。点击"审批"按钮查看详情并进行审核。
        </p>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="_id"
        loading={loading}
      />

      <Modal
        title="审批换课申请"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          Modal.confirm({
            title: "确认取消",
            content: "您确定要取消当前的审批操作吗？已填写的内容将不会保存。",
            onOk: () => {
              setIsModalVisible(false);
              form.resetFields();
            },
          });
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              Modal.confirm({
                title: "确认取消",
                content:
                  "您确定要取消当前的审批操作吗？已填写的内容将不会保存。",
                onOk: () => {
                  setIsModalVisible(false);
                  form.resetFields();
                },
              });
            }}
          >
            取消
          </Button>,
          <Space key="actions" size="middle">
            <Button
              danger
              icon={<CloseOutlined />}
              onClick={() => {
                form.setFieldsValue({ action: "reject" });
                Modal.confirm({
                  title: "确认拒绝",
                  content: "您确定要拒绝这个换课申请吗？",
                  okText: "确认拒绝",
                  okButtonProps: { danger: true },
                  onOk: handleModalOk,
                });
              }}
            >
              拒绝申请
            </Button>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={() => {
                form.setFieldsValue({ action: "approve" });
                Modal.confirm({
                  title: "确认通过",
                  content: "您确定要通过这个换课申请吗？",
                  onOk: handleModalOk,
                });
              }}
            >
              通过申请
            </Button>
          </Space>,
        ]}
      >
        <Form form={form} layout="vertical">
          <div className="bg-gray-50 p-4 mb-4 rounded">
            <h3 className="font-bold mb-2">申请信息</h3>
            <p>学生: {selectedRequest?.student.name}</p>
            <p>原课程: {selectedRequest?.originalCourse.name}</p>
            <p>目标课程: {selectedRequest?.targetCourse.name}</p>
            <p>申请原因: {selectedRequest?.reason}</p>
          </div>

          <Form.Item
            name={["checkResults", "prerequisitesNotFulfilled"]}
            valuePropName="checked"
          >
            <Checkbox>先修课程未满足</Checkbox>
          </Form.Item>
          <Form.Item name={["checkResults", "noSpace"]} valuePropName="checked">
            <Checkbox>目标课程已满</Checkbox>
          </Form.Item>
          <Form.Item
            name="reviewNote"
            label="审批备注"
            tooltip="请填写审批意见，将作为反馈显示给学生"
          >
            <Input.TextArea
              placeholder="请输入审批意见..."
              showCount
              maxLength={200}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
