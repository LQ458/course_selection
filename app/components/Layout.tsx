import React, { ReactNode } from "react";
import { Layout as AntLayout, Menu, Avatar, Dropdown } from "antd";
import {
  BookOutlined,
  CalendarOutlined,
  UserOutlined,
  LogoutOutlined,
  HomeOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

const { Header, Sider, Content } = AntLayout;

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();

  const userMenuItems = [
    {
      key: "profile",
      label: <Link href="/profile">个人资料</Link>,
      icon: <UserOutlined />,
    },
    {
      key: "logout",
      label: "退出登录",
      icon: <LogoutOutlined />,
    },
  ];

  const menuItems = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: <Link href="/">首页</Link>,
    },
    {
      key: "/courses",
      icon: <BookOutlined />,
      label: <Link href="/courses">课程列表</Link>,
    },
    {
      key: "/schedule",
      icon: <CalendarOutlined />,
      label: <Link href="/schedule">我的课表</Link>,
    },
    {
      key: "/swap-requests",
      icon: <SwapOutlined />,
      label: <Link href="/my-requests">换课申请</Link>,
    },
  ];

  // 简单页面不显示侧边栏
  if (pathname === "/" || pathname === "/login" || pathname === "/register") {
    return <>{children}</>;
  }

  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Header className="flex items-center justify-between bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm px-6 h-16">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400 m-0">
            <Link
              href="/"
              className="hover:text-blue-700 dark:hover:text-blue-300 no-underline"
            >
              课程选择系统
            </Link>
          </h1>
        </div>

        <div className="flex items-center">
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div className="flex items-center gap-2 cursor-pointer">
              <span className="hidden sm:inline">用户名</span>
              <Avatar icon={<UserOutlined />} />
            </div>
          </Dropdown>
        </div>
      </Header>

      <AntLayout>
        <Sider
          width={220}
          theme="light"
          breakpoint="lg"
          collapsedWidth={0}
          className="border-r border-gray-200 dark:border-gray-700"
        >
          <Menu
            mode="inline"
            selectedKeys={[pathname]}
            className="h-full py-4"
            items={menuItems}
          />
        </Sider>

        <Content className="bg-gray-50 dark:bg-gray-900 p-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm min-h-[calc(100vh-160px)]">
            {children}
          </div>
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
