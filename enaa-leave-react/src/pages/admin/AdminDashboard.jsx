import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/authService";

const AdminDashboard = ({ user }) => {
    const { logout } = useAuth();

    const [leaveRequests, setLeaveRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadLeaveRequests();
    }, []);

    const loadLeaveRequests = async () => {
        try {
            setLoading(true);
            setError("");

            /*
             * For now we use the existing leave request endpoint.
             *
             * Later we should create:
             * GET /api/admin/leave-requests
             *
             * which will return ALL leave requests for the admin.
             */

            const response = await api.get("/leave-requests");

            console.log("ADMIN LEAVE REQUESTS:", response.data);

            const requests =
                response.data?.leave_requests?.data ?? [];

            setLeaveRequests(requests);
        } catch (err) {
            console.error("ADMIN REQUEST ERROR:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load leave requests."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const pendingRequests = leaveRequests.filter(
        (request) =>
            request.status === "pending_manager" ||
            request.status === "pending_hr"
    );

    const approvedRequests = leaveRequests.filter(
        (request) => request.status === "approved"
    );

    const rejectedRequests = leaveRequests.filter(
        (request) => request.status === "rejected"
    );

    return (
        <div className="min-h-screen bg-slate-50">

            {/* HEADER */}
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-4">

                    <div className="flex items-center justify-between">

                        {/* Logo */}
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">
                                ENAA Leave
                            </h1>

                            <p className="text-sm text-slate-500">
                                Administration Dashboard
                            </p>
                        </div>

                        {/* Admin */}
                        <div className="flex items-center gap-4">

                            <div className="text-right">
                                <p className="font-semibold text-slate-900">
                                    {user?.name}
                                </p>

                                <p className="text-sm text-slate-500">
                                    Administrator
                                </p>
                            </div>

                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                {user?.name
                                    ?.charAt(0)
                                    ?.toUpperCase()}
                            </div>

                            <button
                                onClick={handleLogout}
                                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition"
                            >
                                Logout
                            </button>

                        </div>

                    </div>

                </div>
            </header>


            {/* MAIN */}
            <main className="max-w-7xl mx-auto px-6 py-8">

                {/* WELCOME */}
                <div className="mb-8">

                    <h2 className="text-3xl font-bold text-slate-900">
                        Administration
                    </h2>

                    <p className="mt-2 text-slate-500">
                        Manage and monitor the ENAA Leave application.
                    </p>

                </div>


                {/* STATISTICS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                    {/* TOTAL */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">

                        <p className="text-sm font-medium text-slate-500">
                            Total Requests
                        </p>

                        <p className="mt-2 text-3xl font-bold text-slate-900">
                            {loading ? "..." : leaveRequests.length}
                        </p>

                        <p className="mt-2 text-xs text-slate-400">
                            Leave requests
                        </p>

                    </div>


                    {/* PENDING */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">

                        <p className="text-sm font-medium text-slate-500">
                            Pending
                        </p>

                        <p className="mt-2 text-3xl font-bold text-amber-600">
                            {loading
                                ? "..."
                                : pendingRequests.length}
                        </p>

                        <p className="mt-2 text-xs text-slate-400">
                            Awaiting approval
                        </p>

                    </div>


                    {/* APPROVED */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">

                        <p className="text-sm font-medium text-slate-500">
                            Approved
                        </p>

                        <p className="mt-2 text-3xl font-bold text-green-600">
                            {loading
                                ? "..."
                                : approvedRequests.length}
                        </p>

                        <p className="mt-2 text-xs text-slate-400">
                            Approved requests
                        </p>

                    </div>


                    {/* REJECTED */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">

                        <p className="text-sm font-medium text-slate-500">
                            Rejected
                        </p>

                        <p className="mt-2 text-3xl font-bold text-red-600">
                            {loading
                                ? "..."
                                : rejectedRequests.length}
                        </p>

                        <p className="mt-2 text-xs text-slate-400">
                            Rejected requests
                        </p>

                    </div>

                </div>


                {/* QUICK ACTIONS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">

                        <div className="w-11 h-11 rounded-lg bg-indigo-100 flex items-center justify-center mb-4">
                            👥
                        </div>

                        <h3 className="text-lg font-semibold text-slate-900">
                            User Management
                        </h3>

                        <p className="text-sm text-slate-500 mt-2">
                            Manage employees, managers and HR accounts.
                        </p>

                        <button
                            className="mt-5 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition"
                            onClick={() =>
                                alert("User management will be implemented next.")
                            }
                        >
                            Manage Users
                        </button>

                    </div>


                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">

                        <div className="w-11 h-11 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                            📋
                        </div>

                        <h3 className="text-lg font-semibold text-slate-900">
                            Leave Requests
                        </h3>

                        <p className="text-sm text-slate-500 mt-2">
                            Monitor leave requests across the organization.
                        </p>

                        <button
                            onClick={loadLeaveRequests}
                            className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
                        >
                            Refresh Requests
                        </button>

                    </div>


                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">

                        <div className="w-11 h-11 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                            ⚙️
                        </div>

                        <h3 className="text-lg font-semibold text-slate-900">
                            System Settings
                        </h3>

                        <p className="text-sm text-slate-500 mt-2">
                            Configure application settings and leave policies.
                        </p>

                        <button
                            className="mt-5 w-full rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 transition"
                            onClick={() =>
                                alert("System settings will be implemented next.")
                            }
                        >
                            Settings
                        </button>

                    </div>

                </div>


                {/* LEAVE REQUESTS */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm">

                    <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">

                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">
                                Leave Requests Overview
                            </h3>

                            <p className="text-sm text-slate-500 mt-1">
                                Latest leave requests in the system.
                            </p>
                        </div>

                        <button
                            onClick={loadLeaveRequests}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                        >
                            Refresh
                        </button>

                    </div>


                    {/* LOADING */}
                    {loading && (
                        <div className="p-10 text-center">

                            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />

                            <p className="text-slate-500">
                                Loading requests...
                            </p>

                        </div>
                    )}


                    {/* ERROR */}
                    {!loading && error && (
                        <div className="p-6">

                            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
                                {error}
                            </div>

                        </div>
                    )}


                    {/* EMPTY */}
                    {!loading &&
                        !error &&
                        leaveRequests.length === 0 && (
                            <div className="p-10 text-center">

                                <p className="text-4xl mb-3">
                                    📭
                                </p>

                                <h4 className="font-semibold text-slate-900">
                                    No leave requests
                                </h4>

                                <p className="text-sm text-slate-500 mt-1">
                                    There are no leave requests to display.
                                </p>

                            </div>
                        )}


                    {/* TABLE */}
                    {!loading &&
                        !error &&
                        leaveRequests.length > 0 && (
                            <div className="overflow-x-auto">

                                <table className="w-full">

                                    <thead className="bg-slate-50">

                                    <tr>

                                        <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                                            Employee
                                        </th>

                                        <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                                            Leave Type
                                        </th>

                                        <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                                            Period
                                        </th>

                                        <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                                            Days
                                        </th>

                                        <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                                            Status
                                        </th>

                                    </tr>

                                    </thead>

                                    <tbody className="divide-y divide-slate-200">

                                    {leaveRequests.map((request) => (

                                        <tr
                                            key={request.id}
                                            className="hover:bg-slate-50 transition"
                                        >

                                            {/* EMPLOYEE */}
                                            <td className="px-6 py-4">

                                                <div className="flex items-center gap-3">

                                                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                                        {request.user?.name
                                                            ?.charAt(0)
                                                            ?.toUpperCase()}
                                                    </div>

                                                    <div>

                                                        <p className="font-medium text-slate-900">
                                                            {request.user?.name ||
                                                                "Unknown"}
                                                        </p>

                                                        <p className="text-xs text-slate-500">
                                                            {request.user?.email}
                                                        </p>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* LEAVE TYPE */}
                                            <td className="px-6 py-4 text-sm text-slate-700">

                                                {request.leave_type?.name ||
                                                    "N/A"}

                                            </td>


                                            {/* PERIOD */}
                                            <td className="px-6 py-4 text-sm text-slate-700">

                                                {new Date(
                                                    request.start_date
                                                ).toLocaleDateString()}{" "}
                                                →{" "}
                                                {new Date(
                                                    request.end_date
                                                ).toLocaleDateString()}

                                            </td>


                                            {/* DAYS */}
                                            <td className="px-6 py-4 text-sm font-medium text-slate-700">

                                                {request.total_days}

                                            </td>


                                            {/* STATUS */}
                                            <td className="px-6 py-4">

                                                <StatusBadge
                                                    status={request.status}
                                                />

                                            </td>

                                        </tr>

                                    ))}

                                    </tbody>

                                </table>

                            </div>
                        )}

                </div>

            </main>

        </div>
    );
};


/*
 * Status badge
 */
const StatusBadge = ({ status }) => {

    const statuses = {
        pending_manager: {
            label: "Pending Manager",
            className:
                "bg-amber-100 text-amber-700",
        },

        pending_hr: {
            label: "Pending HR",
            className:
                "bg-blue-100 text-blue-700",
        },

        approved: {
            label: "Approved",
            className:
                "bg-green-100 text-green-700",
        },

        rejected: {
            label: "Rejected",
            className:
                "bg-red-100 text-red-700",
        },

        cancelled: {
            label: "Cancelled",
            className:
                "bg-slate-100 text-slate-600",
        },
    };

    const config = statuses[status] || {
        label: status,
        className:
            "bg-slate-100 text-slate-600",
    };

    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${config.className}`}
        >
            {config.label}
        </span>
    );
};


export default AdminDashboard;