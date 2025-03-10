"use client";

import Link from "next/link";
import { Button } from "antd";
import { useTranslation } from "./hooks/useTranslation";
import LanguageSwitcher from "./components/LanguageSwitcher";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher mode="buttons" />
      </div>

      <main className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
          <span className="block">{t("home.title")}</span>
          <span className="block text-blue-600 dark:text-blue-400">
            {t("home.subtitle")}
          </span>
        </h1>

        <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-md">
          {t("home.description")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <Link href="/courses" className="no-underline">
            <Button type="primary" size="large" className="px-8 h-12 text-base">
              {t("home.browseCourses")}
            </Button>
          </Link>

          <Link href="/login" className="no-underline">
            <Button size="large" className="px-8 h-12 text-base">
              {t("home.loginSystem")}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t("home.featureRichResources")}
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {t("home.featureResourcesDesc")}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t("home.featureFlexibleSelection")}
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {t("home.featureFlexibleDesc")}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t("home.featureScheduleManagement")}
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {t("home.featureScheduleDesc")}
            </p>
          </div>
        </div>
      </main>

      <footer className="mt-16 text-center text-gray-500 dark:text-gray-400">
        <p>
          © {new Date().getFullYear()} {t("home.title")}
        </p>
      </footer>
    </div>
  );
}
