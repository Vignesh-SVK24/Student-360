import React, { useState } from "react";
import {
  X,
  UserPlus,
  User,
  Users,
  GraduationCap,
  Home,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  KeyRound
} from "lucide-react";
import { facultyApi } from "../../services/apiClient";

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStudentAdded: (studentData: any) => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose, onStudentAdded }) => {
  const [activeTab, setActiveTab] = useState<"basic" | "personal" | "guardian" | "academic">("basic");

  // Form State
  const [formData, setFormData] = useState({
    // Basic
    register_number: "",
    first_name: "",
    last_name: "",
    department_id: 1,
    course_id: 1,
    year: "II",
    semester: 3,
    section: "A",
    student_type: "Day Scholar",
    initial_password: "Student@360",

    // Personal
    email: "",
    phone_number: "",
    date_of_birth: "2005-05-15",
    gender: "Male",
    address: "",

    // Guardian
    parent_name: "",
    parent_relationship: "Father",
    parent_phone: "",
    parent_email: "",
    parent_occupation: "",

    // Academic
    school_10th: "",
    board_10th: "State / Matriculation",
    total_marks_10th: 470,
    maximum_marks_10th: 500,
    school_12th: "",
    board_12th: "Tamil Nadu State Board",
    total_marks_12th: 550,
    maximum_marks_12th: 600,
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successData, setSuccessData] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.register_number.trim() || !formData.first_name.trim() || !formData.email.trim()) {
      setErrorMsg("Register number, first name, and email are strictly required.");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {
      const res = await facultyApi.addStudent({
        ...formData,
        register_number: formData.register_number.trim().toUpperCase(),
        total_marks_10th: Number(formData.total_marks_10th) || undefined,
        maximum_marks_10th: Number(formData.maximum_marks_10th) || undefined,
        total_marks_12th: Number(formData.total_marks_12th) || undefined,
        maximum_marks_12th: Number(formData.maximum_marks_12th) || undefined,
      });

      if (res.success && res.data) {
        setSuccessData(res.data);
        onStudentAdded(res.data);
      } else {
        setErrorMsg(res.error || "Failed to create student. Please verify all details.");
      }
    } catch {
      setErrorMsg("Network error occurred while provisioning student.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCredentials = () => {
    const credText = `Student 360 Login Credentials:\nPortal: Student Portal\nRegister Number: ${formData.register_number.toUpperCase()}\nEmail: ${formData.email}\nInitial Password: ${formData.initial_password}`;
    navigator.clipboard.writeText(credText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#042821] via-[#0d4933] to-[#629176] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">Add New Student Profile</h3>
              <p className="text-[11px] text-emerald-200">Provisions Student 360 profile and User Login Account</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success View */}
        {successData ? (
          <div className="p-8 text-center space-y-6 overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-xl font-black text-white">Student Successfully Created!</h4>
              <p className="text-xs text-slate-400 mt-1">
                The student profile and active authentication account have been registered in the database.
              </p>
            </div>

            {/* Credentials Card */}
            <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 text-left space-y-3 max-w-md mx-auto">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Login Credentials</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Ready for Login
                </span>
              </div>
              <div className="text-xs space-y-1.5 font-mono text-slate-200">
                <p><span className="text-slate-400 font-sans">Full Name:</span> {successData.full_name || `${formData.first_name} ${formData.last_name}`}</p>
                <p><span className="text-slate-400 font-sans">Register No:</span> <strong className="text-emerald-400">{successData.register_number}</strong></p>
                <p><span className="text-slate-400 font-sans">Email:</span> {successData.email}</p>
                <p><span className="text-slate-400 font-sans">Initial Password:</span> <strong className="text-purple-400">{formData.initial_password}</strong></p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleCopyCredentials}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Copied Credentials!" : "Copy Credentials"}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#042821] via-[#0d4933] to-[#629176] text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-[#0d4933]/30"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Nav Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 pt-3 gap-2 text-xs font-bold overflow-x-auto">
              {[
                { id: "basic", label: "1. Basic Info", icon: User },
                { id: "personal", label: "2. Personal", icon: Home },
                { id: "guardian", label: "3. Guardian", icon: Users },
                { id: "academic", label: "4. Academics", icon: GraduationCap },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`pb-2.5 px-3 flex items-center gap-1.5 border-b-2 transition-all cursor-pointer shrink-0 ${
                      isActive
                        ? "border-[#629176] text-white"
                        : "border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Error Banner */}
            {errorMsg && (
              <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              {activeTab === "basic" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Register Number (12 Digits) <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={12}
                        value={formData.register_number}
                        onChange={(e) => handleChange("register_number", e.target.value.toUpperCase())}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono uppercase focus:outline-none focus:border-[#629176]"
                        placeholder="720725115000"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Student Type
                      </label>
                      <select
                        value={formData.student_type}
                        onChange={(e) => handleChange("student_type", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-[#629176]"
                      >
                        <option value="Day Scholar">Day Scholar</option>
                        <option value="Hosteller">Hosteller</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        First Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.first_name}
                        onChange={(e) => handleChange("first_name", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#629176]"
                        placeholder="Arun"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Last Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.last_name}
                        onChange={(e) => handleChange("last_name", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#629176]"
                        placeholder="Kumar"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Year</label>
                      <select
                        value={formData.year}
                        onChange={(e) => handleChange("year", e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-[#629176]"
                      >
                        <option value="I">I Year</option>
                        <option value="II">II Year</option>
                        <option value="III">III Year</option>
                        <option value="IV">IV Year</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Semester</label>
                      <input
                        type="number"
                        min={1}
                        max={8}
                        value={formData.semester}
                        onChange={(e) => handleChange("semester", Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#629176]"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Section</label>
                      <input
                        type="text"
                        value={formData.section}
                        onChange={(e) => handleChange("section", e.target.value.toUpperCase())}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white uppercase focus:outline-none focus:border-[#629176]"
                      />
                    </div>
                  </div>

                  {/* Initial Password */}
                  <div className="p-3.5 rounded-xl bg-[#0d4933]/25 border border-[#629176]/30 space-y-1.5">
                    <div className="flex items-center gap-2 text-emerald-300 font-bold">
                      <KeyRound className="w-4 h-4" />
                      <span>Initial Student Login Password</span>
                    </div>
                    <input
                      type="text"
                      value={formData.initial_password}
                      onChange={(e) => handleChange("initial_password", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/20 text-white font-mono text-xs focus:outline-none"
                    />
                    <p className="text-[10px] text-slate-400">
                      Default password given to student for their initial login. They can change this anytime in their settings.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "personal" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        College / Personal Email <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#629176]"
                        placeholder="student@college.edu"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={formData.phone_number}
                        onChange={(e) => handleChange("phone_number", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#629176]"
                        placeholder="+91 98401 23456"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={formData.date_of_birth}
                        onChange={(e) => handleChange("date_of_birth", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#629176]"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Gender</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => handleChange("gender", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-[#629176]"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Permanent Residential Address</label>
                    <textarea
                      rows={2}
                      value={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#629176]"
                      placeholder="Door No, Street Name, Area, City, Pincode"
                    />
                  </div>
                </div>
              )}

              {activeTab === "guardian" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Parent / Guardian Name</label>
                      <input
                        type="text"
                        value={formData.parent_name}
                        onChange={(e) => handleChange("parent_name", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#629176]"
                        placeholder="K. Radhakrishnan"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Relationship</label>
                      <select
                        value={formData.parent_relationship}
                        onChange={(e) => handleChange("parent_relationship", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-[#629176]"
                      >
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Guardian">Guardian</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Contact Phone</label>
                      <input
                        type="text"
                        value={formData.parent_phone}
                        onChange={(e) => handleChange("parent_phone", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#629176]"
                        placeholder="+91 98401 99001"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Occupation</label>
                      <input
                        type="text"
                        value={formData.parent_occupation}
                        onChange={(e) => handleChange("parent_occupation", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#629176]"
                        placeholder="Engineer / Business / Govt. Service"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "academic" && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                    <h5 className="font-bold text-slate-200">Secondary Education (10th Standard)</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-300 mb-1">School Name</label>
                        <input
                          type="text"
                          value={formData.school_10th}
                          onChange={(e) => handleChange("school_10th", e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                          placeholder="Vidya Mandir Mylapore"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-300 mb-1">Marks</label>
                          <input
                            type="number"
                            value={formData.total_marks_10th}
                            onChange={(e) => handleChange("total_marks_10th", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-300 mb-1">Total</label>
                          <input
                            type="number"
                            value={formData.maximum_marks_10th}
                            onChange={(e) => handleChange("maximum_marks_10th", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                    <h5 className="font-bold text-slate-200">Higher Secondary (12th Standard)</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-300 mb-1">School Name</label>
                        <input
                          type="text"
                          value={formData.school_12th}
                          onChange={(e) => handleChange("school_12th", e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                          placeholder="SBOA Matriculation"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-300 mb-1">Marks</label>
                          <input
                            type="number"
                            value={formData.total_marks_12th}
                            onChange={(e) => handleChange("total_marks_12th", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-300 mb-1">Total</label>
                          <input
                            type="number"
                            value={formData.maximum_marks_12th}
                            onChange={(e) => handleChange("maximum_marks_12th", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div>
                  {activeTab !== "basic" && (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeTab === "personal") setActiveTab("basic");
                        else if (activeTab === "guardian") setActiveTab("personal");
                        else if (activeTab === "academic") setActiveTab("guardian");
                      }}
                      className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Previous</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {activeTab !== "academic" ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeTab === "basic") setActiveTab("personal");
                        else if (activeTab === "personal") setActiveTab("guardian");
                        else if (activeTab === "guardian") setActiveTab("academic");
                      }}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white flex items-center gap-1 cursor-pointer font-bold"
                    >
                      <span>Next Section</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : null}

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#042821] via-[#0d4933] to-[#629176] hover:opacity-95 text-white font-bold shadow-lg shadow-[#0d4933]/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Creating Profile...</span>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Provision Student Profile</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};