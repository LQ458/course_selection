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
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";

const { Title, Text } = Typography;

interface LoginFormValues {
  username: string;
  password: string;
  remember: boolean;
}

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (values: LoginFormValues) => {
    setLoading(true);

    try {
      // 模拟登录API调用
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 简单的角色判断（实际应用中应该由后端决定）
      if (values.username.includes("admin")) {
        router.push("/admin/swap-requests");
      } else {
        router.push("/courses");
      }

      message.success("登录成功");
    } catch (error) {
      message.error("登录失败，请检查用户名和密码");
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
            欢迎回来，请登录您的账号
          </Text>
        </div>

        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={handleLogin}
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

        <Divider plain>
          <Text className="text-gray-400">或者</Text>
        </Divider>

        <div className="text-center">
          <Text className="text-gray-500 dark:text-gray-400">还没有账号?</Text>
          <Link
            href="/register"
            className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
          >
            注册账号
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
