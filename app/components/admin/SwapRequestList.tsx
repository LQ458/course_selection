"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Button,
  Empty,
  Spin,
  message,
  Typography,
  Space,
  Modal,
} from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import axios from "axios";
import { SwapRequest, SwapStatus, Course } from "../../types";
import { formatDateTime, getRelativeTime } from "../../utils/timeUtils";

const { Title, Text } = Typography;

interface SwapRequestListProps {
  // 可以添加额外的props
}

const SwapRequestList: React.FC<SwapRequestListProps> = () => {
  // 状态管理
  const [requests, setRequests] = useState<SwapRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [courseDetails, setCourseDetails] = useState<{ [key: string]: Course }>(
    {},
  );
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<SwapRequest | null>(
    null,
  );
  const [loadingCourses, setLoadingCourses] = useState(false);

  // 加载申请数据
  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/swaps");
      if (response.data.success) {
        setRequests(response.data.swapRequests);
      } else {
        message.error(response.data.error || "加载申请失败");
      }
    } catch (error) {
      console.error("加载申请失败:", error);
      message.error("加载申请失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadRequests();
  }, []);

  // 加载课程详情
  const loadCourseDetails = async (
    originalCourseId: string,
    targetCourseId: string,
  ) => {
    // 如果已经加载过，就不再重复加载
    if (courseDetails[originalCourseId] && courseDetails[targetCourseId]) {
      return;
    }

    try {
      setLoadingCourses(true);

      // 这里简化处理，实际应用中应该有专门的API来获取课程详情
      // 这里模拟从管理员API获取课程信息
      const response = await axios.get(
        `/api/admin/swaps/${currentRequest?._id}/courses`,
      );

      if (response.data.success) {
        setCourseDetails((prev) => ({
          ...prev,
          [originalCourseId]: response.data.originalCourse,
          [targetCourseId]: response.data.targetCourse,
        }));
      } else {
        message.error(response.data.error || "加载课程详情失败");
      }
    } catch (error) {
      console.error("加载课程详情失败:", error);
      message.error("加载课程详情失败，请重试");
    } finally {
      setLoadingCourses(false);
    }
  };

  // 查看申请详情
  const viewRequestDetail = (request: SwapRequest) => {
    setCurrentRequest(request);
    setDetailVisible(true);
    loadCourseDetails(request.originalCourseId, request.targetCourseId);
  };

  // 获取状态标签
  const getStatusTag = (status: SwapStatus) => {
    switch (status) {
      case SwapStatus.PENDING:
        return <Tag color="blue">待处理</Tag>;
      case SwapStatus.APPROVED:
        return <Tag color="green">已批准</Tag>;
      case SwapStatus.REJECTED:
        return <Tag color="red">已拒绝</Tag>;
      default:
        return <Tag>未知</Tag>;
    }
  };

  // 表格列定义
  const columns = [
    {
      title: "申请时间",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) => (
        <span title={formatDateTime(text)}>{getRelativeTime(text)}</span>
      ),
    },
    {
      title: "原课程",
      dataIndex: "originalCourseId",
      key: "originalCourse",
      render: (courseId: string) =>
        courseDetails[courseId] ? courseDetails[courseId].name : courseId,
    },
    {
      title: "目标课程",
      dataIndex: "targetCourseId",
      key: "targetCourse",
      render: (courseId: string) =>
        courseDetails[courseId] ? courseDetails[courseId].name : courseId,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status: SwapStatus) => getStatusTag(status),
    },
    {
      title: "操作",
      key: "action",
      render: (_, record: SwapRequest) => (
        <Button type="link" onClick={() => viewRequestDetail(record)}>
          查看详情
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Title level={3}>我的换课申请</Title>
        <Button
          icon={<ReloadOutlined />}
          onClick={loadRequests}
          loading={loading}
        >
          刷新
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Spin size="large" />
        </div>
      ) : requests.length > 0 ? (
        <Table
          columns={columns}
          dataSource={requests}
          rowKey="_id"
          pagination={false}
        />
      ) : (
        <Empty description="暂无换课申请记录" className="py-10" />
      )}

      {/* 申请详情模态框 */}
      <Modal
        title="换课申请详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>,
        ]}
        width={600}
      >
        {currentRequest && (
          <div>
            <div className="mb-4">
              <Text strong>申请状态：</Text>
              {getStatusTag(currentRequest.status)}
            </div>

            <div className="mb-4">
              <Text strong>申请时间：</Text>
              <Text>{formatDateTime(currentRequest.createdAt)}</Text>
            </div>

            {currentRequest.updatedAt &&
              currentRequest.status !== SwapStatus.PENDING && (
                <div className="mb-4">
                  <Text strong>处理时间：</Text>
                  <Text>{formatDateTime(currentRequest.updatedAt)}</Text>
                </div>
              )}

            <div className="mb-4">
              <Text strong>申请理由：</Text>
              <div className="p-3 bg-gray-50 rounded mt-1">
                {currentRequest.reason}
              </div>
            </div>

            <Spin spinning={loadingCourses}>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="border p-4 rounded">
                  <div className="font-bold mb-2">原课程</div>
                  {courseDetails[currentRequest.originalCourseId] ? (
                    <>
                      <p>
                        <Text strong>课程名称：</Text>
                        {courseDetails[currentRequest.originalCourseId].name}
                      </p>
                      <p>
                        <Text strong>教师：</Text>
                        {courseDetails[currentRequest.originalCourseId].teacher}
                      </p>
                      <p>
                        <Text strong>地点：</Text>
                        {
                          courseDetails[currentRequest.originalCourseId]
                            .location
                        }
                      </p>
                      <p>
                        <Text strong>时间：</Text>
                        {courseDetails[currentRequest.originalCourseId].schedule
                          .map((s) => `${s.day} ${s.startTime}-${s.endTime}`)
                          .join(", ")}
                      </p>
                    </>
                  ) : (
                    <Text type="secondary">加载中...</Text>
                  )}
                </div>

                <div className="border p-4 rounded">
                  <div className="font-bold mb-2">目标课程</div>
                  {courseDetails[currentRequest.targetCourseId] ? (
                    <>
                      <p>
                        <Text strong>课程名称：</Text>
                        {courseDetails[currentRequest.targetCourseId].name}
                      </p>
                      <p>
                        <Text strong>教师：</Text>
                        {courseDetails[currentRequest.targetCourseId].teacher}
                      </p>
                      <p>
                        <Text strong>地点：</Text>
                        {courseDetails[currentRequest.targetCourseId].location}
                      </p>
                      <p>
                        <Text strong>时间：</Text>
                        {courseDetails[currentRequest.targetCourseId].schedule
                          .map((s) => `${s.day} ${s.startTime}-${s.endTime}`)
                          .join(", ")}
                      </p>
                    </>
                  ) : (
                    <Text type="secondary">加载中...</Text>
                  )}
                </div>
              </div>
            </Spin>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SwapRequestList;
