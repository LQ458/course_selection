"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// 定义支持的语言类型
export type Language = "zh" | "en";

// 定义上下文类型
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

// 创建上下文，默认为中文
const LanguageContext = createContext<LanguageContextType>({
  language: "zh",
  setLanguage: () => {},
});

// 定义Provider Props
interface LanguageProviderProps {
  children: ReactNode;
}

// 创建Provider组件
export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  // 从本地存储获取语言设置，默认为中文
  const [language, setLanguage] = useState<Language>("zh");

  // 初始化时从localStorage加载语言设置
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && (savedLanguage === "zh" || savedLanguage === "en")) {
      setLanguage(savedLanguage);
    }
  }, []);

  // 设置语言并保存到localStorage
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    document.documentElement.lang = lang; // 更新HTML标签的lang属性
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleSetLanguage }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// 创建自定义hook以便组件使用上下文
export const useLanguage = () => useContext(LanguageContext);
