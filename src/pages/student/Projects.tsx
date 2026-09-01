import { useState } from "react";
import {
  Briefcase,
  Plus,
  ExternalLink,
  Edit2,
  Trash2,
  Code2,
} from "lucide-react";
import StudentLayout from "../../components/student/StudentLayout";
import { GlassDrawer } from '../../components/ui/GlassDrawer';
import { GlassModal } from '../../components/ui/GlassModal';
import { GlassInput, GlassTextarea as Textarea } from '../../components/ui/GlassInput';
import { GlassButton } from '../../components/ui/GlassButton';
import { Toast } from "../../components/ui/Toast";
import { useToast } from "../../lib/useToast";
import { useStudentAuth } from "../../context/StudentAuthContext";
import { projectApi } from "../../services/apiClient";
import type { ProjectItem } from "../../types/student";

export default function Projects() {
  const { student, refreshStudent } = useStudentAuth();
  const { toastMessage, showToast } = useToast();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    detailedDescription: "",
    technologies: "",
    role: "",
    startDate: "2025-01",
    endDate: "2025-05",
    githubUrl: "",
    demoUrl: "",
    image: ""
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      title: "",
      shortDescription: "",
      detailedDescription: "",
      technologies: "Python, PyTorch, React, Docker",
      role: "Lead Full Stack Developer",
      startDate: "2025-01",
      endDate: "2025-05",
      githubUrl: "https://github.com/arunkumar-aiml/sample-project",
      demoUrl: "https://sample-project.vercel.app",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80"
    });
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (proj: ProjectItem) => {
    setEditingId(proj.id);
    setFormData({
      title: proj.title,
      shortDescription: proj.shortDescription,
      detailedDescription: proj.detailedDescription,
      technologies: proj.technologies.join(", "),
      role: proj.role,
      startDate: proj.startDate || "",
      endDate: proj.endDate || "",
      githubUrl: proj.githubUrl,
      demoUrl: proj.demoUrl,
      image: proj.image
    });
    setIsDrawerOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const techArray = formData.technologies
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: formData.title,
      shortDescription: formData.shortDescription,
      detailedDescription: formData.detailedDescription,
      technologies: techArray.length > 0 ? techArray : ["React", "TypeScript"],
      role: formData.role || "Developer",
      startDate: formData.startDate,
      endDate: formData.endDate,
      githubUrl: formData.githubUrl,
      demoUrl: formData.demoUrl,
      image: formData.image || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80"
    };

    if (editingId) {
      const res = await projectApi.update(Number(editingId), {
        title: payload.title,
        short_description: payload.shortDescription,
        detailed_description: payload.detailedDescription,
        technology_names: payload.technologies,
        student_role: payload.role,
        start_date: payload.startDate || undefined,
        end_date: payload.endDate || undefined,
        github_url: payload.githubUrl,
        live_demo_url: payload.demoUrl,
        project_image_url: payload.image,
      });
      if (res.success) {
        showToast("Project updated successfully!");
      } else {
        showToast(res.error || "Failed to update project");
      }
    } else {
      const res = await projectApi.create({
        student_id: Number(student.id),
        title: payload.title,
        short_description: payload.shortDescription,
        detailed_description: payload.detailedDescription,
        technology_names: payload.technologies,
        student_role: payload.role,
        start_date: payload.startDate || undefined,
        end_date: payload.endDate || undefined,
        github_url: payload.githubUrl,
        live_demo_url: payload.demoUrl,
        project_image_url: payload.image,
      });
      if (res.success) {
        showToast("Project created successfully!");
      } else {
        showToast(res.error || "Failed to create project");
      }
    }
    await refreshStudent();
    setIsDrawerOpen(false);
  };

  const confirmDelete = async () => {
    if (deleteModalId) {
      const res = await projectApi.delete(Number(deleteModalId));
      if (res.success) {
        showToast("Project deleted.");
      } else {
        showToast(res.error || "Failed to delete");
      }
      await refreshStudent();
      setDeleteModalId(null);
    }
  };

  return (
    <StudentLayout
      pageTitle="My Projects"
      subtitle="Engineering portfolio, live deployments & technical repositories"
      showBack={true}
      actions={
        <GlassButton onClick={handleOpenAdd} className="gap-2 bg-pink-600 hover:bg-pink-700 text-white text-xs cursor-pointer">
          <Plus className="w-4 h-4" /> Add Project
        </GlassButton>
      }
    >
      <Toast message={toastMessage} />

      {student.projects.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/60 max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center mx-auto">
            <Briefcase className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No projects yet</h3>
          <p className="text-slate-500 text-sm">
            Showcase your engineering work, hackathon prototypes, and research codebases.
          </p>
          <GlassButton onClick={handleOpenAdd} className="bg-pink-600 hover:bg-pink-700 text-white text-xs cursor-pointer">
            + Add Project
          </GlassButton>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {student.projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200/70 hover:shadow-xl transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="h-52 overflow-hidden relative bg-slate-100">
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent"></div>
                  
                  <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenEdit(proj)}
                      className="p-2 bg-white/90 hover:bg-white text-slate-700 rounded-xl shadow-md transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteModalId(proj.id)}
                      className="p-2 bg-white/90 hover:bg-red-50 text-red-600 rounded-xl shadow-md transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="absolute bottom-4 left-5 right-5 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-pink-500/90 px-2 py-0.5 rounded text-white mb-1.5 inline-block">
                      {proj.role}
                    </span>
                    <h3 className="text-xl font-bold leading-snug">{proj.title}</h3>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {proj.detailedDescription}
                  </p>

                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Technologies</p>
                    <div className="flex flex-wrap gap-1.5">
                      {proj.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100 flex gap-3 mt-4">
                {proj.githubUrl && (
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
                  >
                    <Code2 className="w-4 h-4" /> Repository
                  </a>
                )}
                {proj.demoUrl && (
                  <a
                    href={proj.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 px-4 bg-[#629176]/15 hover:bg-[#629176]/25 text-[#0d4933] rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors border border-[#629176]/30"
                  >
                    <ExternalLink className="w-4 h-4" /> Live Demo
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Drawer */}
      <GlassDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingId ? "Edit Project" : "Add Project"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <GlassInput
            label="Project Title"
            placeholder="e.g. AgroVision - Autonomous Drone AI"
            required
            value={formData.title}
            onChange={(e: any) => setFormData({ ...formData, title: e.target.value })}
          />
          <GlassInput
            label="Short Summary"
            placeholder="One-line elevator pitch..."
            required
            value={formData.shortDescription}
            onChange={(e: any) => setFormData({ ...formData, shortDescription: e.target.value })}
          />
          <GlassInput
            label="Technologies (comma separated)"
            placeholder="Python, PyTorch, React, Docker"
            required
            value={formData.technologies}
            onChange={(e: any) => setFormData({ ...formData, technologies: e.target.value })}
          />
          <GlassInput
            label="Your Role / Contribution"
            placeholder="e.g. Team Lead & ML Architect"
            value={formData.role}
            onChange={(e: any) => setFormData({ ...formData, role: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <GlassInput
              label="Start Date"
              placeholder="e.g. 2025-01"
              value={formData.startDate}
              onChange={(e: any) => setFormData({ ...formData, startDate: e.target.value })}
            />
            <GlassInput
              label="End Date"
              placeholder="e.g. 2025-05"
              value={formData.endDate}
              onChange={(e: any) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>
          <GlassInput
            label="GitHub Repository URL"
            type="url"
            placeholder="https://github.com/username/project"
            value={formData.githubUrl}
            onChange={(e: any) => setFormData({ ...formData, githubUrl: e.target.value })}
          />
          <GlassInput
            label="Live Deployment Demo URL"
            type="url"
            placeholder="https://project.vercel.app"
            value={formData.demoUrl}
            onChange={(e: any) => setFormData({ ...formData, demoUrl: e.target.value })}
          />
          <GlassInput
            label="Cover Image URL (Optional)"
            placeholder="https://images.unsplash.com/..."
            value={formData.image}
            onChange={(e: any) => setFormData({ ...formData, image: e.target.value })}
          />
          <Textarea
            label="Detailed Project Architecture & Impact"
            placeholder="Explain algorithmic design, latency benchmarks, scalability..."
            required
            value={formData.detailedDescription}
            onChange={(e: any) => setFormData({ ...formData, detailedDescription: e.target.value })}
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
              className="w-full bg-pink-600 hover:bg-pink-700 text-white cursor-pointer"
            >
              {editingId ? "Update Project" : "Save Project"}
            </GlassButton>
          </div>
        </form>
      </GlassDrawer>

      {/* Delete Modal */}
      <GlassModal
        isOpen={deleteModalId !== null}
        onClose={() => setDeleteModalId(null)}
        title="Delete this project?"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            This action cannot be undone. Are you sure you want to permanently remove this project card?
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
