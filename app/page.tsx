import Link from "next/link";
import { Button } from "antd";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <main className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
          <span className="block">课程选择系统</span>
          <span className="block text-blue-600 dark:text-blue-400">
            Course Selection System
          </span>
        </h1>

        <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-md">
          高效、便捷的在线课程选择平台。轻松查找和注册课程，管理您的学习计划。
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <Link href="/courses" className="no-underline">
            <Button type="primary" size="large" className="px-8 h-12 text-base">
              浏览课程
            </Button>
          </Link>

          <Link href="/login" className="no-underline">
            <Button size="large" className="px-8 h-12 text-base">
              登录系统
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              丰富的课程资源
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              提供多样化的课程选择，满足不同学习需求和兴趣方向。
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              灵活的选课方式
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              支持课程搜索、筛选和比较，让您做出最佳选择。
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              智能课表管理
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              自动化课程安排，避免时间冲突，优化您的学习计划。
            </p>
          </div>
        </div>
      </main>

      <footer className="mt-16 text-center text-gray-500 dark:text-gray-400">
        <p>© {new Date().getFullYear()} 课程选择系统 - 版权所有</p>
      </footer>
    </div>
  );
}
