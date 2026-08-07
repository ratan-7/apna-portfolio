import { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Sparkles,
    FolderKanban,
    Briefcase,
    GraduationCap,
    Mail,
    UserCircle,
    Link2,
    LogOut,
    Menu,
    X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ADMIN_BASE } from "../config/adminPath";

const NAV_ITEMS = [
    { to: `/${ADMIN_BASE}/dashboard`, label: "Dashboard", icon: LayoutDashboard },
    { to: `/${ADMIN_BASE}/profile`, label: "Profile & Bio", icon: UserCircle },
    { to: `/${ADMIN_BASE}/social`, label: "Social Links", icon: Link2 },
    { to: `/${ADMIN_BASE}/skills`, label: "Skills", icon: Sparkles },
    { to: `/${ADMIN_BASE}/projects`, label: "Projects", icon: FolderKanban },
    { to: `/${ADMIN_BASE}/experiences`, label: "Experience", icon: Briefcase },
    { to: `/${ADMIN_BASE}/educations`, label: "Education", icon: GraduationCap },
    { to: `/${ADMIN_BASE}/contacts`, label: "Messages", icon: Mail },
];

export default function AdminLayout() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate(`/${ADMIN_BASE}/login`);
    };

    const currentLabel =
        NAV_ITEMS.find((item) => item.to === location.pathname)?.label || "Admin";

    return (
        <div className="min-h-screen bg-gray-50 lg:flex">
            <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 lg:hidden">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
                    aria-label="Open menu"
                >
                    <Menu size={20} />
                </button>
                <p className="text-sm font-semibold text-gray-900">{currentLabel}</p>
                <div className="w-9" />
            </div>

            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-30 bg-black/40 lg:hidden"
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col overflow-y-auto border-r border-gray-200 bg-white transition-transform duration-200 lg:static lg:z-auto lg:w-60 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex items-center justify-between border-b border-gray-200 px-5 py-5">
                    <div>
                        <p className="text-sm font-semibold text-gray-900">Admin Panel</p>
                        <p className="text-xs text-gray-500">Portfolio Management</p>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="rounded-md p-1 text-gray-400 hover:bg-gray-100 lg:hidden"
                        aria-label="Close menu"
                    >
                        <X size={18} />
                    </button>
                </div>

                <nav className="flex-1 space-y-1 px-3 py-4">
                    {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`
                            }
                        >
                            <Icon size={16} />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <div className="border-t border-gray-200 p-3">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600"
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                <Outlet />
            </main>
        </div>
    );
}