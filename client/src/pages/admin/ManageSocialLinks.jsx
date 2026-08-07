import { useEffect, useState } from "react";
import { Save, CheckCircle, Upload, Loader2, FileText } from "lucide-react";
import { getSocialLinks, updateSocialLinks } from "../../api/socialApi";
import { uploadFile } from "../../api/uploadApi";

const FIELDS = [
    { name: "github", label: "GitHub", placeholder: "https://github.com/username" },
    { name: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/username" },
    { name: "leetcode", label: "LeetCode", placeholder: "https://leetcode.com/username" },
    { name: "youtube", label: "YouTube", placeholder: "https://youtube.com/@username" },
    { name: "instagram", label: "Instagram", placeholder: "https://instagram.com/username" },
    { name: "email", label: "Email", placeholder: "you@example.com" },
    { name: "phone", label: "Phone", placeholder: "+91 98765 43210" },
    { name: "twitter", label: "Twitter", placeholder: "https://x.com/username" },
];

const EMPTY = { resumeUrl: "", ...Object.fromEntries(FIELDS.map((f) => [f.name, ""])) };

export default function ManageSocialLinks() {
    const [form, setForm] = useState(EMPTY);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        getSocialLinks()
            .then((res) => setForm({ ...EMPTY, ...res.data }))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleResumeUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const res = await uploadFile(file);
            setForm((prev) => ({ ...prev, resumeUrl: res.data.url }));
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
        setSaving(true);
        setSaved(false);
        try {
            await updateSocialLinks(form);
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
            <h1 className="text-xl font-semibold text-gray-900">Social Links & Resume</h1>
            <p className="mt-1 text-sm text-gray-500">
                Public site pe dikhne wale sab links yahan se manage karo.
            </p>

            <form
                onSubmit={handleSubmit}
                className="mt-5 max-w-xl rounded-lg border border-gray-200 bg-white p-5"
            >
                //resumeee upload
                <div className="mb-4">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Resume (PDF)</label>
                    <div className="flex items-center gap-3">
                        {form.resumeUrl && (
                            <a
                                href={form.resumeUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-gray-200 text-blue-600"
                            >
                                <FileText size={18} />
                            </a>
                        )}
                        <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-gray-300 px-3 py-2.5 text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600">
                            {uploading ? (
                                <>
                                    <Loader2 size={15} className="animate-spin" /> Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload size={15} /> {form.resumeUrl ? "Replace resume" : "Upload resume"}
                                </>
                            )}
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={handleResumeUpload}
                                className="hidden"
                                disabled={uploading}
                            />
                        </label>
                    </div>
                    <input
                        name="resumeUrl"
                        placeholder="ya seedha PDF URL paste karo"
                        value={form.resumeUrl}
                        onChange={handleChange}
                        className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-xs text-gray-500 outline-none focus:border-blue-500"
                    />
                </div>

                <div className="flex flex-col gap-4 border-t border-gray-100 pt-4">
                    {FIELDS.map((field) => (
                        <div key={field.name}>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                {field.label}
                            </label>
                            <input
                                name={field.name}
                                value={form[field.name]}
                                onChange={handleChange}
                                placeholder={field.placeholder}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    ))}
                </div>

                <button
                    type="submit"
                    disabled={saving || uploading}
                    className="mt-5 flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                >
                    {saved ? <CheckCircle size={16} /> : <Save size={16} />}
                    {saving ? "Saving..." : saved ? "Saved" : "Save Changes"}
                </button>
            </form>
        </div>
    );
}