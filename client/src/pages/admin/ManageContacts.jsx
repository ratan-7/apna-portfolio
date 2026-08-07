import { useEffect, useState } from "react";
import { Mail, MailOpen, Trash2, Reply } from "lucide-react";
import { getContacts, markContactRead, deleteContact } from "../../api/contactApi";

export default function ManageContacts() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        try {
            const res = await getContacts();
            setContacts(res.data.contacts || res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleMarkRead = async (id) => {
        try {
            await markContactRead(id);
            load();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Ye message delete karna hai?")) return;
        try {
            await deleteContact(id);
            load();
        } catch (err) {
            console.error(err);
        }
    };


    const handleReply = (c) => {
        const subject = `Re: ${c.subject || "Your message"}`;
        const body = `Hi ${c.name},%0D%0A%0D%0A%0D%0A%0D%0A---%0D%0AOn your message: ${c.message}`;
        window.location.href = `mailto:${c.email}?subject=${encodeURIComponent(subject)}&body=${body}`;
        if (!c.isRead) handleMarkRead(c._id);
    };

    return (
        <div>
            <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
            <p className="mt-1 text-sm text-gray-500">
                Public contact form se aaye messages. "Reply" dabane se aapka email app khulega, message pehle se fill hoga.
            </p>

            <div className="mt-5 flex flex-col gap-3">
                {loading ? (
                    <p className="text-sm text-gray-400">Loading...</p>
                ) : contacts.length === 0 ? (
                    <p className="text-sm text-gray-400">Koi message nahi aaya abhi.</p>
                ) : (
                    contacts.map((c) => (
                        <div
                            key={c._id}
                            className={`rounded-lg border bg-white p-4 ${c.isRead ? "border-gray-200" : "border-blue-200 bg-blue-50/30"
                                }`}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="flex items-center gap-2">
                                        {c.isRead ? (
                                            <MailOpen size={14} className="text-gray-400" />
                                        ) : (
                                            <Mail size={14} className="text-blue-600" />
                                        )}
                                        <h3 className="font-medium text-gray-900">{c.name}</h3>
                                        <span className="text-xs text-gray-400">{c.email}</span>
                                    </div>
                                    {c.subject && (
                                        <p className="mt-1 text-sm font-medium text-gray-700">{c.subject}</p>
                                    )}
                                    <p className="mt-1 text-sm text-gray-600">{c.message}</p>
                                    <p className="mt-2 text-xs text-gray-400">
                                        {c.createdAt && new Date(c.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex shrink-0 gap-2">
                                    <button
                                        onClick={() => handleReply(c)}
                                        className="rounded p-1.5 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                                        title="Reply via email"
                                    >
                                        <Reply size={15} />
                                    </button>
                                    {!c.isRead && (
                                        <button
                                            onClick={() => handleMarkRead(c._id)}
                                            className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                                            title="Mark as read"
                                        >
                                            <MailOpen size={15} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(c._id)}
                                        className="rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
