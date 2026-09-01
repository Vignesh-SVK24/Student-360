// Student 360 - Central API Client & Auth Gateway

const API_BASE = (import.meta as any).env?.VITE_API_URL || "http://localhost:8000/api/v1";

export interface UserSession {
  id: number;
  email: string;
  username?: string;
  role: "STUDENT" | "FACULTY" | "ADMIN";
  assigned_role?: "HOD" | "ASSOCIATE_PROFESSOR" | "CLASS_ADVISOR" | "CLASS_TUTOR" | "SUBJECT_FACULTY" | string;
  profile_id?: number;
  identifier?: string;
  name?: string;
  profile_photo_url?: string;
  department_name?: string;
  is_active: boolean;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: UserSession;
}

// Token Storage Helpers
export const tokenStorage = {
  getAccessToken: (): string | null => {
    return localStorage.getItem("s360_access_token") || sessionStorage.getItem("s360_access_token");
  },
  getRefreshToken: (): string | null => {
    return localStorage.getItem("s360_refresh_token") || sessionStorage.getItem("s360_refresh_token");
  },
  getUser: (): UserSession | null => {
    const raw = localStorage.getItem("s360_user") || sessionStorage.getItem("s360_user");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  setTokens: (tokens: AuthTokens, rememberMe: boolean = false) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("s360_access_token", tokens.access_token);
    storage.setItem("s360_refresh_token", tokens.refresh_token);
    storage.setItem("s360_user", JSON.stringify(tokens.user));
    storage.setItem("s360_remember_me", rememberMe ? "true" : "false");
  },
  clearTokens: () => {
    localStorage.removeItem("s360_access_token");
    localStorage.removeItem("s360_refresh_token");
    localStorage.removeItem("s360_user");
    localStorage.removeItem("s360_remember_me");
    sessionStorage.removeItem("s360_access_token");
    sessionStorage.removeItem("s360_refresh_token");
    sessionStorage.removeItem("s360_user");
    sessionStorage.removeItem("s360_remember_me");
  },
};

// Generic HTTP Request with Authorization & Automatic Refresh
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<{ success: boolean; data?: T; error?: string }> {
  const token = tokenStorage.getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMsg = json?.message || json?.detail || `Request failed with status ${res.status}`;
      return { success: false, error: errorMsg };
    }

    return { success: true, data: json?.data ?? json };
  } catch (err: any) {
    return { success: false, error: err.message || "Network error. Unable to reach backend server." };
  }
}

// Authentication Endpoints
export const authApi = {
  loginStudent: async (identifier: string, pass: string, rememberMe: boolean = false) => {
    const res = await apiRequest<AuthTokens>("/auth/student/login", {
      method: "POST",
      body: JSON.stringify({ identifier, password: pass, remember_me: rememberMe }),
    });

    if (res.success && res.data) {
      tokenStorage.setTokens(res.data, rememberMe);
    }
    return res;
  },

  loginFaculty: async (identifier: string, pass: string, rememberMe: boolean = false) => {
    const res = await apiRequest<AuthTokens>("/auth/faculty/login", {
      method: "POST",
      body: JSON.stringify({ identifier, password: pass, remember_me: rememberMe }),
    });

    if (res.success && res.data) {
      tokenStorage.setTokens(res.data, rememberMe);
    }
    return res;
  },

  registerFaculty: async (payload: {
    name: string;
    faculty_id: string;
    email: string;
    phone_number?: string;
    department_id?: number;
    designation: string;
    password: string;
    confirm_password: string;
  }) => {
    const res = await apiRequest<AuthTokens>("/auth/faculty/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (res.success && res.data) {
      tokenStorage.setTokens(res.data, false);
    }
    return res;
  },

  getMe: async () => {
    return apiRequest<UserSession>("/auth/me");
  },

  logout: async () => {
    await apiRequest("/auth/logout", { method: "POST" }).catch(() => {});
    tokenStorage.clearTokens();
  },

  changePassword: async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    return apiRequest("/auth/change-password", {
      method: "POST",
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }),
    });
  },

  forgotPassword: async (email: string) => {
    return apiRequest<{ message: string; reset_token?: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (token: string, newPassword: string, confirmPassword: string) => {
    return apiRequest("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({
        token,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }),
    });
  },
};

