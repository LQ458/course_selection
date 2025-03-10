"use client";

import React, { useState, useEffect } from "react";
import {
  Typography,
  Table,
  Tag,
  Button,
  Card,
  Empty,
  Tabs,
  Badge,
  Space,
  Tooltip,
} from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SwapOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import Layout from "../components/Layout";
import { SwapRequest } from "../types";
import { useTranslation } from "../hooks/useTranslation";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import "dayjs/locale/en";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// 模拟数据
const mockSwapRequests: SwapRequest[] = [
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
    studentId: "ST001",
    studentName: "张三",
    fromCourseId: "3",
    fromCourseName: "高级英语写作",
    toCourseId: "4",
    toCourseName: "物理学基础",
    reason: "我想专注于理科课程以满足专业需求",
    status: "approved",
    createdAt: "2023-08-02T14:30:00Z",
    updatedAt: "2023-08-04T09:15:00Z",
    adminComment: "申请已批准，您可以开始上课了",
  },
  {
    _id: "3",
    studentId: "ST001",
    studentName: "张三",
    fromCourseId: "5",
    fromCourseName: "数据结构",
    toCourseId: "6",
    toCourseName: "操作系统",
    reason: "我已经在另一个专业学过了数据结构",
    status: "rejected",
    createdAt: "2023-07-20T09:45:00Z",
    updatedAt: "2023-07-22T16:30:00Z",
    adminComment: "操作系统课程已满，无法批准换课申请",
  },
];

const MySwapRequestsPage = () => {
  const { t, language } = useTranslation();
  const [requests, setRequests] = useState<SwapRequest[]>(mockSwapRequests);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // 设置dayjs语言
  useEffect(() => {
    dayjs.locale(language);
  }, [language]);

  // 模拟从API获取数据
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      // 实际应用中应调用API
      // const response = await axios.get('/api/swaps?studentId=current');
      // setRequests(response.data.data);
      setTimeout(() => {
        setRequests(mockSwapRequests);
        setLoading(false);
      }, 500);
    };

    fetchRequests();
  }, []);

  // 根据状态筛选请求
  const filteredRequests =
    activeTab === "all"
      ? requests
      : requests.filter((req) => req.status === activeTab);

  // 渲染状态标签
  const renderStatusTag = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Tag icon={<ClockCircleOutlined />} color="blue">
            {t("admin.pending")}
          </Tag>
        );
      case "approved":
        return (
          <Tag icon={<CheckCircleOutlined />} color="green">
            {t("admin.approved")}
          </Tag>
        );
      case "rejected":
        return (
          <Tag icon={<CloseCircleOutlined />} color="red">
            {t("admin.rejected")}
          </Tag>
        );
      default:
        return null;
    }
  };

  // 表格列定义
  const columns = [
    {
      title: t("admin.fromCourse"),
      dataIndex: "fromCourseName",
      key: "fromCourseName",
    },
    {
      title: t("admin.toCourse"),
      dataIndex: "toCourseName",
      key: "toCourseName",
    },
    {
      title: t("admin.requestTime"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) => dayjs(text).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: t("admin.status"),
      dataIndex: "status",
      key: "status",
      render: (status: string) => renderStatusTag(status),
    },
    {
      title: t("admin.adminComment"),
      dataIndex: "adminComment",
      key: "adminComment",
      render: (text: string, record: SwapRequest) => {
        if (record.status === "pending") {
          return <Text type="secondary">-</Text>;
        }
        return text ? (
          <Tooltip title={text}>
            <Text ellipsis style={{ maxWidth: 200 }}>
              {text}
            </Text>
          </Tooltip>
        ) : (
          <Text type="secondary">-</Text>
        );
      },
    },
  ];

  // 渲染空状态
  const renderEmpty = () => (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={t("common.noData")}
    />
  );

  // 渲染请求卡片
  const renderRequestCard = (request: SwapRequest) => (
    <Card
      key={request._id}
      className="mb-4"
      title={
        <div className="flex justify-between items-center">
          <Space>
            <SwapOutlined />
            <span>{t("swapRequest.title")}</span>
          </Space>
          {renderStatusTag(request.status)}
        </div>
      }
      extra={
        <Text type="secondary">
          {dayjs(request.createdAt).format("YYYY-MM-DD")}
        </Text>
      }
    >
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge status="default" />
          <Text strong>{t("admin.fromCourse")}:</Text>
          <Text>{request.fromCourseName}</Text>
        </div>
        <div className="flex items-center gap-2">
          <Badge status="processing" />
          <Text strong>{t("admin.toCourse")}:</Text>
          <Text>{request.toCourseName}</Text>
        </div>
      </div>

      <Card size="small" className="mb-3">
        <Text strong>{t("swapRequest.reason")}:</Text>
        <Paragraph>{request.reason}</Paragraph>
      </Card>

      {request.status !== "pending" && request.adminComment && (
        <Card size="small" className="mb-3 bg-gray-50">
          <Text strong>{t("admin.adminComment")}:</Text>
          <Paragraph>{request.adminComment}</Paragraph>
        </Card>
      )}

      <div className="flex justify-between items-center text-gray-500 text-sm">
        <Text type="secondary">ID: {request._id}</Text>
        <Text type="secondary">
          {request.status === "pending"
            ? t("admin.requestTime")
            : t("admin.lastUpdated")}
          : {dayjs(request.updatedAt).format("YYYY-MM-DD HH:mm")}
        </Text>
      </div>
    </Card>
  );

  return (
    <Layout>
      <div className="mb-8">
        <Title level={2}>{t("nav.swapRequests")}</Title>
        <Text type="secondary">{t("swapRequest.subtitle")}</Text>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} className="mb-6">
        <TabPane
          tab={
            <Badge count={requests.length} offset={[10, 0]}>
              <span className="px-2">{t("common.all")}</span>
            </Badge>
          }
          key="all"
        />
        <TabPane
          tab={
            <Badge
              count={requests.filter((r) => r.status === "pending").length}
              offset={[10, 0]}
            >
              <span className="px-2">{t("admin.pending")}</span>
            </Badge>
          }
          key="pending"
        />
        <TabPane
          tab={
            <Badge
              count={requests.filter((r) => r.status === "approved").length}
              offset={[10, 0]}
            >
              <span className="px-2">{t("admin.approved")}</span>
            </Badge>
          }
          key="approved"
        />
        <TabPane
          tab={
            <Badge
              count={requests.filter((r) => r.status === "rejected").length}
              offset={[10, 0]}
            >
              <span className="px-2">{t("admin.rejected")}</span>
            </Badge>
          }
          key="rejected"
        />
      </Tabs>

      {loading ? (
        <div className="py-10 text-center">
          <div className="spinner"></div>
          <p>{t("common.loading")}</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block">
            <Table
              dataSource={filteredRequests}
              columns={columns}
              rowKey="_id"
              locale={{ emptyText: renderEmpty() }}
              pagination={{ pageSize: 10 }}
            />
          </div>

          <div className="md:hidden">
            {filteredRequests.length > 0
              ? filteredRequests.map((request) => renderRequestCard(request))
              : renderEmpty()}
          </div>
        </>
      )}
    </Layout>
  );
};

export default MySwapRequestsPage;
