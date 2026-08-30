import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { StudentAuthProvider } from "./context/StudentAuthContext";
import { FacultyAuthProvider } from "./context/FacultyAuthContext";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";

// Public Pages
import Landing from "./pages/public/Landing";
import FacultyLogin from "./pages/public/FacultyLogin";
import StudentLogin from "./pages/public/StudentLogin";

// Faculty Pages
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import FacultyStudentProfile from "./pages/faculty/FacultyStudentProfile";

// Student Pages
import StudentForgotPassword from "./pages/student/StudentForgotPassword";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentProfile from "./pages/student/StudentProfile";
import StudentAttendance from "./pages/student/StudentAttendance";
import Achievements from "./pages/student/Achievements";
import Skills from "./pages/student/Skills";
import Certificates from "./pages/student/Certificates";
import Projects from "./pages/student/Projects";
import Remarks from "./pages/student/Remarks";
import StudentSettings from "./pages/student/StudentSettings";

function App() {
  return (
    <FacultyAuthProvider>
      <StudentAuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login/faculty" element={<FacultyLogin />} />
            <Route path="/login/student" element={<StudentLogin />} />
            <Route path="/student/forgot-password" element={<StudentForgotPassword />} />

            {/* Protected Faculty Routes */}
            <Route
              path="/faculty/dashboard"
              element={
                <ProtectedRoute role="FACULTY">
                  <FacultyDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/faculty/students/:studentId"
              element={
                <ProtectedRoute role="FACULTY">
                  <FacultyStudentProfile />
                </ProtectedRoute>
              }
            />

            {/* Protected Student Routes */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute role="STUDENT">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/profile"
              element={
                <ProtectedRoute role="STUDENT">
                  <StudentProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/attendance"
              element={
                <ProtectedRoute role="STUDENT">
                  <StudentAttendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/achievements"
              element={
                <ProtectedRoute role="STUDENT">
                  <Achievements />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/skills"
              element={
                <ProtectedRoute role="STUDENT">
                  <Skills />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/certificates"
              element={
                <ProtectedRoute role="STUDENT">
                  <Certificates />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/projects"
              element={
                <ProtectedRoute role="STUDENT">
                  <Projects />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/remarks"
              element={
                <ProtectedRoute role="STUDENT">
                  <Remarks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/settings"
              element={
                <ProtectedRoute role="STUDENT">
                  <StudentSettings />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </StudentAuthProvider>
    </FacultyAuthProvider>
  );
}

export default App;
