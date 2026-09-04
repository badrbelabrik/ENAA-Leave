import { useEffect, useState } from "react";
import {
    CalendarDays,
    CheckCircle,
    Clock,
    XCircle,
    Plus,
    LogOut,
    X,
    Eye,
    Ban,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import {
    getLeaveRequests,
    getLeaveRequest,
    createLeaveRequest,
    cancelLeaveRequest,
} from "../../services/leaveService";

const EmployeeDashboard = () => {
    const { user, logout } = useAuth();

    const [leaveRequests, setLeaveRequests] = useState([]);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const [selectedRequest, setSelectedRequest] = useState(null);

    const [form, setForm] = useState({
        leave_type_id: "",
        start_date: "",
        end_date: "",
        duration_type: "full_day",
        reason: "",
    });

    /*
    |--------------------------------------------------------------------------
    | Load Leave Requests
    |--------------------------------------------------------------------------
    */

    const loadLeaveRequests = async () => {
        try {
            setLoading(true);
            setError("");

            const result = await getLeaveRequests();

            // Laravel paginate() returns:
            //
            // {
            //     data: [...]
            //     current_page: 1,
            //     ...
            // }

            setLeaveRequests(result?.data || []);
        } catch (err) {
            console.error("Error loading leave requests:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load your leave requests."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLeaveRequests();
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Logout
    |--------------------------------------------------------------------------
    */

    const handleLogout = async () => {
        await logout();
    };

    /*
    |--------------------------------------------------------------------------
    | Create Leave Request
    |--------------------------------------------------------------------------
    */

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleCreateRequest = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setSubmitting(true);

        try {
            await createLeaveRequest(form);

            setSuccess("Leave request submitted successfully.");

            setForm({
                leave_type_id: "",
                start_date: "",
                end_date: "",
                duration_type: "full_day",
                reason: "",
            });

            setShowCreateModal(false);

            await loadLeaveRequests();
        } catch (err) {
            console.error("Create leave request error:", err);

            if (err.response?.status === 422) {
                const validationErrors =
                    err.response?.data?.errors;

                if (validationErrors) {
                    const firstError =
                        Object.values(validationErrors)[0]?.[0];

                    setError(
                        firstError ||
                        "Please check the information you entered."
                    );
                } else {
                    setError(
                        err.response?.data?.message ||
                        "Unable to create the leave request."
                    );
                }
            } else {
                setError(
                    err.response?.data?.message ||
                    "Something went wrong."
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Cancel Leave Request
    |--------------------------------------------------------------------------
    */

    const handleCancel = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to cancel this leave request?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await cancelLeaveRequest(id);

            setSuccess(
                "Leave request cancelled successfully."
            );

            await loadLeaveRequests();
        } catch (err) {
            console.error("Cancel request error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to cancel this request."
            );
        }
    };

    /*
    |--------------------------------------------------------------------------
    | View Details
    |--------------------------------------------------------------------------
    */

    const handleViewDetails = async (id) => {
        try {
            setError("");

            const request = await getLeaveRequest(id);

            setSelectedRequest(request);
            setShowDetailsModal(true);
        } catch (err) {
            console.error("Details error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load request details."
            );
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Status Helpers
    |--------------------------------------------------------------------------
    */

    const getStatusLabel = (status) => {
        const labels = {
            pending_manager: "Pending Manager",
            pending_hr: "Pending HR",
            approved: "Approved",
            rejected: "Rejected",
            cancelled: "Cancelled",
        };

        return labels[status] || status;
    };

    const getStatusClass = (status) => {
        const classes = {
            pending_manager:
                "bg-amber-50 text-amber-700",
            pending_hr:
                "bg-blue-50 text-blue-700",
            approved:
                "bg-emerald-50 text-emerald-700",
            rejected:
                "bg-red-50 text-red-700",
            cancelled:
                "bg-gray-100 text-gray-600",
        };

        return classes[status] ||
            "bg-gray-100 text-gray-600";
    };

    /*
    |--------------------------------------------------------------------------
    | Statistics
    |--------------------------------------------------------------------------
    */

    const totalRequests = leaveRequests.length;

    const pendingRequests = leaveRequests.filter(
        (request) =>
            request.status === "pending_manager" ||
            request.status === "pending_hr"
    ).length;

    const approvedRequests = leaveRequests.filter(
        (request) => request.status === "approved"
    ).length;

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ---------------------------------------------------------
                Header
            --------------------------------------------------------- */}

            <header className="bg-white border-b border-gray-200">

                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            ENAA Leave
                        </h1>

                        <p className="text-sm text-gray-500">
                            Leave Management System
                        </p>
                    </div>

                    <div className="flex items-center gap-4">

                        <div className="hidden sm:block text-right">
                            <p className="text-sm font-semibold text-gray-900">
                                {user?.name}
                            </p>

                            <p className="text-xs text-gray-500">
                                {user?.position}
                            </p>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                        >
                            <LogOut size={17} />
                            Logout
                        </button>

                    </div>

                </div>

            </header>

            {/* ---------------------------------------------------------
                Main
            --------------------------------------------------------- */}

            <main className="max-w-7xl mx-auto px-6 py-8">

                {/* Welcome */}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">
                            Welcome, {user?.name}
                        </h2>

                        <p className="mt-1 text-gray-500">
                            Manage your leave requests and track
                            their status.
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            setError("");
                            setSuccess("");
                            setShowCreateModal(true);
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
                    >
                        <Plus size={19} />
                        Request Leave
                    </button>

                </div>

                {/* Success */}

                {success && (
                    <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        <CheckCircle size={18} />
                        {success}
                    </div>
                )}

                {/* Error */}

                {error && (
                    <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        <XCircle size={18} />
                        {error}
                    </div>
                )}

                {/* ---------------------------------------------------------
                    Statistics
                --------------------------------------------------------- */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm text-gray-500">
                                    Total Requests
                                </p>

                                <p className="mt-2 text-3xl font-bold text-gray-900">
                                    {totalRequests}
                                </p>
                            </div>

                            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                <CalendarDays size={22} />
                            </div>

                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm text-gray-500">
                                    Pending
                                </p>

                                <p className="mt-2 text-3xl font-bold text-amber-600">
                                    {pendingRequests}
                                </p>
                            </div>

                            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                <Clock size={22} />
                            </div>

                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm text-gray-500">
                                    Approved
                                </p>

                                <p className="mt-2 text-3xl font-bold text-emerald-600">
                                    {approvedRequests}
                                </p>
                            </div>

                            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <CheckCircle size={22} />
                            </div>

                        </div>
                    </div>

                </div>

                {/* ---------------------------------------------------------
                    Leave Requests
                --------------------------------------------------------- */}

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                    <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">

                        <div>
                            <h3 className="text-xl font-bold text-gray-900">
                                My Leave Requests
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                                View and manage your submitted requests.
                            </p>
                        </div>

                        <button
                            onClick={loadLeaveRequests}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                        >
                            Refresh
                        </button>

                    </div>

                    {loading ? (
                        <div className="p-12 text-center text-gray-500">
                            Loading your leave requests...
                        </div>
                    ) : leaveRequests.length === 0 ? (

                        <div className="p-12 text-center">

                            <CalendarDays
                                size={42}
                                className="mx-auto text-gray-300"
                            />

                            <h4 className="mt-4 font-semibold text-gray-900">
                                No leave requests yet
                            </h4>

                            <p className="mt-1 text-sm text-gray-500">
                                Create your first leave request to get started.
                            </p>

                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                            >
                                <Plus size={16} />
                                Request Leave
                            </button>

                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead className="bg-gray-50">
                                <tr>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Leave Type
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Period
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Days
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Actions
                                    </th>

                                </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">

                                {leaveRequests.map((request) => (

                                    <tr
                                        key={request.id}
                                        className="hover:bg-gray-50 transition"
                                    >

                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900">
                                                {request.leave_type?.name || "—"}
                                            </p>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {request.start_date}
                                            {" → "}
                                            {request.end_date}
                                        </td>

                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {request.total_days}
                                        </td>

                                        <td className="px-6 py-4">

                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                                                        request.status
                                                    )}`}
                                                >
                                                    {getStatusLabel(
                                                        request.status
                                                    )}
                                                </span>

                                        </td>

                                        <td className="px-6 py-4">

                                            <div className="flex justify-end items-center gap-3">

                                                <button
                                                    onClick={() =>
                                                        handleViewDetails(
                                                            request.id
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800"
                                                >
                                                    <Eye size={16} />
                                                    View
                                                </button>

                                                {[
                                                    "pending_manager",
                                                    "pending_hr",
                                                ].includes(
                                                    request.status
                                                ) && (

                                                    <button
                                                        onClick={() =>
                                                            handleCancel(
                                                                request.id
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-800"
                                                    >
                                                        <Ban size={16} />
                                                        Cancel
                                                    </button>

                                                )}

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </main>

            {/* =========================================================
                CREATE LEAVE REQUEST MODAL
            ========================================================= */}

            {showCreateModal && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

                    <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

                        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">

                            <div>
                                <h3 className="text-xl font-bold text-gray-900">
                                    Request Leave
                                </h3>

                                <p className="text-sm text-gray-500 mt-1">
                                    Submit a new leave request.
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    setShowCreateModal(false)
                                }
                                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>

                        </div>

                        <form
                            onSubmit={handleCreateRequest}
                            className="p-6 space-y-5"
                        >

                            {/* Leave Type */}

                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Leave Type
                                </label>

                                <input
                                    type="number"
                                    name="leave_type_id"
                                    value={form.leave_type_id}
                                    onChange={handleInputChange}
                                    placeholder="Leave type ID"
                                    required
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />

                                <p className="mt-1 text-xs text-gray-400">
                                    We can replace this with a dropdown once
                                    the leave-types API is available.
                                </p>

                            </div>

                            {/* Dates */}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Start date
                                    </label>

                                    <input
                                        type="date"
                                        name="start_date"
                                        value={form.start_date}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    />

                                </div>

                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        End date
                                    </label>

                                    <input
                                        type="date"
                                        name="end_date"
                                        value={form.end_date}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    />

                                </div>

                            </div>

                            {/* Duration */}

                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Duration
                                </label>

                                <select
                                    name="duration_type"
                                    value={form.duration_type}
                                    onChange={handleInputChange}
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                >

                                    <option value="full_day">
                                        Full day
                                    </option>

                                    <option value="half_day_morning">
                                        Half day — Morning
                                    </option>

                                    <option value="half_day_afternoon">
                                        Half day — Afternoon
                                    </option>

                                </select>

                            </div>

                            {/* Reason */}

                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Reason
                                </label>

                                <textarea
                                    name="reason"
                                    value={form.reason}
                                    onChange={handleInputChange}
                                    rows="3"
                                    placeholder="Enter the reason for your leave..."
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none resize-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />

                            </div>

                            {/* Buttons */}

                            <div className="flex justify-end gap-3 pt-2">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowCreateModal(false)
                                    }
                                    className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {submitting
                                        ? "Submitting..."
                                        : "Submit Request"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

            {/* =========================================================
                DETAILS MODAL
            ========================================================= */}

            {showDetailsModal && selectedRequest && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

                    <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

                        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">

                            <h3 className="text-xl font-bold text-gray-900">
                                Leave Request Details
                            </h3>

                            <button
                                onClick={() =>
                                    setShowDetailsModal(false)
                                }
                                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
                            >
                                <X size={20} />
                            </button>

                        </div>

                        <div className="p-6 space-y-5">

                            <div>
                                <p className="text-sm text-gray-500">
                                    Leave Type
                                </p>

                                <p className="font-semibold text-gray-900">
                                    {selectedRequest.leave_type?.name ||
                                        "—"}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Start Date
                                    </p>

                                    <p className="font-semibold">
                                        {selectedRequest.start_date}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        End Date
                                    </p>

                                    <p className="font-semibold">
                                        {selectedRequest.end_date}
                                    </p>
                                </div>

                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Total Days
                                </p>

                                <p className="font-semibold">
                                    {selectedRequest.total_days}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Status
                                </p>

                                <span
                                    className={`inline-flex mt-1 rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                                        selectedRequest.status
                                    )}`}
                                >
                                    {getStatusLabel(
                                        selectedRequest.status
                                    )}
                                </span>
                            </div>

                            {selectedRequest.reason && (

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Reason
                                    </p>

                                    <p className="mt-1 text-gray-700">
                                        {selectedRequest.reason}
                                    </p>
                                </div>

                            )}

                            <button
                                onClick={() =>
                                    setShowDetailsModal(false)
                                }
                                className="w-full rounded-xl bg-gray-900 py-3 font-semibold text-white hover:bg-gray-800"
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};

export default EmployeeDashboard;