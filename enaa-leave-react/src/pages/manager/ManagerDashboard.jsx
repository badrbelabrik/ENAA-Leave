import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const ManagerDashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const [error, setError] = useState("");

    const loadRequests = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/leave-requests");

            console.log("Manager leave requests:", response.data);

            setRequests(response.data.leave_requests.data || []);
        } catch (err) {
            console.error("Failed to load leave requests:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load leave requests."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const handleApprove = async (id) => {
        try {
            setProcessingId(id);

            await api.post(`/leave-requests/${id}/approve`);

            await loadRequests();
        } catch (err) {
            console.error("Approval error:", err);

            alert(
                err.response?.data?.message ||
                "Unable to approve this request."
            );
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id) => {
        const comment = window.prompt(
            "Please enter a reason for rejecting this request:"
        );

        if (comment === null) {
            return;
        }

        try {
            setProcessingId(id);

            await api.post(`/leave-requests/${id}/reject`, {
                comment,
            });

            await loadRequests();
        } catch (err) {
            console.error("Rejection error:", err);

            alert(
                err.response?.data?.message ||
                "Unable to reject this request."
            );
        } finally {
            setProcessingId(null);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate("/", { replace: true });
    };

    return (
        <div className="min-h-screen bg-gray-100">

            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            ENAA Leave
                        </h1>

                        <p className="text-sm text-gray-500 mt-1">
                            Manager Dashboard
                        </p>
                    </div>

                    <div className="flex items-center gap-5">

                        <div className="text-right">
                            <p className="font-semibold text-gray-900">
                                {user?.name}
                            </p>

                            <p className="text-sm text-gray-500">
                                Manager
                            </p>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
                        >
                            Logout
                        </button>

                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="max-w-7xl mx-auto px-6 py-8">

                {/* Welcome */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Welcome, {user?.name}
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Review and manage employee leave requests.
                    </p>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <p className="text-gray-500 text-sm">
                            Pending Requests
                        </p>

                        <p className="text-3xl font-bold text-orange-500 mt-2">
                            {requests.length}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <p className="text-gray-500 text-sm">
                            Requests to Review
                        </p>

                        <p className="text-3xl font-bold text-blue-600 mt-2">
                            {requests.length}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <p className="text-gray-500 text-sm">
                            Role
                        </p>

                        <p className="text-3xl font-bold text-gray-900 mt-2">
                            Manager
                        </p>
                    </div>

                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4">
                        {error}
                    </div>
                )}

                {/* Requests */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

                    <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">

                        <div>
                            <h3 className="text-xl font-bold text-gray-900">
                                Leave Requests
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                                Requests waiting for your approval
                            </p>
                        </div>

                        <button
                            onClick={loadRequests}
                            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition"
                        >
                            Refresh
                        </button>

                    </div>

                    {loading ? (
                        <div className="p-10 text-center text-gray-500">
                            Loading leave requests...
                        </div>
                    ) : requests.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-gray-500 text-lg">
                                No pending leave requests.
                            </p>

                            <p className="text-gray-400 text-sm mt-2">
                                You're all caught up!
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Employee
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Leave Type
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Period
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Days
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Reason
                                    </th>

                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                                        Actions
                                    </th>
                                </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">

                                {requests.map((request) => (

                                    <tr
                                        key={request.id}
                                        className="hover:bg-gray-50 transition"
                                    >

                                        <td className="px-6 py-5">

                                            <p className="font-semibold text-gray-900">
                                                {request.user?.name || "Unknown"}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                {request.user?.email}
                                            </p>

                                        </td>

                                        <td className="px-6 py-5 text-gray-700">
                                            {request.leave_type?.name ||
                                                request.leaveType?.name ||
                                                "—"}
                                        </td>

                                        <td className="px-6 py-5 text-gray-700">

                                            <div>
                                                {request.start_date}
                                            </div>

                                            <div className="text-sm text-gray-400">
                                                to {request.end_date}
                                            </div>

                                        </td>

                                        <td className="px-6 py-5 font-semibold text-gray-900">
                                            {request.total_days}
                                        </td>

                                        <td className="px-6 py-5 text-gray-600 max-w-xs">
                                            {request.reason || "No reason provided"}
                                        </td>

                                        <td className="px-6 py-5">

                                            <div className="flex justify-end gap-2">

                                                <button
                                                    disabled={processingId === request.id}
                                                    onClick={() =>
                                                        handleApprove(request.id)
                                                    }
                                                    className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-50 transition"
                                                >
                                                    Approve
                                                </button>

                                                <button
                                                    disabled={processingId === request.id}
                                                    onClick={() =>
                                                        handleReject(request.id)
                                                    }
                                                    className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50 transition"
                                                >
                                                    Reject
                                                </button>

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
        </div>
    );
};

export default ManagerDashboard;