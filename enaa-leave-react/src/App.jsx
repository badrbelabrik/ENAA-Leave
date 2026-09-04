import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import HRDashboard from "./pages/hr/HrDashboard.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard";

import { useAuth } from "./context/AuthContext";

function App() {
    const { user, loading } = useAuth();

    /*
     * Wait for AuthContext to determine whether
     * the user is already authenticated.
     */
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />

                    <p className="text-slate-500">
                        Loading...
                    </p>
                </div>
            </div>
        );
    }

    const role = user?.roles?.[0];

    return (
        <Routes>

            {/* Login */}
            <Route
                path="/login"
                element={
                    user
                        ? <RoleRedirect role={role} />
                        : <Login />
                }
            />

            {/* Employee */}
            <Route
                path="/employee-dashboard"
                element={
                    <RoleRoute
                        user={user}
                        allowedRole="employee"
                    >
                        <EmployeeDashboard user={user} />
                    </RoleRoute>
                }
            />

            {/* Manager */}
            <Route
                path="/manager-dashboard"
                element={
                    <RoleRoute
                        user={user}
                        allowedRole="manager"
                    >
                        <ManagerDashboard user={user} />
                    </RoleRoute>
                }
            />

            {/* HR */}
            <Route
                path="/hr-dashboard"
                element={
                    <RoleRoute
                        user={user}
                        allowedRole="hr"
                    >
                        <HRDashboard user={user} />
                    </RoleRoute>
                }
            />

            {/* Admin */}
            <Route
                path="/admin-dashboard"
                element={
                    <RoleRoute
                        user={user}
                        allowedRole="admin"
                    >
                        <AdminDashboard user={user} />
                    </RoleRoute>
                }
            />

            {/* Root */}
            <Route
                path="/"
                element={
                    user
                        ? <RoleRedirect role={role} />
                        : <Navigate to="/login" replace />
                }
            />

            {/* Unknown URL */}
            <Route
                path="*"
                element={
                    user
                        ? <RoleRedirect role={role} />
                        : <Navigate to="/login" replace />
                }
            />

        </Routes>
    );
}


/*
 * Redirect authenticated users to the
 * dashboard corresponding to their role.
 */
function RoleRedirect({ role }) {
    switch (role) {
        case "employee":
            return (
                <Navigate
                    to="/employee-dashboard"
                    replace
                />
            );

        case "manager":
            return (
                <Navigate
                    to="/manager-dashboard"
                    replace
                />
            );

        case "hr":
            return (
                <Navigate
                    to="/hr-dashboard"
                    replace
                />
            );

        case "admin":
            return (
                <Navigate
                    to="/admin-dashboard"
                    replace
                />
            );

        default:
            return (
                <Navigate
                    to="/login"
                    replace
                />
            );
    }
}


/*
 * Protect a dashboard according to its role.
 */
function RoleRoute({
                       user,
                       allowedRole,
                       children,
                   }) {
    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    const hasRole = user.roles?.includes(allowedRole);

    if (!hasRole) {
        return (
            <RoleRedirect
                role={user.roles?.[0]}
            />
        );
    }

    return children;
}

export default App;