import { useState } from "react";
import {
  Award,
  Plus,
  Eye,
  Trash2,
  Check,
  ExternalLink,
  Calendar,
  ShieldCheck,
  Building
} from "lucide-react";
import StudentLayout from "../../components/student/StudentLayout";
import { GlassDrawer } from '../../components/ui/GlassDrawer';
import { GlassModal } from '../../components/ui/GlassModal';
import { GlassInput } from '../../components/ui/GlassInput';
import { GlassButton } from '../../components/ui/GlassButton';
import { useStudentAuth } from "../../context/StudentAuthContext";
import { certificateService } from "../../services/studentData";
import type { CertificateItem } from "../../types/student";

export default function Certificates() {
  const { student, refreshStudent } = useStudentAuth();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [viewCert, setViewCert] = useState<CertificateItem | null>(null);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    organization: "",
    issueDate: new Date().toISOString().split("T")[0],
    certificateId: "",
    credentialUrl: "",
    thumbnail: ""
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAdd = () => {
    setFormData({
      title: "",
      organization: "",
      issueDate: new Date().toISOString().split("T")[0],
      certificateId: "CERT-" + Math.floor(100000 + Math.random() * 900000),
      credentialUrl: "https://verify.cert.org",
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80"
    });
    setIsDrawerOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    await certificateService.add({
      title: formData.title,
      organization: formData.organization,
      issueDate: formData.issueDate,
      certificateId: formData.certificateId,
      credentialUrl: formData.credentialUrl,
      thumbnail: formData.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80"
    });
    refreshStudent();
    setIsDrawerOpen(false);
    showToast("Certificate added successfully!");
  };

  const confirmDelete = async () => {
    if (deleteModalId) {
      await certificateService.delete(deleteModalId);
      refreshStudent();
      setDeleteModalId(null);
      showToast("Certificate removed.");
    }
  };

  return (
    <StudentLayout
      pageTitle="My Certificates"
      subtitle="Industry, cloud and competitive verified credentials"
      showBack={true}
      actions={
        <GlassButton onClick={handleOpenAdd} className="gap-2 bg-amber-600 hover:bg-amber-700 text-white text-xs cursor-pointer">
          <Plus className="w-4 h-4" /> Add Certificate
        </GlassButton>
      }
    >
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-sm font-semibold border border-slate-700">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {student.certificates.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/60 max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No certificates registered yet</h3>
          <p className="text-slate-500 text-sm">
            Showcase your completed specializations, AWS certifications, and industry workshops.
          </p>
          <GlassButton onClick={handleOpenAdd} className="bg-amber-600 hover:bg-amber-700 text-white text-xs cursor-pointer">
            + Add Certificate
          </GlassButton>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {student.certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200/70 hover:shadow-md hover:border-amber-200 transition-all flex flex-col justify-between group"
            >
              <div className="relative h-44 overflow-hidden bg-slate-100">
                <img
                  src={cert.thumbnail}
                  alt={cert.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent"></div>
                <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setDeleteModalId(cert.id)}
                    className="p-2 bg-white/90 hover:bg-red-50 text-red-600 rounded-xl shadow-md transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-amber-500/90 text-white px-2 py-0.5 rounded">
                    <ShieldCheck className="w-3 h-3" /> Verified ID: {cert.certificateId}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 line-clamp-2 leading-snug mb-1">
                    {cert.title}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" /> {cert.organization}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {cert.issueDate}
                  </span>

                  <button
                    onClick={() => setViewCert(cert)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" /> View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Certificate Drawer */}
      <GlassDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Add Verified Certificate"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <GlassInput
            label="Certificate Title"
            placeholder="e.g. AWS Certified Machine Learning - Specialty"
            required
            value={formData.title}
            onChange={(e: any) => setFormData({ ...formData, title: e.target.value })}
          />
          <GlassInput
            label="Issuing Organization"
            placeholder="e.g. Amazon Web Services, DeepLearning.AI, Meta"
            required
            value={formData.organization}
            onChange={(e: any) => setFormData({ ...formData, organization: e.target.value })}
          />
          <GlassInput
            label="Date of Issuance"
            type="date"
            required
            value={formData.issueDate}
            onChange={(e: any) => setFormData({ ...formData, issueDate: e.target.value })}
          />
          <GlassInput
            label="Certificate ID / License #"
            placeholder="e.g. AWS-MLS-49201"
            required
            value={formData.certificateId}
            onChange={(e: any) => setFormData({ ...formData, certificateId: e.target.value })}
          />
          <GlassInput
            label="Verification Credential URL"
            type="url"
            placeholder="https://verify.credential.net/..."
            value={formData.credentialUrl}
            onChange={(e: any) => setFormData({ ...formData, credentialUrl: e.target.value })}
          />
          <GlassInput
            label="Thumbnail Image URL (Optional)"
            placeholder="https://images.unsplash.com/..."
            value={formData.thumbnail}
            onChange={(e: any) => setFormData({ ...formData, thumbnail: e.target.value })}
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
              className="w-full bg-amber-600 hover:bg-amber-700 text-white cursor-pointer"
            >
              Save Certificate
            </GlassButton>
          </div>
        </form>
      </GlassDrawer>

      {/* View Certificate Modal */}
      {viewCert && (
        <GlassModal
          isOpen={viewCert !== null}
          onClose={() => setViewCert(null)}
          title="Certificate Preview"
          maxWidth="lg"
        >
          <div className="space-y-6">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-900 flex flex-col items-center justify-center p-8 text-center text-white">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                <Award className="w-10 h-10" />
              </div>
              <span className="text-xs font-bold text-amber-300 uppercase tracking-widest mb-1">
                Certificate of Competence & Completion
              </span>
              <h2 className="text-2xl font-black text-white max-w-lg mb-2">{viewCert.title}</h2>
              <p className="text-sm text-slate-300">Conferred by {viewCert.organization}</p>

              <div className="mt-6 pt-6 border-t border-white/10 w-full flex flex-wrap justify-between text-xs text-slate-400 font-medium">
                <span>Credential ID: <strong className="text-white">{viewCert.certificateId}</strong></span>
                <span>Date: <strong className="text-white">{viewCert.issueDate}</strong></span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {viewCert.credentialUrl && (
                <a
                  href={viewCert.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <ExternalLink className="w-4 h-4" /> Verify on Issuer Portal
                </a>
              )}
              <GlassButton
                variant="secondary"
                className="w-full sm:w-auto cursor-pointer text-xs"
                onClick={() => setViewCert(null)}
              >
                Close Preview
              </GlassButton>
            </div>
          </div>
        </GlassModal>
      )}

      {/* Delete Modal */}
      <GlassModal
        isOpen={deleteModalId !== null}
        onClose={() => setDeleteModalId(null)}
        title="Delete this item?"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            This action cannot be undone. Are you sure you want to remove this certificate?
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
