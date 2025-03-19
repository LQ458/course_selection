"use client";

import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Divider,
  message,
  Checkbox,
  Tabs,
  Row,
  Col,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  IdcardOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface LoginFormValues {
  username: string;
  password: string;
  remember: boolean;
}

interface RegisterFormValues {
  name: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  studentId?: string;
}

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const router = useRouter();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        username: values.username,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        message.error("用户名或密码错误");
        return;
      }

      // 获取用户信息
      const userRes = await fetch("/api/auth/session");
      const userData = await userRes.json();

      if (!userData?.user) {
        message.error("获取用户信息失败");
        return;
      }

      message.success("登录成功");

      // 根据用户角色重定向到不同页面
      if (userData.user.role === "admin") {
        router.push("/admin/swap-requests");
      } else {
        router.push("/courses");
      }
    } catch (error) {
      console.error("登录错误:", error);
      message.error("登录过程发生错误");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values: RegisterFormValues) => {
    setLoading(true);

    try {
      // 验证密码确认
      if (values.password !== values.confirmPassword) {
        message.error("两次输入的密码不一致");
        setLoading(false);
        return;
      }

      // 调用注册 API
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          username: values.username,
          password: values.password,
          studentId: values.studentId,
          role: "student", // 默认注册为学生角色
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "注册失败");
      }

      message.success("注册成功，请登录");
      setActiveTab("login");
    } catch (error: any) {
      message.error(error.message || "注册失败，请稍后再试");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md shadow-md">
        <div className="text-center mb-6">
          <Title level={2} className="!mb-2">
            课程选择系统
          </Title>
          <Text className="text-gray-500 dark:text-gray-400">
            欢迎使用课程选择系统
          </Text>
        </div>

        <Tabs activeKey={activeTab} onChange={setActiveTab} centered>
          <TabPane tab="登录" key="login">
            <Form
              name="login"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              layout="vertical"
              requiredMark={false}
            >
              <Form.Item
                name="username"
                label="用户名"
                rules={[{ required: true, message: "请输入用户名" }]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="请输入用户名"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="密码"
                rules={[{ required: true, message: "请输入密码" }]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="请输入密码"
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <div className="flex justify-between items-center">
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>记住我</Checkbox>
                  </Form.Item>
                  <Link
                    href="/forgot-password"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    忘记密码?
                  </Link>
                </div>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full"
                  size="large"
                  loading={loading}
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane tab="注册" key="register">
            <Form
              name="register"
              onFinish={handleRegister}
              layout="vertical"
              requiredMark={false}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="姓名"
                    rules={[{ required: true, message: "请输入姓名" }]}
                  >
                    <Input
                      prefix={<UserOutlined className="text-gray-400" />}
                      placeholder="请输入姓名"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="studentId"
                    label="学号"
                    rules={[{ required: true, message: "请输入学号" }]}
                  >
                    <Input
                      prefix={<IdcardOutlined className="text-gray-400" />}
                      placeholder="请输入学号"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  { required: true, message: "请输入邮箱" },
                  { type: "email", message: "请输入有效的邮箱地址" },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="请输入邮箱"
                />
              </Form.Item>

              <Form.Item
                name="username"
                label="用户名"
                rules={[
                  { required: true, message: "请输入用户名" },
                  { min: 3, message: "用户名至少需要3个字符" },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="请输入用户名"
                />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="password"
                    label="密码"
                    rules={[
                      { required: true, message: "请输入密码" },
                      { min: 6, message: "密码至少需要6个字符" },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined className="text-gray-400" />}
                      placeholder="请输入密码"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="confirmPassword"
                    label="确认密码"
                    dependencies={["password"]}
                    rules={[
                      { required: true, message: "请确认密码" },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("两次输入的密码不一致"),
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined className="text-gray-400" />}
                      placeholder="请确认密码"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full"
                  size="large"
                  loading={loading}
                >
                  注册
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default LoginPage;
