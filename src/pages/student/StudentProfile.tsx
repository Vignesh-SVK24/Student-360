import { useState } from "react";
import {
  Edit3,
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
  Code
} from "lucide-react";
import StudentLayout from "../../components/student/StudentLayout";
import { GlassDrawer } from '../../components/ui/GlassDrawer';
import { GlassModal } from '../../components/ui/GlassModal';
import { GlassInput } from '../../components/ui/GlassInput';
import { GlassButton } from '../../components/ui/GlassButton';
import { useStudentAuth } from "../../context/StudentAuthContext";
import { studentService } from "../../services/studentData";

export default function StudentProfile() {
  const { student, refreshStudent } = useStudentAuth();

  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState(student.profileImage);
  const [saveToast, setSaveToast] = useState(false);

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
    setFormData({
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
    setIsEditDrawerOpen(true);
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
    showToastNotification();
  };

  const handleSavePhoto = async () => {
    if (newPhotoUrl.trim()) {
      await studentService.updateProfilePhoto(newPhotoUrl.trim());
      refreshStudent();
      setIsPhotoModalOpen(false);
      showToastNotification();
    }
  };

  const showToastNotification = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  return (
    <StudentLayout
      pageTitle="My Profile"
      subtitle="Personal, academic & contact records"
      showBack={true}
      actions={
        <GlassButton onClick={handleOpenEdit} className="gap-2 bg-slate-900 hover:bg-slate-800 text-xs py-2 px-4 cursor-pointer">
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Profile</span>
        </GlassButton>
      }
    >
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-sm font-semibold border border-slate-700 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      <div className="space-y-8">
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
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{student.name}</h2>
                <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-extrabold border border-purple-100">
                  {student.registerNumber}
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

          <div className="z-10 flex gap-4 w-full md:w-auto justify-center">
            <GlassButton onClick={handleOpenEdit} variant="secondary" className="gap-2 text-xs">
              <Edit3 className="w-3.5 h-3.5" /> Edit Information
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
    </StudentLayout>
  );
}
