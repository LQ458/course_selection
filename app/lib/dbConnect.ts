import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/course-selection";

/**
 * 全局变量以在开发中缓存连接
 */
declare global {
  var mongoose: {
    connection: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

// 在开发环境中缓存连接
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { connection: null, promise: null };
}

/**
 * 连接到数据库
 */
export async function dbConnect() {
  if (cached.connection) {
    return cached.connection;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose.connection;
    });
  }

  try {
    cached.connection = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.connection;
}

// 连接错误处理
mongoose.connection.on("error", (err) => {
  console.error("MongoDB连接错误:", err);
});

// 连接成功通知
mongoose.connection.once("open", () => {
  console.log("MongoDB连接成功!");
});
