import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    CheckCircle,
    XCircle,
    LogOut,
    RefreshCw,
    CalendarDays,
    User,
    FileText,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const HrDashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [processingId, setProcessingId] = useState(null);
    const [rejectingId, setRejectingId] = useState(null);
    const [rejectComment, setRejectComment] = useState("");

    /**
     * Get HR pending leave requests
     */
    const fetchRequests = async () => {
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("token");

            console.log("========== HR DASHBOARD ==========");
            console.log("Token exists:", !!token);
            console.log("Current user:", user);

            const response = await axios.get(
                "http://127.0.0.1:8000/api/hr/leave-requests",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );

            console.log("HR API STATUS:", response.status);
            console.log("HR API RESPONSE:", response.data);

            /**
             * Laravel paginate() returns:
             *
             * {
             *   leave_requests: {
             *      data: [...]
             *   }
             * }
             */
            const data = response.data?.leave_requests?.data ?? [];

            console.log("Extracted requests:", data);
            console.log("Number of requests:", data.length);

            setRequests(data);
        } catch (err) {
            console.error("HR REQUEST ERROR:", err);
            console.error("Status:", err.response?.status);
            console.error("Response:", err.response?.data);

            setError(
                err.response?.data?.message ||
                "Unable to load HR leave requests."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    /**
     * Approve request
     */
    const handleApprove = async (requestId) => {
        if (!window.confirm("Approve this leave request?")) {
            return;
        }

        try {
            setProcessingId(requestId);

            const token = localStorage.getItem("token");

            const response = await axios.post(
                `http://127.0.0.1:8000/api/leave-requests/${requestId}/approve`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );

            console.log("APPROVE RESPONSE:", response.data);

            // Remove the approved request from the HR pending list
            setRequests((current) =>
                current.filter((request) => request.id !== requestId)
            );
        } catch (err) {
            console.error("APPROVE ERROR:", err);

            alert(
                err.response?.data?.message ||
                "Unable to approve this leave request."
            );
        } finally {
            setProcessingId(null);
        }
    };

    /**
     * Reject request
     */
    const handleReject = async (requestId) => {
        try {
            setProcessingId(requestId);

            const token = localStorage.getItem("token");

            const response = await axios.post(
                `http://127.0.0.1:8000/api/leave-requests/${requestId}/reject`,
                {
                    comment: rejectComment || null,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );

            console.log("REJECT RESPONSE:", response.data);

            setRequests((current) =>
                current.filter((request) => request.id !== requestId)
            );

            setRejectingId(null);
            setRejectComment("");
        } catch (err) {
            console.error("REJECT ERROR:", err);

            alert(
                err.response?.data?.message ||
                "Unable to reject this leave request."
            );
        } finally {
            setProcessingId(null);
        }
    };

    /**
     * Logout
     */
    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            navigate("/", { replace: true });
        }
    };

    /**
     * Format date
     */
    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* HEADER */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            ENAA Leave
                        </h1>

                        <p className="text-sm text-gray-500">
                            Human Resources Dashboard
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="font-semibold text-gray-900">
                                {user?.name || "HR"}
                            </p>

                            <p className="text-sm text-gray-500">
                                Human Resources
                            </p>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* MAIN */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* TITLE */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">
                            Leave Requests
                        </h2>

                        <p className="text-gray-500 mt-1">
                            Review and process employee leave requests.
                        </p>
                    </div>

                    <button
                        onClick={fetchRequests}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition"
                    >
                        <RefreshCw
                            size={18}
                            className={loading ? "animate-spin" : ""}
                        />
                        Refresh
                    </button>
                </div>

                {/* STAT */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <p className="text-sm text-gray-500">
                            Pending HR Approval
                        </p>

                        <p className="text-3xl font-bold text-gray-900 mt-2">
                            {requests.length}
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <p className="text-sm text-gray-500">
                            Department
                        </p>

                        <p className="text-xl font-bold text-gray-900 mt-2">
                            Human Resources
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <p className="text-sm text-gray-500">
                            Logged in as
                        </p>

                        <p className="text-xl font-bold text-gray-900 mt-2">
                            {user?.name || "HR"}
                        </p>
                    </div>
                </div>

                {/* ERROR */}
                {error && (
                    <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-5 py-4 text-red-700">
                        {error}
                    </div>
                )}

                {/* LOADING */}
                {loading ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <RefreshCw
                            className="animate-spin mx-auto mb-4 text-gray-500"
                            size={30}
                        />

                        <p className="text-gray-500">
                            Loading leave requests...
                        </p>
                    </div>
                ) : requests.length === 0 ? (
                    /* EMPTY */
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <CheckCircle
                            size={50}
                            className="mx-auto mb-4 text-green-500"
                        />

                        <h3 className="text-xl font-semibold text-gray-900">
                            No pending requests
                        </h3>

                        <p className="text-gray-500 mt-2">
                            There are currently no leave requests waiting for
                            HR approval.
                        </p>
                    </div>
                ) : (
                    /* REQUESTS */
                    <div className="space-y-5">
                        {requests.map((request) => (
                            <div
                                key={request.id}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                            >
                                {/* REQUEST HEADER */}
                                <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center">
                                            <User
                                                size={21}
                                                className="text-blue-600"
                                            />
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                {request.user?.name ||
                                                    "Unknown Employee"}
                                            </h3>

                                            <p className="text-sm text-gray-500">
                                                {request.user?.position ||
                                                    "Employee"}
                                            </p>
                                        </div>
                                    </div>

                                    <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium">
                                        Pending HR
                                    </span>
                                </div>

                                {/* REQUEST DETAILS */}
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                                                Leave Type
                                            </p>

                                            <p className="font-medium text-gray-900">
                                                {request.leave_type?.name ||
                                                    "-"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                                                Start Date
                                            </p>

                                            <div className="flex items-center gap-2">
                                                <CalendarDays
                                                    size={16}
                                                    className="text-gray-400"
                                                />

                                                <p className="font-medium text-gray-900">
                                                    {formatDate(
                                                        request.start_date
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                                                End Date
                                            </p>

                                            <div className="flex items-center gap-2">
                                                <CalendarDays
                                                    size={16}
                                                    className="text-gray-400"
                                                />

                                                <p className="font-medium text-gray-900">
                                                    {formatDate(
                                                        request.end_date
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                                                Duration
                                            </p>

                                            <p className="font-bold text-gray-900">
                                                {request.total_days} days
                                            </p>
                                        </div>
                                    </div>

                                    {/* REASON */}
                                    <div className="mt-6 bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FileText
                                                size={17}
                                                className="text-gray-500"
                                            />

                                            <p className="font-semibold text-gray-700">
                                                Reason
                                            </p>
                                        </div>

                                        <p className="text-gray-600">
                                            {request.reason || "No reason provided."}
                                        </p>
                                    </div>

                                    {/* PREVIOUS APPROVAL */}
                                    {request.approvals?.length > 0 && (
                                        <div className="mt-5 text-sm text-gray-500">
                                            <strong>
                                                Manager approval:
                                            </strong>{" "}
                                            Approved by{" "}
                                            {
                                                request.approvals[0]?.approver
                                                    ?.name
                                            }
                                        </div>
                                    )}

                                    {/* REJECTION COMMENT */}
                                    {rejectingId === request.id && (
                                        <div className="mt-5">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Rejection reason
                                            </label>

                                            <textarea
                                                value={rejectComment}
                                                onChange={(e) =>
                                                    setRejectComment(
                                                        e.target.value
                                                    )
                                                }
                                                rows="3"
                                                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-red-500"
                                                placeholder="Enter a reason for rejection..."
                                            />
                                        </div>
                                    )}

                                    {/* ACTIONS */}
                                    <div className="mt-6 flex justify-end gap-3">
                                        {rejectingId === request.id ? (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        setRejectingId(null);
                                                        setRejectComment("");
                                                    }}
                                                    className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                                                >
                                                    Cancel
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleReject(
                                                            request.id
                                                        )
                                                    }
                                                    disabled={
                                                        processingId ===
                                                        request.id
                                                    }
                                                    className="flex items-center gap-2 px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                                                >
                                                    <XCircle size={18} />
                                                    Confirm Rejection
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() =>
                                                        setRejectingId(
                                                            request.id
                                                        )
                                                    }
                                                    disabled={
                                                        processingId ===
                                                        request.id
                                                    }
                                                    className="flex items-center gap-2 px-5 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50"
                                                >
                                                    <XCircle size={18} />
                                                    Reject
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleApprove(
                                                            request.id
                                                        )
                                                    }
                                                    disabled={
                                                        processingId ===
                                                        request.id
                                                    }
                                                    className="flex items-center gap-2 px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                                                >
                                                    <CheckCircle size={18} />
                                                    {processingId ===
                                                    request.id
                                                        ? "Processing..."
                                                        : "Approve"}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default HrDashboard;