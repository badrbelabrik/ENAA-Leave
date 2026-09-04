import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const user = await login(email, password);

            console.log("Authenticated user:", user);

            const role = user?.roles?.[0];

            switch (role) {
                case "employee":
                    navigate("/employee-dashboard", { replace: true });
                    break;

                case "manager":
                    navigate("/manager-dashboard", { replace: true });
                    break;

                case "hr":
                    navigate("/hr-dashboard", { replace: true });
                    break;

                case "admin":
                    navigate("/admin-dashboard", { replace: true });
                    break;

                default:
                    setError("Votre rôle utilisateur n'est pas reconnu.");
            }
        } catch (error) {
            console.error("Login error:", error);

            if (error.response?.status === 422) {
                setError("Email ou mot de passe incorrect.");
            } else {
                setError(
                    error.response?.data?.message ||
                    "Une erreur est survenue. Veuillez réessayer."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

            <div className="w-full max-w-md">

                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                        E
                    </div>

                    <h1 className="text-3xl font-bold text-slate-900">
                        ENAA Leave
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Leave Management System
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">

                    <div className="mb-7">
                        <h2 className="text-2xl font-bold text-slate-900">
                            Welcome back
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            Sign in to access your account
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-semibold text-slate-700 mb-2"
                            >
                                Email address
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="employee@enaa.local"
                                required
                                autoComplete="email"
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-semibold text-slate-700 mb-2"
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                autoComplete="current-password"
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </button>

                    </form>

                </div>

                <p className="text-center text-xs text-slate-400 mt-6">
                    ENAA Leave Management System
                </p>

            </div>
        </div>
    );
};

export default Login;