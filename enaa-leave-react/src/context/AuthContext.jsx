import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    loginRequest,
    getCurrentUser,
    logoutRequest,
} from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    /**
     * Check if the user already has a valid token
     * when the application starts.
     */
    useEffect(() => {
        const checkAuthentication = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const currentUser = await getCurrentUser();

                setUser(currentUser);
            } catch (error) {
                console.error(
                    "Authentication check failed:",
                    error
                );

                // Token is invalid or expired
                localStorage.removeItem("token");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuthentication();
    }, []);

    /**
     * Login user
     */
    const login = async (email, password) => {
        const data = await loginRequest(email, password);

        // Store Sanctum token
        localStorage.setItem("token", data.token);

        // Store authenticated user
        setUser(data.user);

        return data.user;
    };

    /**
     * Logout user
     */
    const logout = async () => {
        try {
            // Tell Laravel to invalidate the current token
            await logoutRequest();
        } catch (error) {
            console.error(
                "Logout request failed:",
                error
            );
        } finally {
            // Always remove the local token
            localStorage.removeItem("token");

            // Remove user from React state
            setUser(null);
        }
    };

    const value = {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Custom hook
 */
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside an AuthProvider"
        );
    }

    return context;
};

export default AuthContext;