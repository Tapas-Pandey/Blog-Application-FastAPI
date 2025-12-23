import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await api.get('/users/me');
                    setUser(response.data);
                } catch (error) {
                    console.error("Auth check failed", error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        const formData = new FormData();
        formData.append('username', email); // FastAPI OAuth2 expects 'username'
        formData.append('password', password);

        const response = await api.post('/auth/token', formData);
        const { access_token } = response.data;

        localStorage.setItem('token', access_token);
        // Get user details immediately
        const userRes = await api.get('/users/me');
        setUser(userRes.data);
        return userRes.data;
    };

    const register = async (email, password, name, phone) => {
        await api.post('/auth/register', {
            email, password, name, phone
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
