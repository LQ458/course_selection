import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Button,
  Modal,
  Card,
  Input,
  Select,
  Space,
  message,
  Typography,
  Descriptions,
  Badge,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { SwapRequest, SwapStatus, Course } from "../../types";
import { formatDateTime, getRelativeTime } from "../../utils/timeUtils";

const { Title, Text } = Typography;
const { Option } = Select;

interface SwapApplicationsManagerProps {
  // 可以添加额外的props
}

const SwapApplicationsManager: React.FC<SwapApplicationsManagerProps> = () => {
  // 状态管理
  const [applications, setApplications] = useState<SwapRequest[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<
    SwapRequest[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentApplication, setCurrentApplication] =
    useState<SwapRequest | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<SwapStatus | "all">("all");
  const [originalCourse, setOriginalCourse] = useState<Course | null>(null);
  const [targetCourse, setTargetCourse] = useState<Course | null>(null);

  // 加载申请数据
  const loadApplications = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/admin/swaps");
      if (response.data.success) {
        setApplications(response.data.swapRequests);
        setFilteredApplications(response.data.swapRequests);
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
    loadApplications();
  }, []);

  // 处理搜索和筛选
  useEffect(() => {
    let result = [...applications];

    // 状态筛选
    if (statusFilter !== "all") {
      result = result.filter((app) => app.status === statusFilter);
    }

    // 文本搜索
    if (searchText) {
      const lowerSearchText = searchText.toLowerCase();
      result = result.filter(
        (app) =>
          app.student.name.toLowerCase().includes(lowerSearchText) ||
          app.student.studentId.toLowerCase().includes(lowerSearchText) ||
          app.reason.toLowerCase().includes(lowerSearchText),
      );
    }

    setFilteredApplications(result);
  }, [applications, statusFilter, searchText]);

  // 加载课程详情
  const loadCourseDetails = async (applicationId: string) => {
    try {
      const response = await axios.get(
        `/api/admin/swaps/${applicationId}/courses`,
      );
      if (response.data.success) {
        setOriginalCourse(response.data.originalCourse);
        setTargetCourse(response.data.targetCourse);
      } else {
        message.error(response.data.error || "加载课程详情失败");
      }
    } catch (error) {
      console.error("加载课程详情失败:", error);
      message.error("加载课程详情失败，请重试");
    }
  };

  // 查看申请详情
  const viewApplicationDetail = (application: SwapRequest) => {
    setCurrentApplication(application);
    setDetailVisible(true);
    loadCourseDetails(application._id);
  };

  // 处理申请
  const processApplication = async (id: string, approved: boolean) => {
    try {
      setProcessingId(id);
      const response = await axios.put(`/api/admin/swaps/${id}`, {
        status: approved ? SwapStatus.APPROVED : SwapStatus.REJECTED,
      });

      if (response.data.success) {
        message.success(`申请已${approved ? "批准" : "拒绝"}`);
        // 更新本地数据
        setApplications((prev) =>
          prev.map((app) =>
            app._id === id
              ? {
                  ...app,
                  status: approved ? SwapStatus.APPROVED : SwapStatus.REJECTED,
                }
              : app,
          ),
        );
        // 如果是当前查看的申请，也更新它
        if (currentApplication && currentApplication._id === id) {
          setCurrentApplication({
            ...currentApplication,
            status: approved ? SwapStatus.APPROVED : SwapStatus.REJECTED,
          });
        }
      } else {
        message.error(response.data.error || "处理申请失败");
      }
    } catch (error) {
      console.error("处理申请失败:", error);
      message.error("处理申请失败，请重试");
    } finally {
      setProcessingId(null);
    }
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
      title: "学生",
      dataIndex: ["student", "name"],
      key: "studentName",
      render: (text: string, record: SwapRequest) => (
        <span>
          {text} ({record.student.studentId})
        </span>
      ),
    },
    {
      title: "申请时间",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) => (
        <span title={formatDateTime(text)}>{getRelativeTime(text)}</span>
      ),
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
        <Space size="small">
          <Button type="link" onClick={() => viewApplicationDetail(record)}>
            查看详情
          </Button>
          {record.status === SwapStatus.PENDING && (
            <>
              <Button
                type="link"
                style={{ color: "green" }}
                onClick={() => processApplication(record._id, true)}
                loading={processingId === record._id}
                icon={<CheckCircleOutlined />}
              >
                批准
              </Button>
              <Button
                type="link"
                danger
                onClick={() => processApplication(record._id, false)}
                loading={processingId === record._id}
                icon={<CloseCircleOutlined />}
              >
                拒绝
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Title level={3}>换课申请管理</Title>

      {/* 搜索和筛选 */}
      <div className="flex justify-between mb-4">
        <Input
          placeholder="搜索学生姓名、学号或申请理由"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />

        <Space>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 120 }}
            placeholder="状态筛选"
          >
            <Option value="all">全部状态</Option>
            <Option value={SwapStatus.PENDING}>待处理</Option>
            <Option value={SwapStatus.APPROVED}>已批准</Option>
            <Option value={SwapStatus.REJECTED}>已拒绝</Option>
          </Select>

          <Button
            type="primary"
            icon={<FilterOutlined />}
            onClick={() => {
              setStatusFilter("all");
              setSearchText("");
            }}
          >
            重置筛选
          </Button>

          <Button onClick={loadApplications}>刷新</Button>
        </Space>
      </div>

      {/* 申请列表 */}
      <Table
        columns={columns}
        dataSource={filteredApplications}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      {/* 申请详情模态框 */}
      <Modal
        title="换课申请详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>,
          currentApplication?.status === SwapStatus.PENDING && (
            <Button
              key="reject"
              danger
              onClick={() =>
                currentApplication &&
                processApplication(currentApplication._id, false)
              }
              loading={processingId === currentApplication?._id}
            >
              拒绝申请
            </Button>
          ),
          currentApplication?.status === SwapStatus.PENDING && (
            <Button
              key="approve"
              type="primary"
              onClick={() =>
                currentApplication &&
                processApplication(currentApplication._id, true)
              }
              loading={processingId === currentApplication?._id}
            >
              批准申请
            </Button>
          ),
        ].filter(Boolean)}
        width={700}
      >
        {currentApplication && (
          <div>
            <Descriptions title="申请信息" bordered column={2}>
              <Descriptions.Item label="申请状态" span={2}>
                <Badge
                  status={
                    currentApplication.status === SwapStatus.PENDING
                      ? "processing"
                      : currentApplication.status === SwapStatus.APPROVED
                        ? "success"
                        : "error"
                  }
                  text={
                    currentApplication.status === SwapStatus.PENDING
                      ? "待处理"
                      : currentApplication.status === SwapStatus.APPROVED
                        ? "已批准"
                        : "已拒绝"
                  }
                />
              </Descriptions.Item>
              <Descriptions.Item label="学生姓名">
                {currentApplication.student.name}
              </Descriptions.Item>
              <Descriptions.Item label="学号">
                {currentApplication.student.studentId}
              </Descriptions.Item>
              <Descriptions.Item label="申请时间">
                {formatDateTime(currentApplication.createdAt)}
              </Descriptions.Item>
              <Descriptions.Item label="处理时间">
                {currentApplication.updatedAt &&
                currentApplication.status !== SwapStatus.PENDING
                  ? formatDateTime(currentApplication.updatedAt)
                  : "尚未处理"}
              </Descriptions.Item>
              <Descriptions.Item label="申请理由" span={2}>
                {currentApplication.reason}
              </Descriptions.Item>
            </Descriptions>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <Card title="原课程" loading={!originalCourse}>
                {originalCourse && (
                  <>
                    <p>
                      <strong>课程名称:</strong> {originalCourse.name}
                    </p>
                    <p>
                      <strong>教师:</strong> {originalCourse.teacher}
                    </p>
                    <p>
                      <strong>地点:</strong> {originalCourse.location}
                    </p>
                    <p>
                      <strong>时间:</strong>{" "}
                      {originalCourse.schedule
                        .map((s) => `${s.day} ${s.startTime}-${s.endTime}`)
                        .join(", ")}
                    </p>
                  </>
                )}
              </Card>

              <Card title="目标课程" loading={!targetCourse}>
                {targetCourse && (
                  <>
                    <p>
                      <strong>课程名称:</strong> {targetCourse.name}
                    </p>
                    <p>
                      <strong>教师:</strong> {targetCourse.teacher}
                    </p>
                    <p>
                      <strong>地点:</strong> {targetCourse.location}
                    </p>
                    <p>
                      <strong>时间:</strong>{" "}
                      {targetCourse.schedule
                        .map((s) => `${s.day} ${s.startTime}-${s.endTime}`)
                        .join(", ")}
                    </p>
                  </>
                )}
              </Card>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SwapApplicationsManager;
