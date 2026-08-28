import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Bell,
  Lock,
  LogOut,
  Check,
  Eye,
  EyeOff
} from "lucide-react";
import StudentLayout from "../../components/student/StudentLayout";
import { GlassButton } from '../../components/ui/GlassButton';
import { useStudentAuth } from "../../context/StudentAuthContext";

export default function StudentSettings() {
  const navigate = useNavigate();
  const { student, logout } = useStudentAuth();

  const [notificationEmail, setNotificationEmail] = useState(true);
  const [notificationSms, setNotificationSms] = useState(false);
  const [notificationGrades, setNotificationGrades] = useState(true);

  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPass || newPass !== confirmPass) {
      showToast("Passwords do not match!");
      return;
    }
    showToast("Password updated successfully!");
    setCurrentPass("");
    setNewPass("");
    setConfirmPass("");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login/student");
  };

  return (
    <StudentLayout
      pageTitle="Settings"
      subtitle="Account security, notifications & session preferences"
      showBack={true}
    >
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-sm font-semibold border border-slate-700">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Account Information Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/60 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Student Account</h3>
              <p className="text-xs text-slate-500 font-medium">Logged in as {student.name} ({student.registerNumber})</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl">
              <p className="text-slate-400 font-bold uppercase text-[10px] mb-0.5">Primary Student Email</p>
              <p className="font-bold text-slate-800 text-sm">{student.personal.email}</p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl">
              <p className="text-slate-400 font-bold uppercase text-[10px] mb-0.5">Registered Mobile</p>
              <p className="font-bold text-slate-800 text-sm">{student.personal.phone}</p>
            </div>
          </div>
        </div>

        {/* Security & Password Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/60 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Security & Authentication</h3>
              <p className="text-xs text-slate-500 font-medium">Manage student portal login password</p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Current Password
              </label>
              <input
                type={showPass ? "text" : "password"}
                required
                value={currentPass}
                onChange={(e: any) => setCurrentPass(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <input
                type={showPass ? "text" : "password"}
                required
                value={newPass}
                onChange={(e: any) => setNewPass(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <input
                type={showPass ? "text" : "password"}
                required
                value={confirmPass}
                onChange={(e: any) => setConfirmPass(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 cursor-pointer"
              >
                {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPass ? "Hide Passwords" : "Show Passwords"}</span>
              </button>

              <GlassButton type="submit" className="bg-slate-900 hover:bg-slate-800 text-white text-xs cursor-pointer">
                Update Password
              </GlassButton>
            </div>
          </form>
        </div>

        {/* Notifications Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/60 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Notifications & Alerts</h3>
              <p className="text-xs text-slate-500 font-medium">Select notifications delivered to your device</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/70 transition-colors cursor-pointer">
              <div>
                <p className="text-sm font-bold text-slate-800">Email Notifications</p>
                <p className="text-xs text-slate-500">Attendance thresholds and official department announcements</p>
              </div>
              <input
                type="checkbox"
                checked={notificationEmail}
                onChange={(e: any) => setNotificationEmail(e.target.checked)}
                className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/70 transition-colors cursor-pointer">
              <div>
                <p className="text-sm font-bold text-slate-800">Faculty Remarks Alert</p>
                <p className="text-xs text-slate-500">Receive immediate notice when a faculty advisor submits feedback</p>
              </div>
              <input
                type="checkbox"
                checked={notificationGrades}
                onChange={(e: any) => setNotificationGrades(e.target.checked)}
                className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/70 transition-colors cursor-pointer">
              <div>
                <p className="text-sm font-bold text-slate-800">SMS Urgent Advisories</p>
                <p className="text-xs text-slate-500">Exam scheduling and emergency college advisories</p>
              </div>
              <input
                type="checkbox"
                checked={notificationSms}
                onChange={(e: any) => setNotificationSms(e.target.checked)}
                className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500"
              />
            </label>
          </div>
        </div>

        {/* Session / Logout */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-red-100 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-red-700">Student Session</h3>
              <p className="text-xs text-slate-500 font-medium">Terminate current session and sign out from this browser</p>
            </div>
            <GlassButton
              onClick={handleLogout}
              variant="danger"
              className="gap-2 cursor-pointer text-xs"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </GlassButton>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
