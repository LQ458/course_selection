import en from "./en";
import zh from "./zh";

export { en, zh };

export type Translation = typeof zh;

// 全局可用的翻译对象
const translations = {
  en,
  zh,
};

export default translations;
