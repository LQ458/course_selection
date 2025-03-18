"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// 定义主题类型
export type Theme = "light" | "dark";

// 定义上下文类型
interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

// 创建上下文
const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
});

// 定义Provider Props
interface ThemeProviderProps {
  children: ReactNode;
}

// 创建Provider组件
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // 初始化主题为系统偏好或本地存储的设置
  const [theme, setTheme] = useState<Theme>("light");

  // 初始化时从localStorage加载主题设置
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as Theme;
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (storedTheme === "light" || storedTheme === "dark") {
      setTheme(storedTheme);
    } else if (prefersDark) {
      setTheme("dark");
    }
  }, []);

  // 当主题变化时应用到HTML元素
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // 切换主题
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // 设置主题
  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: handleSetTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// 创建自定义hook以便组件使用上下文
export const useTheme = () => useContext(ThemeContext);
