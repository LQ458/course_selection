"use client";

import { useLanguage, Language } from "../contexts/LanguageContext";
import translations, { Translation } from "../locales";

/**
 * 翻译hook，提供获取翻译文本的方法
 */
export const useTranslation = () => {
  const { language, setLanguage } = useLanguage();

  /**
   * 根据路径获取翻译文本
   * @param path 翻译路径，例如：'common.submit'
   * @param params 替换参数，例如：{ count: 3 }
   * @returns 翻译后的文本
   */
  const t = (path: string, params?: Record<string, any>): string => {
    const keys = path.split(".");
    let result: any = translations[language as Language];

    // 根据路径获取翻译文本
    for (const key of keys) {
      if (result && result[key]) {
        result = result[key];
      } else {
        console.warn(`Translation key not found: ${path}`);
        return path;
      }
    }

    // 如果结果不是字符串，可能是数组或对象
    if (typeof result !== "string") {
      return JSON.stringify(result);
    }

    // 替换参数
    if (params) {
      return Object.entries(params).reduce((str, [key, value]) => {
        return str.replace(new RegExp(`{${key}}`, "g"), String(value));
      }, result);
    }

    return result;
  };

  /**
   * 切换语言
   * @param newLanguage 新的语言设置
   */
  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  return {
    t,
    language,
    changeLanguage,
  };
};
