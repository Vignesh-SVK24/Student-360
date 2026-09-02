// Student 360 - Offline Persistent Database Engine
// Provides full local database persistence for preview/static environments (like GitHub Pages)
// or when the backend server is offline, preventing "Failed to fetch" errors.

import type { AuthTokens, UserSession, ProfileEditRequest, WeeklyTimetableResponse } from "./apiClient";

export interface StoredUser {
  id: number;
  email: string;
  username: string;
  password: string;
  role: "STUDENT" | "FACULTY" | "ADMIN";
  assigned_role?: string;
  name: string;
  profile_id: number;
  identifier: string;
  department_name: string;
  is_active: boolean;
}

const STORAGE_KEYS = {
  USERS: "s360_db_users",
  STUDENTS: "s360_db_students",
  FACULTY: "s360_db_faculty",
  REQUESTS: "s360_db_requests",
  CLASSROOMS: "s360_db_classrooms",
  TIMETABLE: "s360_db_timetable",
  ATTENDANCE: "s360_db_attendance",
  ACHIEVEMENTS: "s360_db_achievements",
  SKILLS: "s360_db_skills",
  CERTIFICATES: "s360_db_certificates",
  PROJECTS: "s360_db_projects",
  REMARKS: "s360_db_remarks",
};

// Seed initial users if not present
function initializeOfflineStore() {
  if (localStorage.getItem(STORAGE_KEYS.USERS) && !localStorage.getItem("s360_db_v3")) {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.setItem("s360_db_v3", "true");
  }

  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const initialUsers: StoredUser[] = [
      {
        id: 1,
        email: "ramanujam.s@college.edu",
        username: "ramanujam115",
        password: "Faculty@360",
        role: "FACULTY",
        assigned_role: "CLASS_ADVISOR",
        name: "Dr. S. Ramanujam",
        profile_id: 1,
        identifier: "ramanujam115",
        department_name: "Artificial Intelligence & Data Science",
        is_active: true,
      },
      {
        id: 2,
        email: "arun.kumar@college.edu",
        username: "720725115001",
        password: "Student@360",
        role: "STUDENT",
        name: "Arun Kumar",
        profile_id: 1,
        identifier: "720725115001",
        department_name: "Artificial Intelligence & Data Science",
        is_active: true,
      },
      {
        id: 3,
        email: "vignesh.k@college.edu",
        username: "720725115002",
        password: "Student@360",
        role: "STUDENT",
        name: "Vignesh K",
        profile_id: 2,
        identifier: "720725115002",
        department_name: "Artificial Intelligence & Data Science",
        is_active: true,
      },
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
  }

  if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
    const initialStudents: any[] = [
      {
        id: 1,
        user_id: 2,
        register_number: "720725115001",
        first_name: "Arun",
        last_name: "Kumar",
        full_name: "Arun Kumar",
        email: "arun.kumar@college.edu",
        phone_number: "+91 98451 23410",
        dob: "2005-05-14",
        gender: "Male",
        address: "42, Bharathiar Street, Anna Nagar, Chennai - 600040",
        student_type: "DAY SCHOLAR",
        course_name: "B.Tech Artificial Intelligence & Data Science",
        department_name: "Artificial Intelligence & Data Science",
        year: "II",
        semester: 3,
        section: "A",
        cgpa: 8.42,
        attendance_percentage: 92,
        is_locked: true,
        profile_status: "COMPLETED",
        profile_photo_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
        guardians: [
          {
            parent_name: "S. Kumaravel",
            relationship: "Father",
            phone_number: "+91 94440 98765",
            email: "kumaravel.s@techcorp.in",
            occupation: "Senior Electrical Engineer",
          },
        ],
        academic_background: {
          school_10th: "St. John's Higher Secondary School",
          marks_10th: 472,
          maximum_10th: 500,
          percentage_10th: 94.4,
          school_12th: "Kendriya Vidyalaya IIT Campus",
          marks_12th: 562,
          maximum_12th: 600,
          percentage_12th: 93.6,
        },
        profile_links: [
          { platform: "GitHub", url: "https://github.com/arunkumar-aiml" },
          { platform: "LinkedIn", url: "https://linkedin.com/in/arunkumar-aiml" },
          { platform: "Portfolio", url: "https://arunkumar-ai.dev" },
        ],
        achievements: [
          {
            id: 1,
            title: "Smart India Hackathon 2025 - 1st Place",
            event_name: "Smart India Hackathon",
            organization: "AICTE / MoE",
            achievement_date: "2025-12-20",
            position: "Winner",
            description: "Developed edge-AI computer vision defect detection system for industrial manufacturing pipelines.",
          },
        ],
        skills: [
          { id: 1, name: "Python", category: "Programming", proficiency_level: "Expert" },
          { id: 2, name: "PyTorch & Transformers", category: "Technical", proficiency_level: "Advanced" },
          { id: 3, name: "FastAPI & REST APIs", category: "Technical", proficiency_level: "Intermediate" },
        ],
        projects: [
          {
            id: 1,
            title: "Neural Vision Defect Detector",
            short_description: "Real-time edge computer vision model for manufacturing anomaly detection.",
            detailed_description: "Built with YOLOv8 and TensorRT running at 60 FPS on Jetson Nano.",
            student_role: "Lead ML Engineer",
            github_url: "https://github.com/arunkumar-aiml/neural-vision",
            live_demo_url: "https://vision-defect.ai",
            technology_names: ["Python", "PyTorch", "OpenCV", "TensorRT"],
          },
        ],
        certificates: [
          {
            id: 1,
            title: "AWS Certified Machine Learning - Specialty",
            issuing_organization: "Amazon Web Services",
            issue_date: "2025-11-10",
            credential_id: "AWS-MLS-789012",
            credential_url: "https://aws.amazon.com/verify",
            thumbnail_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80",
          },
        ],
        remarks: [
          {
            id: 1,
            faculty_name: "Dr. S. Ramanujam",
            grade: "Excellent",
            remark: "Demonstrates exceptional analytical acumen in applied Machine Learning models. High initiative during semester projects.",
            created_at: "2026-08-20T10:00:00Z",
          },
        ],
      },
    ];
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(initialStudents));
  }
}

