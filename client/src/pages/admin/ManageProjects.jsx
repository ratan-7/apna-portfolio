import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Upload, Loader2 } from "lucide-react";
import { getProjects, createProject, updateProject, deleteProject } from "../../api/projectApi";
import { uploadFile } from "../../api/uploadApi";

const EMPTY_FORM = { title: "", description: "", skills: "", image: "", url: "", githubUrl: "" };

export default function ManageProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [uploading, setUploading] = useState(false);

    const loadProjects = async () => {
        setLoading(true);
        try {
            const res = await getProjects();
            setProjects(res.data.projects || res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProjects();
    }, []);

    const openAddForm = () => {
        setForm(EMPTY_FORM);
        setEditingId(null);
        setShowForm(true);
    };

    const openEditForm = (project) => {
        setForm({
            title: project.title || "",
            description: project.description || "",
            skills: (project.skills || []).join(", "),
            image: project.image || "",
            url: project.url || "",
            githubUrl: project.githubUrl || "",
        });
        setEditingId(project._id);
        setShowForm(true);
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleImageFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const res = await uploadFile(file);
            setForm((prev) => ({ ...prev, image: res.data.url }));
        } catch (err) {
            console.error(err);
            alert("Upload failed. Console check karo.");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateProject(editingId, form);
            } else {
                await createProject(form);
            }
            setShowForm(false);
            loadProjects();
        } catch (err) {
            console.error(err);
            alert("Save failed. Console check karo.");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Ye project delete karna hai?")) return;
        try {
            await deleteProject(id);
            loadProjects();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">Projects</h1>
                    <p className="mt-1 text-sm text-gray-500">Apne projects manage karo.</p>
                </div>
                <button
                    onClick={openAddForm}
                    className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                    <Plus size={16} /> Add Project
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="mt-5 rounded-lg border border-gray-200 bg-white p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-gray-900">
                            {editingId ? "Edit Project" : "New Project"}
                        </h2>
                        <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                            <X size={16} />
                        </button>
                    </div>
                    <div className="flex flex-col gap-3">
                        <input
                            name="title" required placeholder="Project Title"
                            value={form.title} onChange={handleChange}
                            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />
                        <textarea
                            name="description" required rows={3} placeholder="Description"
                            value={form.description} onChange={handleChange}
                            className="resize-none rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />
                        <input
                            name="skills" placeholder="Skills (comma se separate karo — React, Node.js)"
                            value={form.skills} onChange={handleChange}
                            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />

                        {/* Image upload */}
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500">
                                Project Screenshot
                            </label>
                            <div className="flex items-center gap-3">
                                {form.image && (
                                    <img
                                        src={form.image}
                                        alt="preview"
                                        className="h-14 w-14 shrink-0 rounded-md border border-gray-200 object-cover"
                                    />
                                )}
                                <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-gray-300 px-3 py-2.5 text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600">
                                    {uploading ? (
                                        <>
                                            <Loader2 size={15} className="animate-spin" /> Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={15} /> {form.image ? "Change image" : "Upload image"}
                                        </>
                                    )}
                                    <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" disabled={uploading} />
                                </label>
                            </div>
                            <input
                                name="image" placeholder="ya seedha image URL paste karo"
                                value={form.image} onChange={handleChange}
                                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-xs text-gray-500 outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <input
                                name="url" placeholder="Live URL (deployed site)"
                                value={form.url} onChange={handleChange}
                                className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                            />
                            <input
                                name="githubUrl" placeholder="GitHub Repo URL"
                                value={form.githubUrl} onChange={handleChange}
                                className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={uploading}
                        className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                        {editingId ? "Update" : "Save"}
                    </button>
                </form>
            )}

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    <p className="text-sm text-gray-400">Loading...</p>
                ) : projects.length === 0 ? (
                    <p className="text-sm text-gray-400">Koi project nahi hai abhi.</p>
                ) : (
                    projects.map((project) => (
                        <div key={project._id} className="rounded-lg border border-gray-200 bg-white p-4">
                            {project.image && (
                                <img src={project.image} alt={project.title} className="mb-3 h-32 w-full rounded-md object-cover" />
                            )}
                            <h3 className="font-medium text-gray-900">{project.title}</h3>
                            <p className="mt-1 line-clamp-2 text-sm text-gray-500">{project.description}</p>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                                {(project.skills || []).map((s) => (
                                    <span key={s} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                                        {s}
                                    </span>
                                ))}
                            </div>
                            <div className="mt-3 flex justify-end gap-2 border-t border-gray-100 pt-3">
                                <button onClick={() => openEditForm(project)} className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600">
                                    <Pencil size={15} />
                                </button>
                                <button onClick={() => handleDelete(project._id)} className="rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600">
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}