import winston from "winston";

// 根据环境配置日志级别
const level = process.env.NODE_ENV === "production" ? "info" : "debug";

// 创建winston日志记录器
export const logger = winston.createLogger({
  level,
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
  ),
  defaultMeta: { service: "course-selection" },
  transports: [
    // 控制台输出
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          return `${timestamp} ${level}: ${message} ${
            Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ""
          }`;
        }),
      ),
    }),
    // 如果在生产环境，添加文件日志
    ...(process.env.NODE_ENV === "production"
      ? [
          new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
          }),
          new winston.transports.File({ filename: "logs/combined.log" }),
        ]
      : []),
  ],
});

// 如果不是在生产环境，添加简化输出
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}

// 捕获未处理的异常和Promise拒绝
if (process.env.NODE_ENV === "production") {
  logger.exceptions.handle(
    new winston.transports.File({ filename: "logs/exceptions.log" }),
  );
  logger.rejections.handle(
    new winston.transports.File({ filename: "logs/rejections.log" }),
  );
}
