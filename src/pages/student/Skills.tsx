import { useState } from "react";
import {
  Code2,
  Plus,
  Edit2,
  Trash2,
  Check,
  Layers,
  Wrench,
  Users2
} from "lucide-react";
import StudentLayout from "../../components/student/StudentLayout";
import { GlassDrawer } from '../../components/ui/GlassDrawer';
import { GlassModal } from '../../components/ui/GlassModal';
import { GlassInput } from '../../components/ui/GlassInput';
import { GlassButton } from '../../components/ui/GlassButton';
import { useStudentAuth } from "../../context/StudentAuthContext";
import { skillService } from "../../services/studentData";
import type { SkillItem, SkillCategory, SkillProficiency } from "../../types/student";

export default function Skills() {
  const { student, refreshStudent } = useStudentAuth();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "Programming" as SkillCategory,
    proficiency: "Intermediate" as SkillProficiency
  });

  const categories: { name: SkillCategory; icon: any; color: string; bg: string }[] = [
    { name: "Programming", icon: Code2, color: "text-blue-600", bg: "bg-blue-50" },
    { name: "Technical", icon: Layers, color: "text-purple-600", bg: "bg-purple-50" },
    { name: "Tools", icon: Wrench, color: "text-amber-600", bg: "bg-amber-50" },
    { name: "Soft Skills", icon: Users2, color: "text-emerald-600", bg: "bg-emerald-50" }
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAdd = (defaultCat?: SkillCategory) => {
    setEditingId(null);
    setFormData({
      name: "",
      category: defaultCat || "Programming",
      proficiency: "Intermediate"
    });
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (sk: SkillItem) => {
    setEditingId(sk.id);
    setFormData({
      name: sk.name,
      category: sk.category,
      proficiency: sk.proficiency
    });
    setIsDrawerOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingId) {
      await skillService.update(editingId, formData);
      showToast("Skill updated successfully!");
    } else {
      await skillService.add(formData);
      showToast("Skill added successfully!");
    }
    refreshStudent();
    setIsDrawerOpen(false);
  };

  const confirmDelete = async () => {
    if (deleteModalId) {
      await skillService.delete(deleteModalId);
      refreshStudent();
      setDeleteModalId(null);
      showToast("Skill deleted.");
    }
  };

  const getProficiencyColor = (p: SkillProficiency) => {
    switch (p) {
      case "Expert":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Advanced":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Intermediate":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Beginner":
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <StudentLayout
      pageTitle="My Skills"
      subtitle="Proficiencies across technical, tooling & leadership disciplines"
      showBack={true}
      actions={
        <GlassButton onClick={() => handleOpenAdd()} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs cursor-pointer">
          <Plus className="w-4 h-4" /> Add Skill
        </GlassButton>
      }
    >
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-sm font-semibold border border-slate-700">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="space-y-8">
        {categories.map((cat) => {
          const filtered = student.skills.filter((s) => s.category === cat.name);
          return (
            <div key={cat.name} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/60">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${cat.bg} ${cat.color} flex items-center justify-center`}>
                    <cat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{cat.name}</h3>
                    <p className="text-xs text-slate-400 font-medium">{filtered.length} verified competencies</p>
                  </div>
                </div>

                <GlassButton
                  onClick={() => handleOpenAdd(cat.name)}
                  variant="secondary"
                  size="sm"
                  className="text-xs gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add to {cat.name}
                </GlassButton>
              </div>

              {filtered.length === 0 ? (
                <div className="py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-xs text-slate-400 font-semibold mb-2">No skills registered in this category.</p>
                  <GlassButton
                    onClick={() => handleOpenAdd(cat.name)}
                    variant="secondary"
                    size="sm"
                    className="text-xs cursor-pointer"
                  >
                    + Add Skill
                  </GlassButton>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filtered.map((skill) => (
                    <div
                      key={skill.id}
                      className="p-4 rounded-2xl border border-slate-200/70 hover:border-indigo-300 hover:shadow-md transition-all flex items-center justify-between group bg-slate-50/30"
                    >
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-1">{skill.name}</h4>
                        <span className={`inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${getProficiencyColor(skill.proficiency)}`}>
                          {skill.proficiency}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenEdit(skill)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteModalId(skill.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <GlassDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingId ? "Edit Skill" : "Add New Skill"}
      >
        <form onSubmit={handleSave} className="space-y-5">
          <GlassInput
            label="Skill Name"
            placeholder="e.g. Python, Docker, PyTorch, Agile Scrum"
            required
            value={formData.name}
            onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
            <select
              value={formData.category}
              onChange={(e: any) => setFormData({ ...formData, category: e.target.value as SkillCategory })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="Programming">Programming</option>
              <option value="Technical">Technical</option>
              <option value="Tools">Tools</option>
              <option value="Soft Skills">Soft Skills</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Proficiency Level</label>
            <select
              value={formData.proficiency}
              onChange={(e: any) => setFormData({ ...formData, proficiency: e.target.value as SkillProficiency })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

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
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
            >
              {editingId ? "Update Skill" : "Save Skill"}
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
            This action cannot be undone. Are you sure you want to delete this skill from your profile?
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
