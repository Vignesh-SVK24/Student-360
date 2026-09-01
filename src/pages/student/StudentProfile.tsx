import { useState, useEffect } from "react";
import {
  Camera,
  ExternalLink,
  Globe,
  Mail,
  Phone,
  MapPin,
  Building,
  GraduationCap,
  Check,
  Calendar,
  UserCheck,
  Code,
  Lock,
  Unlock,
  Clock,
  Send,
  Sparkles
} from "lucide-react";
import StudentLayout from "../../components/student/StudentLayout";
import { GlassDrawer } from '../../components/ui/GlassDrawer';
import { GlassModal } from '../../components/ui/GlassModal';
import { GlassInput } from '../../components/ui/GlassInput';
import { GlassButton } from '../../components/ui/GlassButton';
import { useStudentAuth } from "../../context/StudentAuthContext";
import { studentService } from "../../services/studentData";
import { profileRequestApi, type ProfileEditRequest } from "../../services/apiClient";
import { RequestEditModal } from "../../components/student/RequestEditModal";
import { CompleteProfileModal } from "../../components/student/CompleteProfileModal";

export default function StudentProfile() {
  const { student, refreshStudent } = useStudentAuth();

  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isCompleteProfileOpen, setIsCompleteProfileOpen] = useState(false);
  const [preselectedField, setPreselectedField] = useState<{ section: string; field: string; currentValue: string } | undefined>();
  const [newPhotoUrl, setNewPhotoUrl] = useState(student.profileImage);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Edit requests & permissions
  const [myRequests, setMyRequests] = useState<ProfileEditRequest[]>([]);
  const [activePermField, setActivePermField] = useState<string>("");
  const [activePermValue, setActivePermValue] = useState<string>("");
  const [savingActivePerm, setSavingActivePerm] = useState(false);

  const fetchRequests = async () => {
    try {
      const res = await profileRequestApi.getMyRequests();
      if (res.success && res.data) {
        setMyRequests(res.data);
        const active = res.data.find(r => r.permission && r.permission.status === "ACTIVE" && new Date(r.permission.expires_at) > new Date());
        if (active) {
          setActivePermField(active.field_name);
          setActivePermValue(active.requested_value || "");
        } else {
          setActivePermField("");
        }
      }
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Edit form state
  const [formData, setFormData] = useState({
    name: student.name,
    registerNumber: student.registerNumber,
    email: student.personal.email,
    phone: student.personal.phone,
    address: student.personal.address,
    residenceType: student.personal.residenceType,
    parentName: student.parent.name,
    parentContact: student.parent.contact,
    parentEmail: student.parent.email,
    parentOccupation: student.parent.occupation,
    github: student.links.github,
    linkedin: student.links.linkedin,
    portfolio: student.links.portfolio
  });

  const handleOpenEdit = () => {
    // If profile is locked, guide them to request edit
    setPreselectedField({
      section: "Personal Details",
      field: "phone_number",
      currentValue: student.personal.phone,
    });
    setIsRequestModalOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name !== student.name || formData.registerNumber !== student.registerNumber) {
      await studentService.updateAccountDetails({
        name: formData.name,
        registerNumber: formData.registerNumber
      });
    }
    await studentService.updatePersonal({
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      residenceType: formData.residenceType as "Day Scholar" | "Hosteller"
    });
    await studentService.updateParent({
      name: formData.parentName,
      contact: formData.parentContact,
      email: formData.parentEmail,
      occupation: formData.parentOccupation
    });
    await studentService.updateLinks({
      github: formData.github,
      linkedin: formData.linkedin,
      portfolio: formData.portfolio
    });
    refreshStudent();
    setIsEditDrawerOpen(false);
    showToastNotification("Profile updated successfully!");
  };

  const handleApplyActivePermission = async () => {
    if (!activePermField || !activePermValue.trim()) return;
    setSavingActivePerm(true);
    try {
      const res = await profileRequestApi.applyApprovedField({
        field_name: activePermField,
        new_value: activePermValue.trim(),
      });
      if (res.success) {
        showToastNotification(`Field "${activePermField}" updated and profile re-locked.`);
        await fetchRequests();
        refreshStudent();
      }
    } finally {
      setSavingActivePerm(false);
    }
  };

  const handleSavePhoto = async () => {
    if (newPhotoUrl.trim()) {
      await studentService.updateProfilePhoto(newPhotoUrl.trim());
      refreshStudent();
      setIsPhotoModalOpen(false);
      showToastNotification("Profile photo updated!");
    }
  };

  const showToastNotification = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 4000);
  };

  const activeRequest = myRequests.find(r => r.status === "APPROVED" && r.permission?.status === "ACTIVE");
  const pendingRequest = myRequests.find(r => r.status === "PENDING");

  return (
    <StudentLayout
      pageTitle="My Profile"
      subtitle="Personal, academic & institutional records"
      showBack={true}
      actions={
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-sm">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>🔒 Profile Locked</span>
          </span>

          <GlassButton
            onClick={() => {
              setPreselectedField({
                section: "Name",
                field: "full_name",
                currentValue: student.name,
              });
              setIsRequestModalOpen(true);
            }}
            className="gap-1.5 bg-white text-slate-800 border border-slate-200 text-xs py-2 px-3.5 cursor-pointer shadow-sm hover:bg-slate-50"
          >
            <UserCheck className="w-3.5 h-3.5 text-purple-600" />
            <span>Change Name</span>
          </GlassButton>

          <GlassButton
            onClick={() => {
              setPreselectedField({
                section: "Personal Details",
                field: "phone_number",
                currentValue: student.personal.phone,
              });
              setIsRequestModalOpen(true);
            }}
            className="gap-1.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xs py-2 px-3.5 cursor-pointer shadow-md shadow-amber-500/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Request Edit</span>
          </GlassButton>

          <GlassButton
            onClick={() => setIsCompleteProfileOpen(true)}
            className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-2 px-3.5 cursor-pointer shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Complete Setup</span>
          </GlassButton>
        </div>
      }
    >
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-sm font-semibold border border-slate-700 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{saveToast}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Active Permission Edit Window Alert */}
        {activeRequest && activeRequest.permission && (
          <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950/90 to-slate-900 border-2 border-emerald-500/50 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <h4 className="text-sm font-extrabold text-emerald-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <Unlock className="w-4 h-4" /> 24-Hour Edit Window Active
                </h4>
              </div>
              <p className="text-xs text-slate-300">
                Your Class Advisor approved editing <strong>"{activeRequest.field_name}"</strong>. Expires at {new Date(activeRequest.permission.expires_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <input
                type="text"
                value={activePermValue}
                onChange={(e) => setActivePermValue(e.target.value)}
                placeholder="Enter new value..."
                className="px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-semibold focus:outline-none focus:border-emerald-400 flex-1 md:w-64"
              />
              <button
                type="button"
                disabled={savingActivePerm || !activePermValue.trim()}
                onClick={handleApplyActivePermission}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/30 cursor-pointer disabled:opacity-50 transition-all shrink-0"
              >
                {savingActivePerm ? "Applying..." : "Save & Re-Lock"}
              </button>
            </div>
          </div>
        )}

        {/* Pending Request Indicator */}
        {pendingRequest && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Edit request for <strong>"{pendingRequest.field_name}"</strong> is currently pending review by your Class Advisor.
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-bold text-[11px] uppercase tracking-wider shrink-0">
              In Review
            </span>
          </div>
        )}

        {/* Institutional Lock Information Banner */}
        <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-slate-600 text-xs flex items-start gap-3">
          <Lock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-slate-900">Institutional Profile Security:</strong> All identity, academic, parent, and contact details are verified and locked. To change any information, click <strong>"Request Edit"</strong> or <strong>"Change Name"</strong> to receive an advisor-authorized edit window.
          </p>
        </div>

        {/* Profile Card Hero */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/60 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center gap-6 z-10 text-center sm:text-left">
            <div className="relative group cursor-pointer" onClick={() => setIsPhotoModalOpen(true)}>
              <img
                src={student.profileImage}
                alt={student.name}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover shadow-md ring-4 ring-purple-50 group-hover:opacity-90 transition-opacity"
              />
              <div className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity">
                <Camera className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Change Photo</span>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-1.5">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
                  <span>{student.name}</span>
                  <Lock className="w-4 h-4 text-slate-400" />
                </h2>
                <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-extrabold border border-purple-100">
                  {student.registerNumber}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                  🔒 Profile Locked
                </span>
              </div>

              <p className="text-slate-600 font-semibold text-sm mb-3">
                {student.course} • {student.department}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs font-medium text-slate-500">
                <span className="bg-slate-100 px-3 py-1 rounded-lg">Year {student.year}</span>
                <span className="bg-slate-100 px-3 py-1 rounded-lg">Section {student.section}</span>
                <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg font-bold">
                  {student.personal.residenceType}
                </span>
              </div>
            </div>
          </div>

          <div className="z-10 flex gap-2 w-full md:w-auto justify-center flex-wrap">
            <GlassButton
              onClick={() => {
                setPreselectedField({
                  section: "Personal Details",
                  field: "phone_number",
                  currentValue: student.personal.phone,
                });
                setIsRequestModalOpen(true);
              }}
              className="gap-1.5 text-xs bg-amber-600 hover:bg-amber-700 text-white font-bold cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Request Edit</span>
            </GlassButton>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/60 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-purple-600" /> Personal Information
              </h3>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                Student Managed
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Full Legal Name</p>
                <p className="font-bold text-slate-800">{student.name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Register Number</p>
                <p className="font-bold text-slate-800">{student.registerNumber}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Date of Birth</p>
                <p className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> {student.personal.dob}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Gender</p>
                <p className="font-semibold text-slate-700">{student.personal.gender}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Email Address</p>
                <p className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> {student.personal.email}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Phone Contact</p>
                <p className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {student.personal.phone}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Residential Address</p>
                <p className="font-semibold text-slate-700 flex items-start gap-1.5 leading-relaxed">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" /> {student.personal.address}
                </p>
              </div>
            </div>
          </div>

          {/* Parent / Guardian Information */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/60 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Building className="w-5 h-5 text-[#0d4933]" /> Parent / Guardian Details
              </h3>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                Family Record
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Guardian Name</p>
                <p className="font-bold text-slate-800">{student.parent.name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Relationship</p>
                <p className="font-semibold text-slate-700">{student.parent.relationship}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Contact Phone</p>
                <p className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {student.parent.contact}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Guardian Email</p>
                <p className="font-semibold text-slate-700 flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> {student.parent.email}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Occupation</p>
                <p className="font-semibold text-slate-700">{student.parent.occupation}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Background (Read-Only) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/60 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#0d4933]" /> Prior Academic Background
              </h3>
              <p className="text-xs text-slate-500 font-medium">Secondary and Higher Secondary certified credentials</p>
            </div>
            <span className="text-xs font-semibold text-[#0d4933] bg-[#629176]/15 border border-[#629176]/30 px-2.5 py-1 rounded-full">
              Read-Only (Verified)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 10th Card */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-[#629176]/20 text-[#0d4933] border border-[#629176]/30">
                  Class 10th (SSLC / CBSE)
                </span>
                <span className="text-lg font-black text-slate-900">{student.academic.percentage10th}</span>
              </div>
              <p className="text-sm font-bold text-slate-800">{student.academic.school10th}</p>
              <div className="text-xs text-slate-500 font-medium">
                Total Marks Secured: <span className="font-bold text-slate-700">{student.academic.marks10th}</span>
              </div>
            </div>

            {/* 12th Card */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-800">
                  Class 12th (HSC / CBSE)
                </span>
                <span className="text-lg font-black text-slate-900">{student.academic.percentage12th}</span>
              </div>
              <p className="text-sm font-bold text-slate-800">{student.academic.school12th}</p>
              <div className="text-xs text-slate-500 font-medium">
                Total Marks Secured: <span className="font-bold text-slate-700">{student.academic.marks12th}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Links */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/60 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-600" /> Professional & Portfolio Links
              </h3>
              <p className="text-xs text-slate-500 font-medium">Online presence, repositories and professional profiles</p>
            </div>
            <GlassButton onClick={handleOpenEdit} variant="secondary" className="text-xs py-1.5">
              Edit Links
            </GlassButton>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              href={student.links.github}
              target="_blank"
              rel="noreferrer"
              className="p-5 rounded-2xl border border-slate-200/80 hover:border-slate-400 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                  <Code className="w-5 h-5" />
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">GitHub</p>
                <p className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors truncate">
                  {student.links.github.replace("https://", "")}
                </p>
              </div>
            </a>

            <a
              href={student.links.linkedin}
              target="_blank"
              rel="noreferrer"
              className="p-5 rounded-2xl border border-slate-200/80 hover:border-[#629176]/40 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#042821] via-[#0d4933] to-[#629176] text-white flex items-center justify-center shadow-sm">
                  <Globe className="w-5 h-5" />
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#0d4933] transition-colors" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">LinkedIn</p>
                <p className="text-sm font-bold text-slate-900 group-hover:text-[#0d4933] transition-colors truncate">
                  {student.links.linkedin.replace("https://", "")}
                </p>
              </div>
            </a>

            <a
              href={student.links.portfolio}
              target="_blank"
              rel="noreferrer"
              className="p-5 rounded-2xl border border-slate-200/80 hover:border-emerald-300 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Personal Portfolio</p>
                <p className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors truncate">
                  {student.links.portfolio.replace("https://", "")}
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Edit Profile Drawer */}
      <GlassDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        title="Edit Profile Information"
      >
        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Student Identity & Academic Credentials */}
          <div className="space-y-4 p-4 rounded-2xl bg-[#629176]/10 border border-[#629176]/30">
            <h4 className="text-xs font-bold text-[#0d4933] uppercase tracking-wider flex items-center gap-1.5">
              <span>Student Identity & Credentials</span>
            </h4>
            <GlassInput
              label="Full Student Name"
              required
              value={formData.name}
              onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Arun Kumar"
            />
            <GlassInput
              label="Register Number"
              required
              value={formData.registerNumber}
              onChange={(e: any) => setFormData({ ...formData, registerNumber: e.target.value.toUpperCase() })}
              placeholder="e.g. 23AIM001"
            />
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[#0d4933] uppercase tracking-wider">Contact & Address</h4>
            <GlassInput
              label="Email Address"
              type="email"
              required
              value={formData.email}
              onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
            />
            <GlassInput
              label="Phone Number"
              required
              value={formData.phone}
              onChange={(e: any) => setFormData({ ...formData, phone: e.target.value })}
            />
            <GlassInput
              label="Residential Address"
              required
              value={formData.address}
              onChange={(e: any) => setFormData({ ...formData, address: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Residence Status</label>
              <select
                value={formData.residenceType}
                onChange={(e: any) => setFormData({ ...formData, residenceType: e.target.value as "Day Scholar" | "Hosteller" })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              >
                <option value="Day Scholar">Day Scholar</option>
                <option value="Hosteller">Hosteller</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-purple-600 uppercase tracking-wider">Parent / Guardian</h4>
            <GlassInput
              label="Parent / Guardian Name"
              required
              value={formData.parentName}
              onChange={(e: any) => setFormData({ ...formData, parentName: e.target.value })}
            />
            <GlassInput
              label="Parent Contact"
              required
              value={formData.parentContact}
              onChange={(e: any) => setFormData({ ...formData, parentContact: e.target.value })}
            />
            <GlassInput
              label="Parent Email"
              type="email"
              value={formData.parentEmail}
              onChange={(e: any) => setFormData({ ...formData, parentEmail: e.target.value })}
            />
            <GlassInput
              label="Parent Occupation"
              value={formData.parentOccupation}
              onChange={(e: any) => setFormData({ ...formData, parentOccupation: e.target.value })}
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-purple-600 uppercase tracking-wider">Profile Links</h4>
            <GlassInput
              label="GitHub URL"
              type="url"
              value={formData.github}
              onChange={(e: any) => setFormData({ ...formData, github: e.target.value })}
            />
            <GlassInput
              label="LinkedIn URL"
              type="url"
              value={formData.linkedin}
              onChange={(e: any) => setFormData({ ...formData, linkedin: e.target.value })}
            />
            <GlassInput
              label="Portfolio URL"
              type="url"
              value={formData.portfolio}
              onChange={(e: any) => setFormData({ ...formData, portfolio: e.target.value })}
            />
          </div>

          <div className="pt-4 flex gap-3">
            <GlassButton
              type="button"
              variant="secondary"
              className="w-full cursor-pointer"
              onClick={() => setIsEditDrawerOpen(false)}
            >
              Cancel
            </GlassButton>
            <GlassButton
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
            >
              Save Changes
            </GlassButton>
          </div>
        </form>
      </GlassDrawer>

      {/* Change Photo Modal */}
      <GlassModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        title="Update Profile Photo"
        maxWidth="md"
      >
        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <img
              src={newPhotoUrl}
              alt="Preview"
              className="w-28 h-28 rounded-2xl object-cover shadow-md mb-3"
            />
            <p className="text-xs text-slate-500 font-medium">Current Image Preview</p>
          </div>

          <GlassInput
            label="Image URL"
            value={newPhotoUrl}
            onChange={(e: any) => setNewPhotoUrl(e.target.value)}
            placeholder="Paste a direct image URL or Unsplash link"
          />

          <div className="text-xs text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">Quick suggestions:</p>
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80"
              ].map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setNewPhotoUrl(preset)}
                  className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-medium text-slate-600 hover:text-purple-600 hover:border-purple-200 cursor-pointer"
                >
                  Avatar #{idx + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <GlassButton
              type="button"
              variant="secondary"
              className="w-full cursor-pointer"
              onClick={() => setIsPhotoModalOpen(false)}
            >
              Cancel
            </GlassButton>
            <GlassButton
              type="button"
              onClick={handleSavePhoto}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
            >
              Save Photo
            </GlassButton>
          </div>
        </div>
      </GlassModal>

      {/* Request Field Edit & Name Change Modal */}
      <RequestEditModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        preselectedField={preselectedField}
        onSuccess={(req) => {
          showToastNotification(`Edit request for "${req.field_name}" submitted to Class Advisor.`);
          fetchRequests();
        }}
      />

      {/* Complete Profile Setup Modal */}
      <CompleteProfileModal
        isOpen={isCompleteProfileOpen}
        onClose={() => setIsCompleteProfileOpen(false)}
        onSuccess={() => {
          showToastNotification("Profile completed and securely locked!");
          refreshStudent();
          fetchRequests();
        }}
      />
    </StudentLayout>
  );
}
