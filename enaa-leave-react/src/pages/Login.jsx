import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setLoading(true);

        try {
            await login(form.email, form.password);

            navigate('/dashboard');
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                'Invalid email or password.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">

            {/* Left side */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-500 text-white relative overflow-hidden">

                {/* Decorative circles */}
                <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/10" />
                <div className="absolute bottom-[-100px] right-[-80px] w-96 h-96 rounded-full bg-white/10" />

                <div className="relative z-10 flex flex-col justify-between p-12 w-full">

                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-white text-indigo-600 flex items-center justify-center font-bold text-xl shadow-lg">
                            E
                        </div>

                        <div>
                            <h1 className="text-xl font-bold">
                                ENAA Leave
                            </h1>
                            <p className="text-sm text-indigo-100">
                                Leave Management System
                            </p>
                        </div>
                    </div>

                    {/* Main message */}
                    <div className="max-w-lg">
                        <h2 className="text-5xl font-bold leading-tight mb-6">
                            Manage your leave
                            <br />
                            <span className="text-indigo-200">
                                with simplicity.
                            </span>
                        </h2>

                        <p className="text-lg text-indigo-100 leading-relaxed">
                            Request, track and manage your leave
                            requests from one simple platform.
                        </p>

                        <div className="mt-8 flex gap-3 flex-wrap">
                            <span className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm">
                                ✓ Easy requests
                            </span>

                            <span className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm">
                                ✓ Approval workflow
                            </span>

                            <span className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm">
                                ✓ Leave tracking
                            </span>
                        </div>
                    </div>

                    {/* Footer */}
                    <p className="text-sm text-indigo-200">
                        © {new Date().getFullYear()} ENAA — Leave Management
                    </p>
                </div>
            </div>

            {/* Right side */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6">

                <div className="w-full max-w-md">

                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-10">
                        <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl">
                            E
                        </div>

                        <div>
                            <h1 className="text-xl font-bold text-slate-900">
                                ENAA Leave
                            </h1>
                            <p className="text-sm text-slate-500">
                                Leave Management System
                            </p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-slate-900">
                            Welcome back 👋
                        </h2>

                        <p className="text-slate-500 mt-2">
                            Sign in to manage your leave requests.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email address
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                required
                                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="block text-sm font-medium text-slate-700">
                                    Password
                                </label>

                                <button
                                    type="button"
                                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold transition shadow-lg shadow-indigo-600/20"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>

                    </form>

                    <p className="text-center text-sm text-slate-500 mt-8">
                        ENAA Leave Management System
                    </p>

                </div>
            </div>
        </div>
    );
}

export default Login;