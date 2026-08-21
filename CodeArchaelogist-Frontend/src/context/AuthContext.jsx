import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    login as loginRequest,
    signup as signupRequest,
    logout as logoutRequest,
    getMe,
} from "../services/api.js";

const AuthContext =
    createContext(null);

export function AuthProvider({
    children,
}) {
    const [user, setUser] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        async function loadUser() {
            try {
                const response =
                    await getMe();

                setUser(response.user);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        loadUser();
    }, []);

    async function login(credentials) {
        const response =
            await loginRequest(
                credentials
            );

        setUser(response.user);

        return response.user;
    }

    async function signup(data) {
        const response =
            await signupRequest(data);

        setUser(response.user);

        return response.user;
    }

    async function logout() {
        await logoutRequest();

        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated:
                    Boolean(user),
                login,
                signup,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context =
        useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}