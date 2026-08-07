import { useEffect, useState } from "react";
import { Eye, Download, Sparkles, FolderKanban, Mail } from "lucide-react";
import { getAnalytics } from "../../api/analyticsApi";
import { getSkills } from "../../api/skillApi";
import { getProjects } from "../../api/projectApi";
import { getContacts } from "../../api/contactApi";

function StatCard({ icon: Icon, label, value, loading }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-blue-600">
        <Icon size={17} />
      </div>
      <p className="text-2xl font-semibold text-gray-900">
        {loading ? "—" : value}
      </p>
      <p className="mt-1 text-sm text-gray-500">{label}</p>
    </div>
  );
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    visitors: 0,
    downloads: 0,
    skills: 0,
    projects: 0,
    unreadMessages: 0,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const [analyticsRes, skillsRes, projectsRes, contactsRes] =
          await Promise.all([
            getAnalytics(),
            getSkills(),
            getProjects(),
            getContacts(),
          ]);

        const analytics = analyticsRes.data?.[0] || analyticsRes.data || {};
        const unread = (contactsRes.data || []).filter((c) => !c.isRead).length;

        setStats({
          visitors: analytics.totalVisitors ?? 0,
          downloads: analytics.resumeDownloads ?? 0,
          skills: skillsRes.data?.length ?? 0,
          projects: projectsRes.data?.length ?? 0,
          unreadMessages: unread,
        });
      } catch (err) {
        console.error("Dashboard stats load failed:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">
        Portfolio ka quick overview.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard icon={Eye} label="Total Visitors" value={stats.visitors} loading={loading} />
        <StatCard icon={Download} label="Resume Downloads" value={stats.downloads} loading={loading} />
        <StatCard icon={Sparkles} label="Skills Added" value={stats.skills} loading={loading} />
        <StatCard icon={FolderKanban} label="Projects Added" value={stats.projects} loading={loading} />
        <StatCard icon={Mail} label="Unread Messages" value={stats.unreadMessages} loading={loading} />
      </div>
    </div>
  );
}
