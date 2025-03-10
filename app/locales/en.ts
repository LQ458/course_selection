// English translations
const en = {
  // Common
  common: {
    loading: "Loading...",
    submit: "Submit",
    cancel: "Cancel",
    confirm: "Confirm",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    search: "Search",
    filter: "Filter",
    noData: "No data available",
    success: "Operation successful",
    error: "Operation failed",
    welcome: "Welcome",
    back: "Back",
    close: "Close",
    all: "All",
  },

  // Navigation
  nav: {
    home: "Home",
    courses: "Courses",
    schedule: "My Schedule",
    swapRequests: "Swap Requests",
    courseRequests: "Course Changes",
    profile: "Profile",
    login: "Login",
    register: "Register",
    logout: "Logout",
    admin: "Admin",
    settings: "Settings",
  },

  // Authentication
  auth: {
    username: "Username",
    password: "Password",
    login: "Login",
    register: "Register",
    forgotPassword: "Forgot password?",
    rememberMe: "Remember me",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",
    loginSuccess: "Login successful",
    loginError: "Login failed, please check your username and password",
  },

  // Home page
  home: {
    title: "Course Selection System",
    subtitle: "Your Academic Journey Starts Here",
    description:
      "An efficient and convenient online course selection platform. Easily find and register for courses, manage your learning plan.",
    browseCourses: "Browse Courses",
    loginSystem: "Login",
    featureRichResources: "Rich Course Resources",
    featureResourcesDesc:
      "Offering diverse course options to meet different learning needs and interests.",
    featureFlexibleSelection: "Flexible Selection",
    featureFlexibleDesc:
      "Support for course search, filtering, and comparison to help you make the best choice.",
    featureScheduleManagement: "Smart Schedule Management",
    featureScheduleDesc:
      "Automated course arrangement, avoiding time conflicts, optimizing your learning plan.",
  },

  // Course listing
  courses: {
    title: "Course Listing",
    subtitle: "Browse all available courses, view details or request a swap",
    searchPlaceholder: "Search course name, code or instructor",
    departmentFilter: "Department Filter",
    noCourses: "No matching courses found",
    courseInfo: "Course Information",
    teacherInfo: "Instructor Information",
    credits: "Credits",
    enrolled: "Enrolled",
    capacity: "Capacity",
    remaining: "Remaining Seats",
    location: "Location",
    schedule: "Schedule",
    department: "Department",
    swapable: "Swapable",
    notSwapable: "Not Swapable",
    almostFull: "Almost full, only {count} seats left",
  },

  // Course detail
  courseDetail: {
    title: "Course Details",
    description: "Course Description",
    prerequisites: "Prerequisites",
    swapRules: "Swap Rules",
    swapRequest: "Request Swap",
    enrollNow: "Enroll Now",
    dropCourse: "Drop Course",
    swapNotice: "Swap Request Guidelines",
    swapNoticeItems: [
      "Swap requests must be approved by an administrator, please be patient",
      "Once approved, the system will automatically update your course registration",
      "Each course can only be swapped once per semester",
      "If a request is rejected, you must submit a new request",
      "The target course must have available seats to qualify for a swap",
    ],
  },

  // Swap request
  swapRequest: {
    title: "Course Swap Request",
    subtitle: "Manage your swap requests",
    selectCourse: "Select course to swap",
    selectCoursePlaceholder: "Please select a course",
    targetCourse: "Target Course",
    reason: "Swap Reason",
    reasonPlaceholder:
      "Please explain in detail why you want to swap courses...",
    reasonRequired: "Please provide a reason for the swap",
    reasonMinLength: "Reason must be at least 10 characters",
    timeConflict: "Time Conflict Warning",
    timeConflictDesc:
      "The course you selected conflicts with the target course schedule. Please confirm if you wish to proceed.",
    successMessage: "Swap request submitted successfully, awaiting approval",
    steps: {
      selectCourse: "Select Course",
      fillReason: "Provide Reason",
      submitRequest: "Submit Request",
      selectCourseDesc: "Select the course you want to swap",
      fillReasonDesc: "Explain your reason for swapping",
      submitRequestDesc: "Submit your request",
    },
    validation: {
      selectCourse: "Please select a course to swap",
    },
  },

  // Course request
  courseRequest: {
    title: "Course Change Request",
    pageTitle: "Course Changes",
    pageDescription: "Here you can request to add or remove courses",
    modalTitle: "New Course Change Request",
    newRequest: "New Request",
    currentCourses: "Current Enrolled Courses",
    coursesToRemove: "Courses you wish to remove",
    coursesToAdd: "Courses you wish to add",
    confirmPrerequisites:
      "I have read and checked the prerequisites for the courses I wish to add",
    additionalNotes: "Additional Notes",
    submit: "Submit Request",
    successMessage: "Course change request submitted successfully",
    noteTitle: "Request Guidelines",
    noteDescription:
      "Course change requests must be approved by an administrator. Once approved, the system will automatically update your course registration.",
    placeholder: {
      coursesToRemove: "Please select courses you wish to remove",
      coursesToAdd: "Please select courses you wish to add",
      additionalNotes:
        "If you have any special circumstances or other information, please enter it here...",
    },
    tooltip: {
      coursesToRemove:
        "Select courses you want to remove from your current schedule",
      coursesToAdd: "Select new courses you want to add to your schedule",
      additionalNotes:
        "You can provide more information about your request here",
    },
    validation: {
      coursesToRemoveRequired: "Please select at least one course to remove",
      coursesToAddRequired: "Please select at least one course to add",
      confirmPrerequisites:
        "Please confirm you have read and checked the course prerequisites",
    },
  },

  // Schedule
  schedule: {
    title: "My Schedule",
    subtitle: "View your course schedule and class times",
    weekView: "Week View",
    monthView: "Month View",
    listView: "List View",
    timeSlot: "Time / Date",
    noCourses: "No courses scheduled",
    courseDetails: "Course Details",
  },

  // Admin
  admin: {
    swapRequestsTitle: "Swap Request Management",
    swapRequestsSubtitle: "Manage student swap requests and process approvals",
    studentName: "Student",
    studentId: "Student ID",
    fromCourse: "Original Course",
    toCourse: "Target Course",
    requestTime: "Request Time",
    status: "Status",
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    viewDetails: "View Details",
    requestDetails: "Swap Request Details",
    studentInfo: "Student",
    requestReason: "Request Reason",
    lastUpdated: "Last Updated",
    adminComment: "Admin Comment",
    adminCommentPlaceholder: "Enter processing notes or comments...",
    updateStatus: "Update Status",
    updateSuccess: "Request status updated successfully",
    updateError: "Update failed, please try again",
  },

  // Date and time
  dateTime: {
    days: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
  },
};

export default en;
