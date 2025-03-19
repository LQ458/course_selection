import { dbConnect } from "../app/lib/dbConnect";
import UserModel from "../app/models/User";

async function checkAdmin() {
  try {
    await dbConnect();

    const admin = await UserModel.findOne({ username: "admin" }).select(
      "+password",
    );

    if (!admin) {
      console.log("未找到管理员账号");
      return;
    }

    console.log("管理员账号信息:", {
      id: admin._id,
      username: admin.username,
      role: admin.role,
      hasPassword: !!admin.password,
    });
  } catch (error) {
    console.error("检查失败:", error);
  } finally {
    process.exit();
  }
}

checkAdmin();
