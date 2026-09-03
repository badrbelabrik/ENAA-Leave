import { useEffect, useState } from 'react';
import { getLeaveRequests } from '../services/leaveService';

function Dashboard({ user }) {
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaves = async () => {
            try {
                const data = await getLeaveRequests();

                console.log('Leave requests:', data);

                setLeaveRequests(
                    data.leave_requests ?? data
                );
            } catch (error) {
                console.error(
                    'Error loading leave requests:',
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchLeaves();
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-emerald-50 text-emerald-700 border-emerald-100';

            case 'rejected':
                return 'bg-red-50 text-red-700 border-red-100';

            case 'pending_manager':
            case 'pending_hr':
                return 'bg-amber-50 text-amber-700 border-amber-100';

            case 'cancelled':
                return 'bg-slate-100 text-slate-600 border-slate-200';

            default:
                return 'bg-blue-50 text-blue-700 border-blue-100';
        }
    };

    const formatStatus = (status) => {
        return status
            ?.replaceAll('_', ' ')
            .replace(/\b\w/g, (letter) =>
                letter.toUpperCase()
            );
    };

    const totalDays = leaveRequests.reduce(
        (total, leave) =>
            total + Number(leave.total_days || 0),
        0
    );

    const approvedDays = leaveRequests
        .filter((leave) => leave.status === 'approved')
        .reduce(
            (total, leave) =>
                total + Number(leave.total_days || 0),
            0
        );

    const pendingRequests = leaveRequests.filter(
        (leave) =>
            leave.status === 'pending_manager' ||
            leave.status === 'pending_hr'
    ).length;

    return (
        <div className="min-h-screen bg-slate-50">

            {/* Navbar */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-20">

                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                            E
                        </div>

                        <div>
                            <h1 className="font-bold text-slate-900">
                                ENAA Leave
                            </h1>

                            <p className="text-xs text-slate-500">
                                Leave Management
                            </p>
                        </div>
                    </div>

                    {/* User */}
                    <div className="flex items-center gap-3">

                        <div className="hidden sm:block text-right">
                            <p className="text-sm font-semibold text-slate-900">
                                {user?.name}
                            </p>

                            <p className="text-xs text-slate-500">
                                {user?.position}
                            </p>
                        </div>

                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                            {user?.name?.charAt(0)}
                        </div>

                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="max-w-7xl mx-auto px-6 py-8">

                {/* Welcome */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

                    <div>
                        <p className="text-sm text-indigo-600 font-medium mb-1">
                            Employee Dashboard
                        </p>

                        <h2 className="text-3xl font-bold text-slate-900">
                            Welcome back, {user?.name?.split(' ')[0]} 👋
                        </h2>

                        <p className="text-slate-500 mt-2">
                            Here's an overview of your leave activity.
                        </p>
                    </div>

                    <button
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition shadow-lg shadow-indigo-600/20"
                    >
                        <span className="text-xl">+</span>
                        Request Leave
                    </button>

                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">

                    {/* Total */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

                        <div className="flex items-center justify-between mb-5">

                            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl">
                                📅
                            </div>

                        </div>

                        <p className="text-sm text-slate-500">
                            Total Leave Days
                        </p>

                        <p className="text-3xl font-bold text-slate-900 mt-1">
                            {totalDays.toFixed(2)}
                        </p>

                    </div>

                    {/* Approved */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

                        <div className="flex items-center justify-between mb-5">

                            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
                                ✓
                            </div>

                        </div>

                        <p className="text-sm text-slate-500">
                            Approved Days
                        </p>

                        <p className="text-3xl font-bold text-slate-900 mt-1">
                            {approvedDays.toFixed(2)}
                        </p>

                    </div>

                    {/* Pending */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

                        <div className="flex items-center justify-between mb-5">

                            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
                                ⏳
                            </div>

                        </div>

                        <p className="text-sm text-slate-500">
                            Pending Requests
                        </p>

                        <p className="text-3xl font-bold text-slate-900 mt-1">
                            {pendingRequests}
                        </p>

                    </div>

                </div>

                {/* Leave requests */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

                    <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">

                        <div>
                            <h3 className="text-lg font-bold text-slate-900">
                                My Leave Requests
                            </h3>

                            <p className="text-sm text-slate-500 mt-1">
                                Track the status of your requests.
                            </p>
                        </div>

                        <span className="text-sm text-slate-500">
                            {leaveRequests.length} request
                            {leaveRequests.length !== 1 ? 's' : ''}
                        </span>

                    </div>

                    {loading ? (

                        <div className="p-10 text-center text-slate-500">
                            Loading your requests...
                        </div>

                    ) : leaveRequests.length === 0 ? (

                        <div className="p-12 text-center">

                            <div className="text-4xl mb-3">
                                📋
                            </div>

                            <h4 className="font-semibold text-slate-900">
                                No leave requests yet
                            </h4>

                            <p className="text-sm text-slate-500 mt-1">
                                Your leave requests will appear here.
                            </p>

                        </div>

                    ) : (

                        <div className="divide-y divide-slate-100">

                            {leaveRequests.map((leave) => (

                                <div
                                    key={leave.id}
                                    className="px-6 py-5 hover:bg-slate-50 transition"
                                >

                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                                        <div className="flex items-start gap-4">

                                            <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center">
                                                📅
                                            </div>

                                            <div>

                                                <h4 className="font-semibold text-slate-900">
                                                    {leave.leave_type?.name ||
                                                        'Leave Request'}
                                                </h4>

                                                <p className="text-sm text-slate-500 mt-1">
                                                    {leave.start_date}
                                                    {' → '}
                                                    {leave.end_date}
                                                </p>

                                                <p className="text-sm text-slate-500">
                                                    {leave.total_days} day
                                                    {Number(leave.total_days) !== 1
                                                        ? 's'
                                                        : ''}
                                                </p>

                                            </div>

                                        </div>

                                        <span
                                            className={`inline-flex items-center w-fit px-3 py-1.5 rounded-full border text-xs font-semibold ${getStatusStyle(
                                                leave.status
                                            )}`}
                                        >
                                            {formatStatus(leave.status)}
                                        </span>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </main>
        </div>
    );
}

export default Dashboard;