import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { StudentAuthProvider } from "./context/StudentAuthContext";
import { FacultyAuthProvider } from "./context/FacultyAuthContext";

// Public Pages
import Landing from "./pages/public/Landing";
import FacultyLogin from "./pages/public/FacultyLogin";
import StudentLogin from "./pages/public/StudentLogin";

// Faculty Pages (Unchanged)
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

            {/* Faculty Routes */}
            <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
            <Route path="/faculty/students/:studentId" element={<FacultyStudentProfile />} />

            {/* Student Routes */}
            <Route path="/student/forgot-password" element={<StudentForgotPassword />} />
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/student/attendance" element={<StudentAttendance />} />
            <Route path="/student/achievements" element={<Achievements />} />
            <Route path="/student/skills" element={<Skills />} />
            <Route path="/student/certificates" element={<Certificates />} />
            <Route path="/student/projects" element={<Projects />} />
            <Route path="/student/remarks" element={<Remarks />} />
            <Route path="/student/settings" element={<StudentSettings />} />
          </Routes>
        </Router>
      </StudentAuthProvider>
    </FacultyAuthProvider>
  );
}

export default App;
