import { useState } from "react";
import {
  Trophy,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Building
} from "lucide-react";
import StudentLayout from "../../components/student/StudentLayout";
import { GlassDrawer } from '../../components/ui/GlassDrawer';
import { GlassModal } from '../../components/ui/GlassModal';
import { GlassInput, GlassTextarea as Textarea } from '../../components/ui/GlassInput';
import { GlassButton } from '../../components/ui/GlassButton';
import { Toast } from "../../components/ui/Toast";
import { useToast } from "../../lib/useToast";
import { useStudentAuth } from "../../context/StudentAuthContext";
import { achievementService } from "../../services/studentData";
import type { AchievementItem } from "../../types/student";

export default function Achievements() {
  const { student, refreshStudent } = useStudentAuth();
  const { toastMessage, showToast } = useToast();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    organization: "",
    event: "",
    date: "",
    description: "",
    leadershipRole: "",
    position: ""
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      title: "",
      organization: "",
      event: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
      leadershipRole: "",
      position: ""
    });
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (ach: AchievementItem) => {
    setEditingId(ach.id);
    setFormData({
      title: ach.title,
      organization: ach.organization,
      event: ach.event,
      date: ach.date,
      description: ach.description,
      leadershipRole: ach.leadershipRole,
      position: ach.position
    });
    setIsDrawerOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingId) {
      await achievementService.update(editingId, formData);
      showToast("Achievement updated successfully!");
    } else {
      await achievementService.add(formData);
      showToast("Achievement added successfully!");
    }
    refreshStudent();
    setIsDrawerOpen(false);
  };

  const confirmDelete = async () => {
    if (deleteModalId) {
      await achievementService.delete(deleteModalId);
      refreshStudent();
      setDeleteModalId(null);
      showToast("Achievement deleted.");
    }
  };

  return (
    <StudentLayout
      pageTitle="My Achievements"
      subtitle="Showcase your accomplishments, leadership & milestones"
      showBack={true}
      actions={
        <GlassButton onClick={handleOpenAdd} className="gap-2 bg-purple-600 hover:bg-purple-700 text-white text-xs cursor-pointer">
          <Plus className="w-4 h-4" /> Add Achievement
        </GlassButton>
      }
    >
      <Toast message={toastMessage} />

      {student.achievements.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/60 max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No achievements recorded yet</h3>
          <p className="text-slate-500 text-sm">
            Highlight hackathon wins, competitive rankings, and student club leadership positions.
          </p>
          <GlassButton onClick={handleOpenAdd} className="bg-purple-600 hover:bg-purple-700 text-white text-xs cursor-pointer">
            + Add First Achievement
          </GlassButton>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {student.achievements.map((ach) => (
            <div
              key={ach.id}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/70 hover:shadow-md hover:border-purple-200 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenEdit(ach)}
                      className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors cursor-pointer"
                      title="Edit Achievement"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteModalId(ach.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                      title="Delete Achievement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-100/70 text-purple-800 text-xs font-bold mb-2">
                    {ach.position}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 leading-snug line-clamp-2">{ach.title}</h3>
                </div>

                <p className="text-slate-600 text-xs line-clamp-3 leading-relaxed mb-4">
                  {ach.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-500 font-medium">
                <p className="flex items-center gap-1.5 truncate">
                  <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{ach.event} • {ach.organization}</span>
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Calendar className="w-3.5 h-3.5" /> {ach.date}
                  </span>
                  {ach.leadershipRole && (
                    <span className="font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded text-[10px]">
                      {ach.leadershipRole}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <GlassDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingId ? "Edit Achievement" : "Add New Achievement"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <GlassInput
            label="Achievement Title"
            placeholder="e.g. National Smart India Hackathon Winner"
            required
            value={formData.title}
            onChange={(e: any) => setFormData({ ...formData, title: e.target.value })}
          />
          <GlassInput
            label="Award / Position"
            placeholder="e.g. 1st Place (National Winner) or Finalist"
            required
            value={formData.position}
            onChange={(e: any) => setFormData({ ...formData, position: e.target.value })}
          />
          <GlassInput
            label="Issuing Organization"
            placeholder="e.g. Ministry of Education, Govt. of India"
            required
            value={formData.organization}
            onChange={(e: any) => setFormData({ ...formData, organization: e.target.value })}
          />
          <GlassInput
            label="Event / Summit Name"
            placeholder="e.g. SIH 2025 Grand Finale"
            value={formData.event}
            onChange={(e: any) => setFormData({ ...formData, event: e.target.value })}
          />
          <GlassInput
            label="Date of Milestone"
            type="date"
            required
            value={formData.date}
            onChange={(e: any) => setFormData({ ...formData, date: e.target.value })}
          />
          <GlassInput
            label="Leadership Role (Optional)"
            placeholder="e.g. Team Lead, Solo Innovator"
            value={formData.leadershipRole}
            onChange={(e: any) => setFormData({ ...formData, leadershipRole: e.target.value })}
          />
          <Textarea
            label="Achievement Summary & Impact"
            placeholder="Describe the solution engineered, scope, team size, and impact..."
            required
            value={formData.description}
            onChange={(e: any) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="pt-4 flex gap-3">
            <GlassButton
              type="button"
              variant="secondary"
              className="w-full cursor-pointer"
              onClick={() => setIsDrawerOpen(false)}
            >
              Cancel
            </GlassButton>
            <GlassButton
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
            >
              {editingId ? "Save Changes" : "Save Achievement"}
            </GlassButton>
          </div>
        </form>
      </GlassDrawer>

      <GlassModal
        isOpen={deleteModalId !== null}
        onClose={() => setDeleteModalId(null)}
        title="Delete this item?"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            This action cannot be undone. Are you sure you want to permanently delete this achievement?
          </p>
          <div className="flex gap-3 pt-2">
            <GlassButton
              type="button"
              variant="secondary"
              className="w-full cursor-pointer"
              onClick={() => setDeleteModalId(null)}
            >
              Cancel
            </GlassButton>
            <GlassButton
              type="button"
              variant="danger"
              className="w-full cursor-pointer"
              onClick={confirmDelete}
            >
              Delete
            </GlassButton>
          </div>
        </div>
      </GlassModal>
    </StudentLayout>
  );
}
