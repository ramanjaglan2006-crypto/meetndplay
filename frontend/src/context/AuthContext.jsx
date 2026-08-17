import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getCurrentUser, loginUser, logoutUser, signupUser } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const queryClient = useQueryClient();

    // Initialize session
    const initSession = useCallback(async () => {
        try {
            const { data } = await getCurrentUser();
            setUser(data.user);
            setIsAuthenticated(true);
        } catch (error) {
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        initSession();

        // Listen for unauthorized events from axios interceptor
        const handleUnauthorized = () => {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('meet_token');
            localStorage.removeItem('meet_user');
            queryClient.clear();
        };

        window.addEventListener('unauthorized', handleUnauthorized);
        return () => window.removeEventListener('unauthorized', handleUnauthorized);
    }, [initSession, queryClient]);

    const login = async (email, password, lat, lon) => {
        const { data } = await loginUser(email, password, lat, lon);
        if (data.token) {
            localStorage.setItem('meet_token', data.token);
        }
        setUser(data.user);
        setIsAuthenticated(true);
        return data.user;
    };

    const signup = async (userData) => {
        const { data } = await signupUser(userData);
        if (data.token) {
            localStorage.setItem('meet_token', data.token);
        }
        setUser(data.user);
        setIsAuthenticated(true);
        return data.user;
    };

    const logout = async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.error('Logout request failed', error);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
            queryClient.clear();
            localStorage.removeItem('meet_user');
            localStorage.removeItem('meet_token');
        }
    };

    const value = {
        user,
        isAuthenticated,
        isLoading,
        login,
        signup,
        logout,
        refreshSession: initSession
    };

    if (isLoading) {
        return (
            <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="spin" style={{ width: '40px', height: '40px', border: '4px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%' }} />
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
