// Student 360 - Central API Client & Auth Gateway

const API_BASE = (import.meta as any).env?.VITE_API_URL || "http://localhost:8000/api/v1";

export interface UserSession {
  id: number;
  email: string;
  username?: string;
  role: "STUDENT" | "FACULTY" | "ADMIN";
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