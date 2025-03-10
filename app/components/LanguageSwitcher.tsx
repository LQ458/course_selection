"use client";

import React from "react";
import { Button, Dropdown, Space } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import { useTranslation } from "../hooks/useTranslation";
import { Language } from "../contexts/LanguageContext";

interface LanguageSwitcherProps {
  mode?: "dropdown" | "buttons";
  size?: "small" | "middle" | "large";
}

/**
 * 语言切换组件
 */
const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  mode = "dropdown",
  size = "middle",
}) => {
  const { language, changeLanguage } = useTranslation();

  // 语言选项
  const languages = [
    { key: "zh", label: "中文" },
    { key: "en", label: "English" },
  ];

  // 处理切换语言
  const handleChangeLanguage = (lang: Language) => {
    changeLanguage(lang);
  };

  // 下拉菜单选项
  const dropdownItems = languages.map((lang) => ({
    key: lang.key,
    label: <div className="px-2">{lang.label}</div>,
    onClick: () => handleChangeLanguage(lang.key as Language),
  }));

  // 显示当前语言名称
  const getCurrentLanguageLabel = () => {
    return languages.find((lang) => lang.key === language)?.label || "";
  };

  // 下拉菜单模式
  if (mode === "dropdown") {
    return (
      <Dropdown menu={{ items: dropdownItems }} placement="bottomRight">
        <Button icon={<GlobalOutlined />} size={size}>
          <Space>{getCurrentLanguageLabel()}</Space>
        </Button>
      </Dropdown>
    );
  }

  // 按钮模式
  return (
    <Space size="small">
      {languages.map((lang) => (
        <Button
          key={lang.key}
          size={size}
          type={language === lang.key ? "primary" : "default"}
          onClick={() => handleChangeLanguage(lang.key as Language)}
        >
          {lang.label}
        </Button>
      ))}
    </Space>
  );
};

export default LanguageSwitcher;
