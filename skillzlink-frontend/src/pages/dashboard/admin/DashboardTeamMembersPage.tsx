import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { adminApi, type TeamMember } from "../../../services/api";

export function DashboardTeamMembersPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingMember, setDeletingMember] = useState<TeamMember | null>(null);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Form State
  const [form, setForm] = useState({
    name: "",
    role: "",
    bio: "",
    photo_url: "",
    order_index: 1,
    is_active: true,
  });

  // Image Upload & Validation State
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoSuccess, setPhotoSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getTeamMembers();
      setTeam(res.team || []);
    } catch {
      showToast("Failed to load team members", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const openCreate = () => {
    setEditingMember(null);
    setForm({
      name: "",
      role: "",
      bio: "",
      photo_url: "",
      order_index: (team.length ? Math.max(...team.map((t) => t.order_index || 0)) + 1 : 1),
      is_active: true,
    });
    setPhotoError(null);
    setPhotoSuccess(null);
    setModalOpen(true);
  };

  const openEdit = (member: TeamMember) => {
    setEditingMember(member);
    setForm({
      name: member.name,
      role: member.role,
      bio: member.bio || "",
      photo_url: member.photo_url || "",
      order_index: member.order_index || 1,
      is_active: member.is_active ?? true,
    });
    setPhotoError(null);
    setPhotoSuccess(null);
    setModalOpen(true);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoError(null);
    setPhotoSuccess(null);

    // Validate MIME type
    if (!["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.type)) {
      setPhotoError("Unsupported file type. Please upload a JPG, PNG, or WebP image.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Validate File Size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("File size too large. Maximum allowed size is 5MB.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Client-side Dimension & Aspect Ratio Enforcement
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;

        const aspectRatio = width / height;
        const isSquare = Math.abs(aspectRatio - 1.0) <= 0.05; // 5% aspect ratio tolerance

        // 1. Check Minimum Dimensions
        if (width < 250 || height < 250) {
          setPhotoError(
            `Image resolution is too low (${width}x${height}px). Minimum required resolution is 250x250px.`
          );
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }

        // 2. Check 1:1 Aspect Ratio
        if (!isSquare) {
          setPhotoError(
            `Aspect ratio violation: Image must be a 1:1 square. Selected image is ${width}x${height}px (${aspectRatio.toFixed(2)}:1). Please crop or use a square image.`
          );
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }

        // Dimensions & Aspect ratio valid -> Upload to backend
        try {
          setUploadingPhoto(true);
          const res = await adminApi.uploadTeamPhoto(file);
          setForm((prev) => ({ ...prev, photo_url: res.photo_url }));
          setPhotoSuccess(`✓ Valid 1:1 square photo (${width}x${height}px) uploaded successfully!`);
        } catch (err: any) {
          setPhotoError(err.message || "Failed to upload photo to server");
        } finally {
          setUploadingPhoto(false);
        }
      };
      img.onerror = () => {
        setPhotoError("Failed to read image dimensions. Please try another file.");
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.role.trim()) {
      showToast("Name and Role are required.", "error");
      return;
    }

    setSaving(true);
    try {
      if (editingMember) {
        await adminApi.updateTeamMember(editingMember.id, form);
        showToast("Team member updated successfully.");
      } else {
        await adminApi.createTeamMember(form);
        showToast("Team member created successfully.");
      }
      setModalOpen(false);
      fetchTeam();
    } catch (err: any) {
      showToast(err.message || "Failed to save team member.", "error");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (member: TeamMember) => {
    setDeletingMember(member);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingMember) return;
    try {
      await adminApi.deleteTeamMember(deletingMember.id);
      showToast("Team member deleted successfully.");
      setDeleteModalOpen(false);
      setDeletingMember(null);
      fetchTeam();
    } catch (err: any) {
      showToast(err.message || "Failed to delete team member.", "error");
    }
  };

  const toggleStatus = async (member: TeamMember) => {
    try {
      await adminApi.updateTeamMember(member.id, { is_active: !member.is_active });
      showToast(`Member is now ${!member.is_active ? "Visible" : "Hidden"}.`);
      fetchTeam();
    } catch {
      showToast("Failed to update status.", "error");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8" style={{ fontFamily: "'Inter', sans-serif" }}>
        
        {/* Toast Notification */}
        {toastMessage && (
          <div
            className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl text-sm font-bold flex items-center gap-2.5 transition-all ${
              toastType === "success"
                ? "bg-emerald-600 text-white"
                : "bg-rose-600 text-white"
            }`}
          >
            <span>{toastType === "success" ? "✓" : "⚠"}</span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--bg-primary)] p-6 rounded-3xl border border-[var(--border-color)] shadow-sm">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[var(--accent-light)] text-[var(--accent-color)] flex items-center justify-center font-bold">
                <i className="lnr lnr-users text-xl" />
              </div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
                Meet the Team Management
              </h1>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mt-1.5 ml-13">
              Add, edit, and organize leadership & team members displayed on the public{" "}
              <a href="/about" target="_blank" rel="noreferrer" className="text-[var(--accent-color)] font-semibold underline">
                About Us Page
              </a>
              . Enforces 1:1 square photo aspect ratio.
            </p>
          </div>

          <button
            onClick={openCreate}
            className="px-5 py-3 bg-[var(--accent-color)] text-white rounded-2xl font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[var(--accent-color)]/20 active:scale-95 shrink-0"
          >
            <i className="lnr lnr-plus-circle text-base" /> Add Team Member
          </button>
        </div>

        {/* Team Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-[var(--accent-color)] border-t-transparent" />
          </div>
        ) : team.length === 0 ? (
          <div className="bg-[var(--bg-primary)] rounded-3xl border border-[var(--border-color)] p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[var(--accent-light)] text-[var(--accent-color)] flex items-center justify-center mx-auto text-2xl">
              <i className="lnr lnr-user" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">No Team Members Found</h3>
            <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
              Get started by adding your executive team, leadership, and key staff members.
            </p>
            <button
              onClick={openCreate}
              className="px-5 py-2.5 bg-[var(--accent-color)] text-white rounded-xl font-semibold text-sm hover:opacity-90"
            >
              Add First Member
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div
                key={member.id}
                className="bg-[var(--bg-primary)] rounded-3xl border border-[var(--border-color)] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
              >
                {/* Photo with Square Aspect Ratio Container */}
                <div className="w-full aspect-square bg-gray-100 relative overflow-hidden">
                  <img
                    src={member.photo_url || "/images/team/default.jpg"}
                    alt={member.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=00A843&color=fff&size=400`;
                    }}
                  />
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => toggleStatus(member)}
                      className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm transition-all ${
                        member.is_active
                          ? "bg-emerald-500 text-white hover:bg-emerald-600"
                          : "bg-gray-500 text-white hover:bg-gray-600"
                      }`}
                    >
                      {member.is_active ? "Active" : "Hidden"}
                    </button>
                  </div>
                  {/* Order Index */}
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
                    Order #{member.order_index}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-base text-[var(--text-primary)] leading-tight">{member.name}</h3>
                    <p className="text-xs font-semibold text-[var(--accent-color)] mt-1">{member.role}</p>
                    {member.bio && (
                      <p className="text-xs text-[var(--text-secondary)] mt-2 line-clamp-3 leading-relaxed">
                        {member.bio}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-[var(--border-color)]">
                    <button
                      onClick={() => openEdit(member)}
                      className="flex-1 px-3 py-2 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--accent-light)] text-[var(--text-primary)] hover:text-[var(--accent-color)] text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <i className="lnr lnr-pencil" /> Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(member)}
                      className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                      title="Delete member"
                    >
                      <i className="lnr lnr-trash" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CREATE / EDIT MODAL */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[var(--bg-primary)] rounded-3xl border border-[var(--border-color)] w-full max-w-xl shadow-2xl overflow-hidden animate-scaleUp">
              
              <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[var(--accent-light)] text-[var(--accent-color)] flex items-center justify-center font-bold">
                    <i className="lnr lnr-user text-lg" />
                  </div>
                  <h2 className="text-lg font-bold text-[var(--text-primary)]">
                    {editingMember ? "Edit Team Member" : "Add New Team Member"}
                  </h2>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-5">
                
                {/* Photo Upload with Strict Dimension Enforcement */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Profile Photo <span className="text-[var(--accent-color)]">(Enforced 1:1 Square, Min 250x250)</span>
                  </label>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                    {/* Preview Thumbnail */}
                    <div className="w-20 h-20 rounded-2xl bg-gray-200 border-2 border-dashed border-[var(--border-color)] shrink-0 overflow-hidden relative flex items-center justify-center">
                      {form.photo_url ? (
                        <img
                          src={form.photo_url}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name || "Member")}&background=00A843&color=fff&size=200`;
                          }}
                        />
                      ) : (
                        <i className="lnr lnr-picture text-2xl text-gray-400" />
                      )}
                      {uploadingPhoto && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                        </div>
                      )}
                    </div>

                    {/* Upload Input & Requirements */}
                    <div className="flex-1 space-y-1.5">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/jpg"
                        onChange={handlePhotoSelect}
                        disabled={uploadingPhoto}
                        className="block w-full text-xs text-[var(--text-secondary)] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[var(--accent-color)] file:text-white hover:file:opacity-90 cursor-pointer"
                      />
                      <p className="text-[11px] text-[var(--text-secondary)]">
                        Required: <strong>1:1 Aspect Ratio (Square)</strong>, at least <strong>250x250px</strong> (e.g. 400x400, 600x600). Max 5MB.
                      </p>
                    </div>
                  </div>

                  {/* Photo Error Banner */}
                  {photoError && (
                    <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2">
                      <span className="text-base">⚠</span>
                      <span>{photoError}</span>
                    </div>
                  )}

                  {/* Photo Success Banner */}
                  {photoSuccess && (
                    <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-start gap-2">
                      <span>{photoSuccess}</span>
                    </div>
                  )}
                </div>

                {/* Name & Role Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Tinashe Moyo"
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
                      Role / Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      placeholder="e.g. Co-Founder & CEO"
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                    />
                  </div>
                </div>

                {/* Bio Field */}
                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
                    Short Bio (Displayed on /about)
                  </label>
                  <textarea
                    rows={3}
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    placeholder="Short summary of background, experience, and role at SkillzLink..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] resize-none"
                  />
                </div>

                {/* Display Order & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
                      Display Order Index
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={form.order_index}
                      onChange={(e) => setForm({ ...form, order_index: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                    />
                  </div>

                  <div className="pt-5">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={form.is_active}
                        onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                        className="w-5 h-5 rounded text-[var(--accent-color)] focus:ring-[var(--accent-color)]"
                      />
                      <span className="text-xs font-bold text-[var(--text-primary)]">
                        Show on Public Website (Active)
                      </span>
                    </label>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-bold text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving || uploadingPhoto}
                    className="px-6 py-2.5 rounded-xl bg-[var(--accent-color)] text-white font-bold text-xs hover:opacity-90 transition-all shadow-md shadow-[var(--accent-color)]/20 disabled:opacity-50 flex items-center gap-2"
                  >
                    {saving ? "Saving..." : editingMember ? "Update Member" : "Add Member"}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {deleteModalOpen && deletingMember && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[var(--bg-primary)] rounded-3xl border border-[var(--border-color)] w-full max-w-md p-6 shadow-2xl space-y-5 animate-scaleUp">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-2xl font-bold">
                <i className="lnr lnr-trash" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold text-[var(--text-primary)]">Remove Team Member?</h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Are you sure you want to remove <strong>{deletingMember.name}</strong> ({deletingMember.role}) from the team? This action cannot be undone.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] font-bold text-xs hover:bg-[var(--bg-secondary)]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-6 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 shadow-md shadow-rose-600/20"
                >
                  Yes, Remove
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
