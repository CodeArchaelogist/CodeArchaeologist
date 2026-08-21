import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    signup as signupRequest,
    login as loginRequest,
    logout as logoutRequest,
    getMe,
} from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUser() {
            try {
                const data = await getMe();

                setUser(data?.user || null);
            } catch (error) {
                // 401 simply means there is no active session.
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        loadUser();
    }, []);

    async function signup(data) {
        const response =
            await signupRequest(data);

        setUser(response?.user || null);

        return response;
    }

    async function login(data) {
        const response =
            await loginRequest(data);

        setUser(response?.user || null);

        return response;
    }

    async function logout() {
        await logoutRequest();

        setUser(null);
    }

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        signup,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}