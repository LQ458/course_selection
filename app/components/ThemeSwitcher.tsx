"use client";

import React from "react";
import { Button, Tooltip, Switch } from "antd";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "../hooks/useTranslation";

interface ThemeSwitcherProps {
  mode?: "button" | "switch";
  size?: "small" | "default" | "large";
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  mode = "switch",
  size = "default",
}) => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const isDark = theme === "dark";

  if (mode === "button") {
    return (
      <Tooltip title={isDark ? t("common.lightMode") : t("common.darkMode")}>
        <Button
          type="text"
          icon={isDark ? <SunOutlined /> : <MoonOutlined />}
          onClick={toggleTheme}
          size={size}
          className="flex items-center justify-center"
          aria-label={
            isDark ? t("common.switchToLight") : t("common.switchToDark")
          }
        />
      </Tooltip>
    );
  }

  return (
    <Switch
      checkedChildren={<SunOutlined />}
      unCheckedChildren={<MoonOutlined />}
      checked={!isDark}
      onChange={toggleTheme}
      size={size === "large" ? "default" : size}
    />
  );
};

export default ThemeSwitcher;
