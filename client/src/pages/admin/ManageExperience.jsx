import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import {
    getExperience,
    createExperience,
    updateExperience,
    deleteExperience,
} from "../../api/experienceApi";

const EMPTY_FORM = {
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    currentlyWorking: true,
    description: "",
    skills: "",
};

export default function ManageExperience() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);

    const load = async () => {
        setLoading(true);
        try {
            const res = await getExperience();
            setItems(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const openAddForm = () => {
        setForm(EMPTY_FORM);
        setEditingId(null);
        setShowForm(true);
    };

    const openEditForm = (item) => {
        setForm({
            title: item.title || "",
            company: item.company || "",
            location: item.location || "",
            startDate: item.startDate ? item.startDate.slice(0, 10) : "",
            endDate: item.endDate ? item.endDate.slice(0, 10) : "",
            currentlyWorking: !!item.currentlyWorking,
            description: item.description || "",
            skills: (item.skills || []).join(", "),
        });
        setEditingId(item._id);
        setShowForm(true);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...form,
            skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
            endDate: form.currentlyWorking ? undefined : form.endDate,
        };
        try {
            if (editingId) {
                await updateExperience(editingId, payload);
            } else {
                await createExperience(payload);
            }
            setShowForm(false);
            load();
        } catch (err) {
            console.error(err);
            alert("Save failed. Console check karo.");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Ye experience delete karna hai?")) return;
        try {
            await deleteExperience(id);
            load();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">Experience</h1>
                    <p className="mt-1 text-sm text-gray-500">Apna work history manage karo.</p>
                </div>
                <button
                    onClick={openAddForm}
                    className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                    <Plus size={16} /> Add Experience
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="mt-5 rounded-lg border border-gray-200 bg-white p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-gray-900">
                            {editingId ? "Edit Experience" : "New Experience"}
                        </h2>
                        <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                            <X size={16} />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <input name="title" required placeholder="Job Title" value={form.title} onChange={handleChange}
                            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
                        <input name="company" required placeholder="Company" value={form.company} onChange={handleChange}
                            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
                        <input name="location" placeholder="Location" value={form.location} onChange={handleChange}
                            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
                        <input name="startDate" type="date" required value={form.startDate} onChange={handleChange}
                            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
                        {!form.currentlyWorking && (
                            <input name="endDate" type="date" value={form.endDate} onChange={handleChange}
                                className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
                        )}
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                            <input type="checkbox" name="currentlyWorking" checked={form.currentlyWorking} onChange={handleChange} />
                            Currently working here
                        </label>
                    </div>
                    <textarea
                        name="description" required rows={3} placeholder="Description"
                        value={form.description} onChange={handleChange}
                        className="mt-3 w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                    <input
                        name="skills" placeholder="Skills used (comma se separate karo)"
                        value={form.skills} onChange={handleChange}
                        className="mt-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                    <button type="submit" className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                        {editingId ? "Update" : "Save"}
                    </button>
                </form>
            )}

            <div className="mt-5 flex flex-col gap-3">
                {loading ? (
                    <p className="text-sm text-gray-400">Loading...</p>
                ) : items.length === 0 ? (
                    <p className="text-sm text-gray-400">Koi experience nahi hai abhi.</p>
                ) : (
                    items.map((item) => (
                        <div key={item._id} className="flex items-start justify-between rounded-lg border border-gray-200 bg-white p-4">
                            <div>
                                <h3 className="font-medium text-gray-900">
                                    {item.title} <span className="text-gray-400">@ {item.company}</span>
                                </h3>
                                <p className="mt-0.5 text-xs text-gray-500">
                                    {item.location} · {item.startDate?.slice(0, 10)} —{" "}
                                    {item.currentlyWorking ? "Present" : item.endDate?.slice(0, 10)}
                                </p>
                                <p className="mt-2 text-sm text-gray-600">{item.description}</p>
                            </div>
                            <div className="flex shrink-0 gap-2">
                                <button onClick={() => openEditForm(item)} className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600">
                                    <Pencil size={15} />
                                </button>
                                <button onClick={() => handleDelete(item._id)} className="rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600">
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