// Helper to get stored items
function getStored<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setStored(key: string, val: any) {
  localStorage.setItem(key, JSON.stringify(val));
}

// Generate Auth Token
function createMockAuthTokens(user: StoredUser): AuthTokens {
  const session: UserSession = {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
    assigned_role: user.assigned_role,
    name: user.name,
    profile_id: user.profile_id,
    identifier: user.identifier,
    department_name: user.department_name,
    is_active: user.is_active,
  };

  return {
    access_token: `mock-jwt-${user.id}-${Date.now()}`,
    refresh_token: `mock-refresh-${user.id}-${Date.now()}`,
    token_type: "Bearer",
    expires_in: 3600,
    user: session,
  };
}

export const offlineDb = {
  init: initializeOfflineStore,

  loginStudent: async (identifier: string, pass: string): Promise<{ success: boolean; data?: AuthTokens; error?: string }> => {
    initializeOfflineStore();
    const users: StoredUser[] = getStored(STORAGE_KEYS.USERS, []);
    const cleanId = identifier.trim().toLowerCase();

    const user = users.find(
      (u) => u.role === "STUDENT" && (u.username.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId || u.identifier.toLowerCase() === cleanId)
    );

    if (!user) {
      // Allow effortless login for 12-digit register numbers or legacy IDs
      if (cleanId === "720725115001" || cleanId.startsWith("7207") || cleanId.length === 12 || cleanId.startsWith("23aim")) {
        const studentUser: StoredUser = {
          id: 2,
          email: `${cleanId}@college.edu`,
          username: cleanId.toUpperCase(),
          password: pass || "Student@360",
          role: "STUDENT",
          name: "Arun Kumar",
          profile_id: 1,
          identifier: cleanId.toUpperCase(),
          department_name: "Artificial Intelligence & Data Science",
          is_active: true,
        };
        return { success: true, data: createMockAuthTokens(studentUser) };
      }
      return { success: false, error: `Student account '${identifier}' not found.` };
    }

    if (user.password && user.password !== pass) {
      return { success: false, error: "Incorrect password. Default is Student@360" };
    }

    return { success: true, data: createMockAuthTokens(user) };
  },

  loginFaculty: async (identifier: string, pass: string): Promise<{ success: boolean; data?: AuthTokens; error?: string }> => {
    initializeOfflineStore();
    const users: StoredUser[] = getStored(STORAGE_KEYS.USERS, []);
    const cleanId = identifier.trim().toLowerCase();

    const user = users.find(
      (u) => u.role === "FACULTY" && (u.username.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId || u.identifier.toLowerCase() === cleanId)
    );

    if (!user) {
      // Fallback for advisor demo with ramanujam115 or name115
      if (cleanId === "ramanujam115" || cleanId.endsWith("115") || cleanId === "fac-aiml-01" || cleanId.includes("faculty") || cleanId.includes("ramanujam")) {
        const facUser: StoredUser = {
          id: 1,
          email: "ramanujam.s@college.edu",
          username: "ramanujam115",
          password: pass || "Faculty@360",
          role: "FACULTY",
          assigned_role: "CLASS_ADVISOR",
          name: "Dr. S. Ramanujam",
          profile_id: 1,
          identifier: "ramanujam115",
          department_name: "Artificial Intelligence & Data Science",
          is_active: true,
        };
        return { success: true, data: createMockAuthTokens(facUser) };
      }
      return { success: false, error: `Faculty account '${identifier}' not found. Please register or use ramanujam115.` };
    }

    if (user.password && user.password !== pass) {
      return { success: false, error: "Incorrect password. Default is Faculty@360" };
    }

    return { success: true, data: createMockAuthTokens(user) };
  },

  registerFaculty: async (payload: {
    name: string;
    faculty_id: string;
    email: string;
    phone_number?: string;
    designation: string;
    assigned_role?: string;
    password: string;
  }): Promise<{ success: boolean; data?: AuthTokens; error?: string }> => {
    initializeOfflineStore();
    const users: StoredUser[] = getStored(STORAGE_KEYS.USERS, []);

    if (users.some((u) => u.username.toLowerCase() === payload.faculty_id.trim().toLowerCase())) {
      return { success: false, error: `Faculty ID '${payload.faculty_id}' already registered.` };
    }

    const newUser: StoredUser = {
      id: users.length + 10,
      email: payload.email.trim(),
      username: payload.faculty_id.trim().toUpperCase(),
      password: payload.password,
      role: "FACULTY",
      assigned_role: payload.assigned_role || "CLASS_ADVISOR",
      name: payload.name.trim(),
      profile_id: users.length + 10,
      identifier: payload.faculty_id.trim().toUpperCase(),
      department_name: "Artificial Intelligence & Data Science",
      is_active: true,
    };

    users.push(newUser);
    setStored(STORAGE_KEYS.USERS, users);

    return { success: true, data: createMockAuthTokens(newUser) };
  },

  getMe: async (): Promise<{ success: boolean; data?: UserSession; error?: string }> => {
    initializeOfflineStore();
    const rawUser = localStorage.getItem("s360_user") || sessionStorage.getItem("s360_user");
    if (rawUser) {
      try {
        return { success: true, data: JSON.parse(rawUser) };
      } catch {}
    }
    // Default to advisor if session exists
    return {
      success: true,
      data: {
        id: 1,
        email: "ramanujam.s@college.edu",
        username: "FAC-AIML-01",
        role: "FACULTY",
        assigned_role: "CLASS_ADVISOR",
        name: "Dr. S. Ramanujam",
        profile_id: 1,
        identifier: "FAC-AIML-01",
        department_name: "Artificial Intelligence & Data Science",
        is_active: true,
      },
    };
  },

  getMyProfile: async (): Promise<{ success: boolean; data?: any; error?: string }> => {
    initializeOfflineStore();
    const students = getStored<any[]>(STORAGE_KEYS.STUDENTS, []);
    const student = students[0];
    return { success: true, data: student };
  },

  applyApprovedProfile: async (data: any): Promise<{ success: boolean; data?: any; error?: string }> => {
    initializeOfflineStore();
    const students = getStored<any[]>(STORAGE_KEYS.STUDENTS, []);
    if (students.length > 0) {
      if (data.name) students[0].full_name = data.name;
      if (data.email) students[0].email = data.email;
      if (data.phone) students[0].phone_number = data.phone;
      if (data.address) students[0].address = data.address;
      if (data.residenceType) students[0].student_type = data.residenceType;
      if (data.parentName && students[0].guardians?.[0]) {
        students[0].guardians[0].parent_name = data.parentName;
        students[0].guardians[0].phone_number = data.parentContact;
        students[0].guardians[0].email = data.parentEmail;
        students[0].guardians[0].occupation = data.parentOccupation;
      }
      students[0].is_locked = true;
      setStored(STORAGE_KEYS.STUDENTS, students);

      // Also mark active permission as used
      const requests = getStored<ProfileEditRequest[]>(STORAGE_KEYS.REQUESTS, []);
      requests.forEach((r) => {
        if (r.status === "APPROVED" && r.permission) {
          r.permission.status = "USED";
        }
      });
      setStored(STORAGE_KEYS.REQUESTS, requests);

      return { success: true, data: students[0] };
    }
    return { success: false, error: "Student profile not found." };
  },

  submitEditRequest: async (payload: any): Promise<{ success: boolean; data?: ProfileEditRequest; error?: string }> => {
    initializeOfflineStore();
    const requests = getStored<ProfileEditRequest[]>(STORAGE_KEYS.REQUESTS, []);
    const newReq: ProfileEditRequest = {
      id: requests.length + 1,
      student_id: 1,
      classroom_id: 1,
      student_name: "Arun Kumar",
      student_register_number: "23AIM001",
      section_name: payload.section_name || "My Profile",
      field_name: payload.field_name || "MY_PROFILE",
      current_value: payload.current_value || "Locked Profile",
      requested_value: payload.requested_value || "Full 'MY PROFILE' Edit Access",
      reason: payload.reason || "Profile Update",
      status: "PENDING",
      requested_at: new Date().toISOString(),
    };
    requests.unshift(newReq);
    setStored(STORAGE_KEYS.REQUESTS, requests);
    return { success: true, data: newReq };
  },

  getMyRequests: async (): Promise<{ success: boolean; data?: ProfileEditRequest[]; error?: string }> => {
    initializeOfflineStore();
    const requests = getStored<ProfileEditRequest[]>(STORAGE_KEYS.REQUESTS, []);
    return { success: true, data: requests };
  },

  getClassroomRequests: async (_classroomId: number, statusFilter?: string): Promise<{ success: boolean; data?: ProfileEditRequest[]; error?: string }> => {
    initializeOfflineStore();
    let requests = getStored<ProfileEditRequest[]>(STORAGE_KEYS.REQUESTS, []);
    if (statusFilter) {
      requests = requests.filter((r) => r.status === statusFilter);
    }
    return { success: true, data: requests };
  },

  approveRequest: async (id: number, comment?: string): Promise<{ success: boolean; data?: ProfileEditRequest; error?: string }> => {
    initializeOfflineStore();
    const requests = getStored<ProfileEditRequest[]>(STORAGE_KEYS.REQUESTS, []);
    const req = requests.find((r) => r.id === id);
    if (req) {
      req.status = "APPROVED";
      req.advisor_comment = comment || "Approved by Class Advisor";
      const expires = new Date();
      expires.setHours(expires.getHours() + 24);
      req.permission = {
        id: id,
        student_id: req.student_id || 1,
        field_name: req.field_name,
        granted_at: new Date().toISOString(),
        expires_at: expires.toISOString(),
        status: "ACTIVE",
      };
      setStored(STORAGE_KEYS.REQUESTS, requests);

      // Unlock student profile
      const students = getStored<any[]>(STORAGE_KEYS.STUDENTS, []);
      if (students.length > 0) {
        students[0].is_locked = false;
        setStored(STORAGE_KEYS.STUDENTS, students);
      }

      return { success: true, data: req };
    }
    return { success: false, error: "Request not found" };
  },

  rejectRequest: async (id: number, comment?: string): Promise<{ success: boolean; data?: ProfileEditRequest; error?: string }> => {
    initializeOfflineStore();
    const requests = getStored<ProfileEditRequest[]>(STORAGE_KEYS.REQUESTS, []);
    const req = requests.find((r) => r.id === id);
    if (req) {
      req.status = "REJECTED";
      req.advisor_comment = comment || "Rejected by Class Advisor";
      setStored(STORAGE_KEYS.REQUESTS, requests);
      return { success: true, data: req };
    }
    return { success: false, error: "Request not found" };
  },

  getMyClassroom: async (): Promise<{ success: boolean; data?: any; error?: string }> => {
    initializeOfflineStore();
    const students = getStored<any[]>(STORAGE_KEYS.STUDENTS, []);
    const classroom = {
      id: 1,
      class_name: "AI & DS - Year II Section A",
      class_code: "AIDS-IIA-2025",
      academic_year: "2025-2026",
      year: "II",
      semester: 3,
      section: "A",
      department_name: "Artificial Intelligence & Data Science",
      course_name: "B.Tech Artificial Intelligence & Data Science",
      advisor_name: "Dr. S. Ramanujam",
      students: students,
      subjects: [
        { id: 1, code: "AI8401", name: "Deep Learning Architectures", credits: 4 },
        { id: 2, code: "AI8402", name: "Natural Language Processing", credits: 4 },
        { id: 3, code: "AI8403", name: "Computer Vision", credits: 3 },
        { id: 4, code: "CS8403", name: "Cloud & Distributed Systems", credits: 3 },
      ],
    };
    return { success: true, data: classroom };
  },

  getWeeklyTimetable: async (): Promise<{ success: boolean; data?: WeeklyTimetableResponse; error?: string }> => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const subjectList = [
      { code: "AI8401", name: "Deep Learning Architectures", room: "LH-301", faculty: "Dr. Sarah Jenkins" },
      { code: "AI8402", name: "Natural Language Processing", room: "LH-301", faculty: "Dr. K. Senthil Nathan" },
      { code: "AI8403", name: "Computer Vision", room: "AI Lab 1", faculty: "Dr. S. Ramanujam" },
      { code: "CS8403", name: "Cloud & Distributed Systems", room: "LH-302", faculty: "Prof. M. Rajesh" },
      { code: "DS8401", name: "Big Data Technologies", room: "Server Lab", faculty: "Dr. Ananya Roy" },
    ];

    const weeklyDays = days.map((day, dIdx) => ({
      day,
      slots: [1, 2, 3, 4, 5, 6].map((pNum) => {
        const sub = subjectList[(dIdx + pNum) % subjectList.length];
        return {
          id: dIdx * 10 + pNum,
          day_of_week: day,
          period_number: pNum,
          start_time: `${8 + pNum}:00`,
          end_time: `${9 + pNum}:00`,
          subject_name: sub.name,
          subject_code: sub.code,
          faculty_name: sub.faculty,
          room: sub.room,
          slot_type: "REGULAR" as const,
        };
      }),
    }));

    return {
      success: true,
      data: {
        classroom_id: 1,
        classroom_name: "AI & DS - Year II Section A",
        academic_year: "2025-2026",
        days: weeklyDays,
      },
    };
  },

  searchStudents: async (query: string): Promise<{ success: boolean; data?: any; error?: string }> => {
    initializeOfflineStore();
    const students = getStored<any[]>(STORAGE_KEYS.STUDENTS, []);
    const q = query.toLowerCase();
    const filtered = q
      ? students.filter(
          (s) =>
            s.full_name?.toLowerCase().includes(q) ||
            s.register_number?.toLowerCase().includes(q) ||
            s.email?.toLowerCase().includes(q)
        )
      : students;
    return { success: true, data: { items: filtered, total: filtered.length } };
  },

  getStudentDetail: async (id: number | string): Promise<{ success: boolean; data?: any; error?: string }> => {
    initializeOfflineStore();
    const students = getStored<any[]>(STORAGE_KEYS.STUDENTS, []);
    const found = students.find((s) => String(s.id) === String(id) || s.register_number === id);
    return { success: true, data: found || students[0] };
  },

  updateStudent: async (id: number | string, payload: any): Promise<{ success: boolean; data?: any; error?: string }> => {
    initializeOfflineStore();
    const students = getStored<any[]>(STORAGE_KEYS.STUDENTS, []);
    const found = students.find((s) => String(s.id) === String(id) || s.register_number === id);
    if (found) {
      Object.assign(found, payload);
      setStored(STORAGE_KEYS.STUDENTS, students);
      return { success: true, data: found };
    }
    return { success: false, error: "Student not found" };
  },

  addStudent: async (payload: any): Promise<{ success: boolean; data?: any; error?: string }> => {
    initializeOfflineStore();
    const students = getStored<any[]>(STORAGE_KEYS.STUDENTS, []);
    const newStudent = {
      id: students.length + 10,
      user_id: students.length + 10,
      register_number: payload.register_number,
      first_name: payload.first_name,
      last_name: payload.last_name,
      full_name: `${payload.first_name} ${payload.last_name}`.trim(),
      email: payload.email,
      phone_number: payload.phone_number,
      student_type: payload.student_type || "DAY SCHOLAR",
      course_name: "B.Tech Artificial Intelligence & Data Science",
      department_name: "Artificial Intelligence & Data Science",
      year: payload.year || "II",
      section: payload.section || "A",
      cgpa: 8.0,
      attendance_percentage: 100,
      is_locked: false,
      profile_status: "INCOMPLETE",
      profile_photo_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      achievements: [],
      skills: [],
      projects: [],
      certificates: [],
      remarks: [],
      guardians: [],
    };
    students.unshift(newStudent);
    setStored(STORAGE_KEYS.STUDENTS, students);
    return { success: true, data: newStudent };
  },

  recordPeriodAttendance: async (payload: any): Promise<{ success: boolean; data?: any; error?: string }> => {
    initializeOfflineStore();
    const attList = getStored<any[]>(STORAGE_KEYS.ATTENDANCE, []);
    attList.unshift(payload);
    setStored(STORAGE_KEYS.ATTENDANCE, attList);
    return { success: true, data: payload };
  },

  getPeriodAttendance: async (date: string, periodNumber: number): Promise<{ success: boolean; data?: any; error?: string }> => {
    initializeOfflineStore();
    const attList = getStored<any[]>(STORAGE_KEYS.ATTENDANCE, []);
    const match = attList.find((a) => a.date === date && a.period_number === periodNumber);
    return { success: true, data: match || { records: [] } };
  },

  // Achievement CRUD
  addAchievement: async (payload: any): Promise<{ success: boolean; data?: any; error?: string }> => {
    initializeOfflineStore();
    const students = getStored<any[]>(STORAGE_KEYS.STUDENTS, []);
    if (students.length > 0) {
      if (!students[0].achievements) students[0].achievements = [];
      const newAch = { id: Date.now(), ...payload };
      students[0].achievements.unshift(newAch);
      setStored(STORAGE_KEYS.STUDENTS, students);
      return { success: true, data: newAch };
    }
    return { success: false, error: "Student not found" };
  },

  deleteAchievement: async (id: number): Promise<{ success: boolean; error?: string }> => {
    initializeOfflineStore();
    const students = getStored<any[]>(STORAGE_KEYS.STUDENTS, []);
    if (students.length > 0 && students[0].achievements) {
      students[0].achievements = students[0].achievements.filter((a: any) => a.id !== id);
      setStored(STORAGE_KEYS.STUDENTS, students);
      return { success: true };
    }
    return { success: true };
  },

  // Skill CRUD
  addSkill: async (payload: any): Promise<{ success: boolean; data?: any; error?: string }> => {
    initializeOfflineStore();
    const students = getStored<any[]>(STORAGE_KEYS.STUDENTS, []);
    if (students.length > 0) {
      if (!students[0].skills) students[0].skills = [];
      const newSk = { id: Date.now(), ...payload };
      students[0].skills.unshift(newSk);
      setStored(STORAGE_KEYS.STUDENTS, students);
      return { success: true, data: newSk };
    }
    return { success: false, error: "Student not found" };
  },

  deleteSkill: async (id: number): Promise<{ success: boolean; error?: string }> => {
    initializeOfflineStore();
    const students = getStored<any[]>(STORAGE_KEYS.STUDENTS, []);
    if (students.length > 0 && students[0].skills) {
      students[0].skills = students[0].skills.filter((s: any) => s.id !== id);
      setStored(STORAGE_KEYS.STUDENTS, students);
      return { success: true };
    }
    return { success: true };
  },

  // Certificate CRUD
  addCertificate: async (payload: any): Promise<{ success: boolean; data?: any; error?: string }> => {
    initializeOfflineStore();
    const students = getStored<any[]>(STORAGE_KEYS.STUDENTS, []);
    if (students.length > 0) {
      if (!students[0].certificates) students[0].certificates = [];
      const newCert = { id: Date.now(), ...payload };
      students[0].certificates.unshift(newCert);
      setStored(STORAGE_KEYS.STUDENTS, students);
      return { success: true, data: newCert };
    }
    return { success: false, error: "Student not found" };
  },

  deleteCertificate: async (id: number): Promise<{ success: boolean; error?: string }> => {
    initializeOfflineStore();
    const students = getStored<any[]>(STORAGE_KEYS.STUDENTS, []);
    if (students.length > 0 && students[0].certificates) {
      students[0].certificates = students[0].certificates.filter((c: any) => c.id !== id);
      setStored(STORAGE_KEYS.STUDENTS, students);
      return { success: true };
    }
    return { success: true };
  },

  // Project CRUD
  addProject: async (payload: any): Promise<{ success: boolean; data?: any; error?: string }> => {
    initializeOfflineStore();
    const students = getStored<any[]>(STORAGE_KEYS.STUDENTS, []);
    if (students.length > 0) {
      if (!students[0].projects) students[0].projects = [];
      const newProj = { id: Date.now(), ...payload };
      students[0].projects.unshift(newProj);
      setStored(STORAGE_KEYS.STUDENTS, students);
      return { success: true, data: newProj };
    }
    return { success: false, error: "Student not found" };
  },

  deleteProject: async (id: number): Promise<{ success: boolean; error?: string }> => {
    initializeOfflineStore();
    const students = getStored<any[]>(STORAGE_KEYS.STUDENTS, []);
    if (students.length > 0 && students[0].projects) {
      students[0].projects = students[0].projects.filter((p: any) => p.id !== id);
      setStored(STORAGE_KEYS.STUDENTS, students);
      return { success: true };
    }
    return { success: true };
  },

  // Remark CRUD
  addRemark: async (payload: any): Promise<{ success: boolean; data?: any; error?: string }> => {
    initializeOfflineStore();
    const students = getStored<any[]>(STORAGE_KEYS.STUDENTS, []);
    if (students.length > 0) {
      if (!students[0].remarks) students[0].remarks = [];
      const newRem = {
        id: Date.now(),
        faculty_name: "Dr. S. Ramanujam",
        grade: payload.grade,
        remark: payload.remark,
        created_at: new Date().toISOString(),
      };
      students[0].remarks.unshift(newRem);
      setStored(STORAGE_KEYS.STUDENTS, students);
      return { success: true, data: newRem };
    }
    return { success: false, error: "Student not found" };
  },
};
