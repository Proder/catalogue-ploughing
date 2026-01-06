import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface AuthState {
    isAuthenticated: boolean;
    email: string | null;
    sessionToken: string | null;
    isLoading: boolean;
}

interface AuthContextType extends AuthState {
    setAuthenticated: (email: string, token: string) => void;
    logout: () => void;
    checkSession: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const SESSION_KEY = 'catalogue_session';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        email: null,
        sessionToken: null,
        isLoading: true,
    });

    // Check for existing session on mount
    useEffect(() => {
        const storedSession = sessionStorage.getItem(SESSION_KEY);

        if (storedSession) {
            try {
                const { email, token, expires } = JSON.parse(storedSession);

                // Check if session is still valid
                if (Date.now() < expires) {
                    setAuthState({
                        isAuthenticated: true,
                        email,
                        sessionToken: token,
                        isLoading: false,
                    });
                    return;
                }
            } catch {
                // Invalid session data
                sessionStorage.removeItem(SESSION_KEY);
            }
        }

        // Check for edit token in URL - skip auth if present
        const urlParams = new URLSearchParams(window.location.search);
        const editToken = urlParams.get('edit');

        if (editToken) {
            // Edit mode - authenticate via edit token
            setAuthState({
                isAuthenticated: true,
                email: null, // Will be populated from order
                sessionToken: null,
                isLoading: false,
            });
            return;
        }

        setAuthState(prev => ({ ...prev, isLoading: false }));
    }, []);

    const setAuthenticated = (email: string, token: string) => {
        const expires = Date.now() + (24 * 60 * 60 * 1000); // 24 hours

        sessionStorage.setItem(SESSION_KEY, JSON.stringify({
            email,
            token,
            expires,
        }));

        setAuthState({
            isAuthenticated: true,
            email,
            sessionToken: token,
            isLoading: false,
        });
    };

    const logout = () => {
        sessionStorage.removeItem(SESSION_KEY);
        setAuthState({
            isAuthenticated: false,
            email: null,
            sessionToken: null,
            isLoading: false,
        });
    };

    const checkSession = (): boolean => {
        const storedSession = sessionStorage.getItem(SESSION_KEY);
        if (!storedSession) return false;

        try {
            const { expires } = JSON.parse(storedSession);
            return Date.now() < expires;
        } catch {
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{
            ...authState,
            setAuthenticated,
            logout,
            checkSession,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
