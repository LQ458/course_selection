// 中文翻译
const zh = {
  // 通用
  common: {
    loading: "加载中...",
    submit: "提交",
    cancel: "取消",
    confirm: "确认",
    save: "保存",
    delete: "删除",
    edit: "编辑",
    search: "搜索",
    filter: "筛选",
    noData: "暂无数据",
    success: "操作成功",
    error: "操作失败",
    welcome: "欢迎",
    back: "返回",
    close: "关闭",
    all: "全部",
  },

  // 导航
  nav: {
    home: "首页",
    courses: "课程列表",
    schedule: "我的课表",
    swapRequests: "换课申请",
    courseRequests: "课程变更",
    profile: "个人资料",
    login: "登录",
    register: "注册",
    logout: "退出登录",
    admin: "管理员",
    settings: "设置",
  },

  // 登录/注册
  auth: {
    username: "用户名",
    password: "密码",
    login: "登录",
    register: "注册",
    forgotPassword: "忘记密码?",
    rememberMe: "记住我",
    noAccount: "还没有账号?",
    haveAccount: "已有账号?",
    loginSuccess: "登录成功",
    loginError: "登录失败，请检查用户名和密码",
  },

  // 首页
  home: {
    title: "课程选择系统",
    subtitle: "Course Selection System",
    description:
      "高效、便捷的在线课程选择平台。轻松查找和注册课程，管理您的学习计划。",
    browseCourses: "浏览课程",
    loginSystem: "登录系统",
    featureRichResources: "丰富的课程资源",
    featureResourcesDesc: "提供多样化的课程选择，满足不同学习需求和兴趣方向。",
    featureFlexibleSelection: "灵活的选课方式",
    featureFlexibleDesc: "支持课程搜索、筛选和比较，让您做出最佳选择。",
    featureScheduleManagement: "智能课表管理",
    featureScheduleDesc: "自动化课程安排，避免时间冲突，优化您的学习计划。",
  },

  // 课程列表
  courses: {
    title: "课程列表",
    subtitle: "浏览所有可用课程，查看详情或申请换课",
    searchPlaceholder: "搜索课程名称、代码或教师",
    departmentFilter: "院系筛选",
    noCourses: "没有找到匹配的课程",
    courseInfo: "课程信息",
    teacherInfo: "教师信息",
    credits: "学分",
    enrolled: "已报名",
    capacity: "课程容量",
    remaining: "剩余名额",
    location: "上课地点",
    schedule: "上课时间",
    department: "所属院系",
    swapable: "可换课",
    notSwapable: "不可换",
    almostFull: "即将满员，仅剩{count}个名额",
  },

  // 课程详情
  courseDetail: {
    title: "课程详情",
    description: "课程简介",
    prerequisites: "先修课程",
    swapRules: "换课规则",
    swapRequest: "申请换课",
    enrollNow: "立即选课",
    dropCourse: "退选课程",
    swapNotice: "换课申请须知",
    swapNoticeItems: [
      "换课申请提交后需等待管理员审批，请耐心等待",
      "审批通过后，系统将自动更新您的选课记录",
      "每门课程每学期仅允许换课一次",
      "换课申请一旦被拒绝，需重新提交申请",
      "目标课程必须有剩余名额才能申请换课",
    ],
  },

  // 换课申请
  swapRequest: {
    title: "换课申请",
    subtitle: "管理您的换课申请",
    selectCourse: "选择要替换的课程",
    selectCoursePlaceholder: "请选择课程",
    targetCourse: "目标课程",
    reason: "换课理由",
    reasonPlaceholder: "请详细说明您换课的原因...",
    reasonRequired: "请填写换课理由",
    reasonMinLength: "理由不能少于10个字符",
    timeConflict: "时间冲突警告",
    timeConflictDesc:
      "您选择的课程与目标课程时间存在冲突，请确认是否继续申请。",
    successMessage: "换课申请已提交，请等待审批",
    steps: {
      selectCourse: "选择课程",
      fillReason: "填写理由",
      submitRequest: "提交申请",
      selectCourseDesc: "选择要替换的课程",
      fillReasonDesc: "说明换课原因",
      submitRequestDesc: "提交申请",
    },
    validation: {
      selectCourse: "请选择要替换的课程",
    },
  },

  // 课程请求
  courseRequest: {
    title: "课程变更申请",
    pageTitle: "课程变更",
    pageDescription: "在这里您可以申请添加或删除课程",
    modalTitle: "新建课程变更申请",
    newRequest: "新建申请",
    currentCourses: "当前已选课程",
    coursesToRemove: "希望退选的课程",
    coursesToAdd: "希望添加的课程",
    confirmPrerequisites: "我已阅读并确认我希望添加的课程的先修要求",
    additionalNotes: "附加说明",
    submit: "提交申请",
    successMessage: "课程变更申请已成功提交",
    noteTitle: "申请须知",
    noteDescription:
      "课程变更申请提交后需经管理员审核，请耐心等待。审核通过后，系统将自动更新您的选课记录。",
    placeholder: {
      coursesToRemove: "请选择您希望退选的课程",
      coursesToAdd: "请选择您希望添加的课程",
      additionalNotes: "如有特殊情况或其他说明，请在此填写...",
    },
    tooltip: {
      coursesToRemove: "选择您希望从当前课表中移除的课程",
      coursesToAdd: "选择您希望添加到课表中的新课程",
      additionalNotes: "您可以在这里提供更多关于您的申请的信息",
    },
    validation: {
      coursesToRemoveRequired: "请选择至少一门要退选的课程",
      coursesToAddRequired: "请选择至少一门要添加的课程",
      confirmPrerequisites: "请确认您已阅读并检查了课程先修要求",
    },
  },

  // 课表
  schedule: {
    title: "我的课表",
    subtitle: "查看您的课程安排和上课时间",
    weekView: "周视图",
    monthView: "月视图",
    listView: "课程列表",
    timeSlot: "时间 / 日期",
    noCourses: "暂无课程",
    courseDetails: "课程详情",
  },

  // 管理员
  admin: {
    swapRequestsTitle: "换课申请管理",
    swapRequestsSubtitle: "管理学生提交的换课申请，进行审批操作",
    studentName: "学生",
    studentId: "学号",
    fromCourse: "原课程",
    toCourse: "目标课程",
    requestTime: "申请时间",
    status: "状态",
    pending: "待处理",
    approved: "已批准",
    rejected: "已拒绝",
    viewDetails: "查看详情",
    requestDetails: "换课申请详情",
    studentInfo: "学生",
    requestReason: "申请理由",
    lastUpdated: "最后更新",
    adminComment: "管理员备注",
    adminCommentPlaceholder: "请输入处理意见或备注信息...",
    updateStatus: "更新状态",
    updateSuccess: "申请状态已更新",
    updateError: "更新失败，请重试",
  },

  // 日期和时间
  dateTime: {
    days: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
    months: [
      "一月",
      "二月",
      "三月",
      "四月",
      "五月",
      "六月",
      "七月",
      "八月",
      "九月",
      "十月",
      "十一月",
      "十二月",
    ],
  },
};

export default zh;