// Student API
export const studentApi = {
  getMyProfile: async () => {
    return apiRequest<any>("/students/me");
  },

  updateMyName: async (payload: {
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    display_name?: string;
  }) => {
    return apiRequest<any>("/students/me/name", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  getStudentAccess: async (studentId: number | string) => {
    return await apiRequest<{
      student_id: number;
      user_id?: number;
      has_account: boolean;
      username?: string;
      email?: string;
      is_active: boolean;
      status: string;
      last_login_at?: string;
    }>(`/students/${studentId}/access`);
  },

  updateStudentAccess: async (studentId: number | string, payload: { is_active?: boolean; new_password?: string }) => {
    return await apiRequest<any>(`/students/${studentId}/access`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

// Faculty API
export const facultyApi = {
  addStudent: async (payload: {
    register_number: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
    date_of_birth?: string;
    gender?: string;
    address?: string;
    department_id?: number;
    course_id?: number;
    year?: string;
    semester?: number;
    section?: string;
    student_type?: string;
    initial_password?: string;
    parent_name?: string;
    parent_relationship?: string;
    parent_phone?: string;
    parent_email?: string;
    parent_occupation?: string;
    school_10th?: string;
    board_10th?: string;
    total_marks_10th?: number;
    maximum_marks_10th?: number;
    percentage_10th?: number;
    year_of_passing_10th?: number;
    school_12th?: string;
    board_12th?: string;
    total_marks_12th?: number;
    maximum_marks_12th?: number;
    percentage_12th?: number;
    year_of_passing_12th?: number;
  }) => {
    return apiRequest<any>("/students", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

// Timetable API
export interface TimetableSlot {
  id: number;
  day_of_week: string;
  period_number: number;
  start_time: string;
  end_time: string;
  subject_name: string;
  subject_code?: string;
  room?: string;
  faculty_name?: string;
  entry_type?: "SUBJECT" | "LAB" | "BREAK" | "LUNCH" | "FREE" | string;
  classroom_id?: number;
}

export interface DayTimetable {
  day: string;
  slots: TimetableSlot[];
}

export interface WeeklyTimetableResponse {
  days: DayTimetable[];
}

export const timetableApi = {
  getWeeklyTimetable: async () => {
    return await apiRequest<WeeklyTimetableResponse>("/timetable");
  },

  updateSlot: async (slotId: number, payload: Partial<TimetableSlot>) => {
    return await apiRequest<TimetableSlot>(`/timetable/slots/${slotId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  addPeriod: async (payload: { start_time: string; end_time: string; subject_name?: string; entry_type?: string; classroom_id?: number }) => {
    return await apiRequest<WeeklyTimetableResponse>("/timetable/periods", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  deletePeriod: async (periodNumber: number, classroomId?: number) => {
    return await apiRequest<WeeklyTimetableResponse>(`/timetable/periods/${periodNumber}${classroomId ? `?classroom_id=${classroomId}` : ""}`, {
      method: "DELETE",
    });
  },

  resetTimetable: async (classroomId?: number) => {
    return await apiRequest<WeeklyTimetableResponse>(`/timetable/reset${classroomId ? `?classroom_id=${classroomId}` : ""}`, {
      method: "POST",
    });
  },
};

// Period Attendance API
export interface PeriodAttendanceMark {
  student_id: number;
  status: "PRESENT" | "ABSENT" | "OD";
  notes?: string;
}

export interface BulkPeriodAttendanceRequest {
  date: string;
  day_of_week: string;
  period_number: number;
  subject_name: string;
  timetable_slot_id?: number;
  attendance: PeriodAttendanceMark[];
}

export const attendanceApi = {
  recordPeriodAttendance: async (payload: BulkPeriodAttendanceRequest) => {
    return await apiRequest<any>("/attendance/period", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getPeriodAttendance: async (date: string, periodNumber: number) => {
    return await apiRequest<any>(`/attendance/period?date=${date}&period_number=${periodNumber}`);
  },
};

// Classroom Models & API
export interface Classroom {
  id: number;
  class_name: string;
  class_code: string;
  department_id?: number;
  department_name?: string;
  academic_year: string;
  year: string;
  semester: number;
  section: string;
  advisor_faculty_id?: number;
  tutor_faculty_id?: number;
  advisor_name?: string;
  tutor_name?: string;
  student_count: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ClassroomDetailResponse extends Classroom {
  students: any[];
}

export const classroomApi = {
  createClassroom: async (payload: {
    class_name: string;
    academic_year: string;
    year: string;
    semester: number;
    section: string;
    advisor_faculty_id?: number;
    tutor_faculty_id?: number;
  }) => {
    return await apiRequest<Classroom>("/classrooms", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getMyClassroom: async () => {
    return await apiRequest<ClassroomDetailResponse>("/classrooms/my");
  },

  getClassroomDetail: async (id: number) => {
    return await apiRequest<ClassroomDetailResponse>(`/classrooms/${id}`);
  },

  getDepartmentClassrooms: async (deptId: number) => {
    return await apiRequest<Classroom[]>(`/classrooms/department/${deptId}`);
  },

  createStudentInClassroom: async (
    classroomId: number,
    payload: { name: string; register_number: string; password: string; confirm_password?: string }
  ) => {
    return await apiRequest<any>(`/classrooms/${classroomId}/students`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

// Profile Requests Models & API
export interface ProfileEditRequest {
  id: number;
  student_id: number;
  student_name?: string;
  student_register_number?: string;
  student_photo_url?: string;
  classroom_id?: number;
  section_name: string;
  field_name: string;
  current_value?: string;
  requested_value: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "USED";
  requested_at: string;
  reviewed_by_name?: string;
  reviewed_at?: string;
  advisor_comment?: string;
  permission?: {
    id: number;
    student_id: number;
    field_name: string;
    granted_at: string;
    expires_at: string;
    status: string;
  };
}

export const profileRequestApi = {
  submitEditRequest: async (payload: {
    section_name: string;
    field_name: string;
    current_value?: string;
    requested_value: string;
    reason: string;
  }) => {
    return await apiRequest<ProfileEditRequest>("/students/me/profile-edit-requests", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  submitNameChangeRequest: async (payload: { requested_name: string; reason: string }) => {
    const res = await apiRequest<ProfileEditRequest>("/students/me/name-change-request", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (res.success && res.data) {
      return res;
    }
    return profileRequestApi.submitEditRequest({
      section_name: "Name",
      field_name: "full_name",
      requested_value: payload.requested_name,
      reason: payload.reason,
    });
  },

  getMyRequests: async () => {
    return await apiRequest<ProfileEditRequest[]>("/students/me/profile-edit-requests");
  },

  getClassroomRequests: async (classroomId: number, status?: string) => {
    return await apiRequest<ProfileEditRequest[]>(
      `/classrooms/${classroomId}/profile-edit-requests${status ? `?status=${status}` : ""}`
    );
  },

  approveRequest: async (requestId: number, review?: { advisor_comment?: string; permission_duration_hours?: number }) => {
    return await apiRequest<ProfileEditRequest>(`/profile-edit-requests/${requestId}/approve`, {
      method: "POST",
      body: JSON.stringify(review || { action: "APPROVE", permission_duration_hours: 24 }),
    });
  },

  rejectRequest: async (requestId: number, review?: { advisor_comment?: string }) => {
    return await apiRequest<ProfileEditRequest>(`/profile-edit-requests/${requestId}/reject`, {
      method: "POST",
      body: JSON.stringify(review || { action: "REJECT" }),
    });
  },

  applyApprovedField: async (payload: { field_name: string; new_value: string }) => {
    return await apiRequest<any>("/students/me/approved-field", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  applyApprovedProfile: async (payload: Record<string, any>) => {
    return await apiRequest<any>("/students/me/approved-profile", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  completeProfile: async (payload: Record<string, any>) => {
    return await apiRequest<any>("/students/me/complete-profile", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

// Achievement CRUD API (for student self-service)
export const achievementApi = {
  getForStudent: async (studentId: number | string) => {
    return apiRequest<any[]>(`/students/${studentId}/achievements`);
  },
  create: async (payload: { student_id: number; title: string; description?: string; organization?: string; event_name?: string; achievement_date?: string; leadership_role?: string; position?: string }) => {
    return apiRequest<any>("/achievements", { method: "POST", body: JSON.stringify(payload) });
  },
  update: async (id: number, payload: Record<string, any>) => {
    return apiRequest<any>(`/achievements/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
  },
  delete: async (id: number) => {
    return apiRequest<any>(`/achievements/${id}`, { method: "DELETE" });
  },
};

// Skill CRUD API
export const skillApi = {
  getForStudent: async (studentId: number | string) => {
    return apiRequest<any[]>(`/students/${studentId}/skills`);
  },
  create: async (payload: { student_id: number; name: string; category?: string; proficiency_level?: string }) => {
    return apiRequest<any>("/skills", { method: "POST", body: JSON.stringify(payload) });
  },
  update: async (id: number, payload: Record<string, any>) => {
    return apiRequest<any>(`/skills/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
  },
  delete: async (id: number) => {
    return apiRequest<any>(`/skills/${id}`, { method: "DELETE" });
  },
};

// Certificate CRUD API
export const certificateApi = {
  getForStudent: async (studentId: number | string) => {
    return apiRequest<any[]>(`/students/${studentId}/certificates`);
  },
  create: async (payload: { student_id: number; title: string; issuing_organization?: string; issue_date?: string; credential_id?: string; credential_url?: string; thumbnail_url?: string }) => {
    return apiRequest<any>("/certificates", { method: "POST", body: JSON.stringify(payload) });
  },
  update: async (id: number, payload: Record<string, any>) => {
    return apiRequest<any>(`/certificates/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
  },
  delete: async (id: number) => {
    return apiRequest<any>(`/certificates/${id}`, { method: "DELETE" });
  },
};

// Project CRUD API
export const projectApi = {
  getForStudent: async (studentId: number | string) => {
    return apiRequest<any[]>(`/students/${studentId}/projects`);
  },
  create: async (payload: { student_id: number; title: string; short_description?: string; detailed_description?: string; student_role?: string; start_date?: string; end_date?: string; github_url?: string; live_demo_url?: string; project_image_url?: string; technology_names?: string[] }) => {
    return apiRequest<any>("/projects", { method: "POST", body: JSON.stringify(payload) });
  },
  update: async (id: number, payload: Record<string, any>) => {
    return apiRequest<any>(`/projects/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
  },
  delete: async (id: number) => {
    return apiRequest<any>(`/projects/${id}`, { method: "DELETE" });
  },
};

// Profile Links CRUD API
export const profileLinkApi = {
  getForStudent: async (studentId: number | string) => {
    return apiRequest<any[]>(`/students/${studentId}/profile-links`);
  },
  create: async (payload: { student_id: number; platform: string; url: string; is_public?: boolean }) => {
    return apiRequest<any>("/profile-links", { method: "POST", body: JSON.stringify(payload) });
  },
  update: async (id: number, payload: Record<string, any>) => {
    return apiRequest<any>(`/profile-links/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
  },
  delete: async (id: number) => {
    return apiRequest<any>(`/profile-links/${id}`, { method: "DELETE" });
  },
};

// Remarks API (faculty writes, student reads)
export const remarkApi = {
  getForStudent: async (studentId: number | string) => {
    return apiRequest<any[]>(`/students/${studentId}/remarks`);
  },
  create: async (payload: { student_id: number; faculty_id?: number; grade: string; remark: string }) => {
    return apiRequest<any>("/remarks", { method: "POST", body: JSON.stringify(payload) });
  },
  update: async (id: number, payload: Record<string, any>) => {
    return apiRequest<any>(`/remarks/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
  },
  delete: async (id: number) => {
    return apiRequest<any>(`/remarks/${id}`, { method: "DELETE" });
  },
};

// Student Attendance API (read-only for students)
export const studentAttendanceApi = {
  getForStudent: async (studentId: number | string, semester?: number) => {
    const query = semester ? `?semester=${semester}` : '';
    return apiRequest<any[]>(`/students/${studentId}/attendance${query}`);
  },
  getSummary: async (studentId: number | string, semester?: number) => {
    const query = semester ? `?semester=${semester}` : '';
    return apiRequest<any>(`/students/${studentId}/attendance/summary${query}`);
  },
};

// Student Academics API
export const academicApi = {
  getBackground: async (studentId: number | string) => {
    return apiRequest<any>(`/students/${studentId}/academics/background`);
  },
  setBackground: async (payload: Record<string, any>) => {
    return apiRequest<any>("/academics/background", { method: "POST", body: JSON.stringify(payload) });
  },
  getSemesters: async (studentId: number | string) => {
    return apiRequest<any[]>(`/students/${studentId}/academics/semesters`);
  },
  addSemester: async (payload: Record<string, any>) => {
    return apiRequest<any>("/academics/semesters", { method: "POST", body: JSON.stringify(payload) });
  },
  getSubjectMarks: async (studentId: number | string, semester?: number) => {
    const query = semester ? `?semester=${semester}` : '';
    return apiRequest<any[]>(`/students/${studentId}/academics/subject-marks${query}`);
  },
  recordSubjectMarks: async (payload: Record<string, any>) => {
    return apiRequest<any>("/academics/subject-marks", { method: "POST", body: JSON.stringify(payload) });
  },
};

// Student update API (for profile updates)
export const studentUpdateApi = {
  updateStudent: async (studentId: number | string, payload: Record<string, any>) => {
    return apiRequest<any>(`/students/${studentId}`, { method: "PATCH", body: JSON.stringify(payload) });
  },
  getStudentDetail: async (studentId: number | string) => {
    return apiRequest<any>(`/students/${studentId}`);
  },
  searchStudents: async (query: string) => {
    return apiRequest<any>(`/students/search?q=${encodeURIComponent(query)}`);
  },
};