import { useEffect, useState } from "react";
import { Save, CheckCircle } from "lucide-react";
import { getProfile, updateProfile } from "../../api/profileApi";

const EMPTY = { name: "", role: "", location: "", tagline: "", bio: "", readme: "" };

export default function ManageProfile() {
    const [form, setForm] = useState(EMPTY);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        getProfile()
            .then((res) => setForm({ ...EMPTY, ...res.data }))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSaved(false);
        try {
            await updateProfile(form);
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } catch (err) {
            console.error(err);
            alert("Save failed. Console check karo.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p className="text-sm text-gray-400">Loading...</p>;

    return (
        <div>
            <h1 className="text-xl font-semibold text-gray-900">Profile & Bio</h1>
            <p className="mt-1 text-sm text-gray-500">
                Hero section aur README wala text yahan se manage karo.
            </p>

            <form
                onSubmit={handleSubmit}
                className="mt-5 max-w-2xl rounded-lg border border-gray-200 bg-white p-5"
            >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
                        <input name="name" value={form.name} onChange={handleChange}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Role</label>
                        <input name="role" value={form.role} onChange={handleChange} placeholder="Full-Stack Developer"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="mb-1 block text-sm font-medium text-gray-700">Location</label>
                        <input name="location" value={form.location} onChange={handleChange} placeholder="India"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="mb-1 block text-sm font-medium text-gray-700">Tagline</label>
                        <input name="tagline" value={form.tagline} onChange={handleChange}
                            placeholder="Hero section ke naam ke neeche ki ek line"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="mb-1 block text-sm font-medium text-gray-700">Bio</label>
                        <textarea name="bio" rows={3} value={form.bio} onChange={handleChange}
                            placeholder="Chhota intro paragraph"
                            className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            README.md (About section, detailed text)
                        </label>
                        <textarea name="readme" rows={6} value={form.readme} onChange={handleChange}
                            placeholder="README.md section ka poora content"
                            className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="mt-5 flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                >
                    {saved ? <CheckCircle size={16} /> : <Save size={16} />}
                    {saving ? "Saving..." : saved ? "Saved" : "Save Changes"}
                </button>
            </form>
        </div>
    );
}
