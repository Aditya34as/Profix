import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
  const [shop, setShop] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('profix_token'));
  const [loading, setLoading] = useState(true);

  // On mount, verify token and load shop data
  useEffect(() => {
    if (token) {
      fetchMe();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchMe = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setShop(data.shop);
      } else {
        logout();
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('profix_token', data.token);
      setToken(data.token);
      setShop(data.shop);
    }
    return data;
  };

  const register = async (formData) => {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('profix_token', data.token);
      setToken(data.token);
      setShop(data.shop);
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('profix_token');
    setToken(null);
    setShop(null);
  };

  const updateShop = (updatedShop) => {
    setShop(updatedShop);
  };

  return (
    <AuthContext.Provider value={{
      shop, token, loading, login, register, logout, updateShop, fetchMe,
      isAuthenticated: !!token,
      API_URL
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;
