"use client";

import React, { ReactNode } from "react";
import { Layout as AntLayout, Menu, Avatar, Dropdown, Space } from "antd";
import {
  BookOutlined,
  CalendarOutlined,
  UserOutlined,
  LogoutOutlined,
  HomeOutlined,
  SwapOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "../hooks/useTranslation";

const { Header, Sider, Content } = AntLayout;

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const { t } = useTranslation();

  const userMenuItems = [
    {
      key: "profile",
      label: <Link href="/profile">{t("nav.profile")}</Link>,
      icon: <UserOutlined />,
    },
    {
      key: "logout",
      label: t("nav.logout"),
      icon: <LogoutOutlined />,
    },
  ];

  const menuItems = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: <Link href="/">{t("nav.home")}</Link>,
    },
    {
      key: "/courses",
      icon: <BookOutlined />,
      label: <Link href="/courses">{t("nav.courses")}</Link>,
    },
    {
      key: "/schedule",
      icon: <CalendarOutlined />,
      label: <Link href="/schedule">{t("nav.schedule")}</Link>,
    },
    {
      key: "/my-requests",
      icon: <SwapOutlined />,
      label: <Link href="/my-requests">{t("nav.swapRequests")}</Link>,
    },
    {
      key: "/course-request",
      icon: <FileAddOutlined />,
      label: <Link href="/course-request">{t("nav.courseRequests")}</Link>,
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
          <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400 m-0 mr-4">
            <Link
              href="/"
              className="hover:text-blue-700 dark:hover:text-blue-300 no-underline"
            >
              {t("home.title")}
            </Link>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSwitcher size="small" />

          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div className="flex items-center gap-2 cursor-pointer">
              <span className="hidden sm:inline text-gray-700 dark:text-gray-300">
                Username
              </span>
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
            style={{
              background: "inherit",
              borderRight: 0,
            }}
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
