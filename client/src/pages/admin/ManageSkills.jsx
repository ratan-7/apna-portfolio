import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { getSkills, createSkill, updateSkill, deleteSkill } from "../../api/skillApi";

const EMPTY_FORM = { name: "", level: "", catagory: "", icon: "", Order: 0 };

export default function ManageSkills() {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);

    const loadSkills = async () => {
        setLoading(true);
        try {
            const res = await getSkills();
            setSkills(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSkills();
    }, []);

    const openAddForm = () => {
        setForm(EMPTY_FORM);
        setEditingId(null);
        setShowForm(true);
    };

    const openEditForm = (skill) => {
        setForm({
            name: skill.name || "",
            level: skill.level || "",
            catagory: skill.catagory || "",
            icon: skill.icon || "",
            Order: skill.Order || 0,
        });
        setEditingId(skill._id);
        setShowForm(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: name === "level" || name === "Order" ? Number(value) : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateSkill(editingId, form);
            } else {
                await createSkill(form);
            }
            setShowForm(false);
            loadSkills();
        } catch (err) {
            console.error(err);
            alert("Save failed. Console check karo.");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Ye skill delete karni hai?")) return;
        try {
            await deleteSkill(id);
            loadSkills();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">Skills</h1>
                    <p className="mt-1 text-sm text-gray-500">Apni skills manage karo.</p>
                </div>
                <button
                    onClick={openAddForm}
                    className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                    <Plus size={16} /> Add Skill
                </button>
            </div>

            {/* Add/Edit form */}
            {showForm && (
                <form
                    onSubmit={handleSubmit}
                    className="mt-5 rounded-lg border border-gray-200 bg-white p-5"
                >
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-gray-900">
                            {editingId ? "Edit Skill" : "New Skill"}
                        </h2>
                        <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                            <X size={16} />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <input
                            name="name" required placeholder="Name (e.g. React)"
                            value={form.name} onChange={handleChange}
                            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />
                        <input
                            name="catagory" placeholder="Category (e.g. Frontend)"
                            value={form.catagory} onChange={handleChange}
                            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />
                        <input
                            name="level" type="number" min="0" max="100" placeholder="Level (0-100)"
                            value={form.level} onChange={handleChange}
                            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />
                        <input
                            name="icon" placeholder="Icon (name/URL)"
                            value={form.icon} onChange={handleChange}
                            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />
                        <input
                            name="Order" type="number" placeholder="Display Order"
                            value={form.Order} onChange={handleChange}
                            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        {editingId ? "Update" : "Save"}
                    </button>
                </form>
            )}

            {/* Table */}
            <div className="mt-5 overflow-x-auto rounded-lg border border-gray-200 bg-white">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
                        <tr>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3">Level</th>
                            <th className="px-4 py-3">Order</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400">Loading...</td></tr>
                        ) : skills.length === 0 ? (
                            <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400">Koi skill nahi hai abhi.</td></tr>
                        ) : (
                            skills.map((skill) => (
                                <tr key={skill._id} className="border-b border-gray-100 last:border-0">
                                    <td className="px-4 py-3 font-medium text-gray-900">{skill.name}</td>
                                    <td className="px-4 py-3 text-gray-600">{skill.catagory}</td>
                                    <td className="px-4 py-3 text-gray-600">{skill.level}</td>
                                    <td className="px-4 py-3 text-gray-600">{skill.Order}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => openEditForm(skill)} className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600">
                                                <Pencil size={15} />
                                            </button>
                                            <button onClick={() => handleDelete(skill._id)} className="rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600">
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
