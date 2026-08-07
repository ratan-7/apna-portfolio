import { Routes, Route } from "react-router-dom";
import { ADMIN_BASE } from "../config/adminPath";

import AdminLayout from "../layouts/AdminLayout";

import Home from "../pages/public/Home";
import NotFound from "../pages/public/NotFound";

import Login from "../pages/admin/Login";
import Dashboard from "../pages/admin/Dashboard";
import ManageProfile from "../pages/admin/ManageProfile";
import ManageSocialLinks from "../pages/admin/ManageSocialLinks";
import ManageSkills from "../pages/admin/ManageSkills";
import ManageProjects from "../pages/admin/ManageProjects";
import ManageExperience from "../pages/admin/ManageExperience";
import ManageEducation from "../pages/admin/ManageEducation";
import ManageContacts from "../pages/admin/ManageContacts";

import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />


            <Route path={`/${ADMIN_BASE}/login`} element={<Login />} />

            <Route element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                    <Route path={`/${ADMIN_BASE}/dashboard`} element={<Dashboard />} />
                    <Route path={`/${ADMIN_BASE}/profile`} element={<ManageProfile />} />
                    <Route path={`/${ADMIN_BASE}/social`} element={<ManageSocialLinks />} />
                    <Route path={`/${ADMIN_BASE}/skills`} element={<ManageSkills />} />
                    <Route path={`/${ADMIN_BASE}/projects`} element={<ManageProjects />} />
                    <Route path={`/${ADMIN_BASE}/experiences`} element={<ManageExperience />} />
                    <Route path={`/${ADMIN_BASE}/educations`} element={<ManageEducation />} />
                    <Route path={`/${ADMIN_BASE}/contacts`} element={<ManageContacts />} />
                </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default AppRoutes;