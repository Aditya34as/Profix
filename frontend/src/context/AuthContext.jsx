import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
  const [shop, setShop] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('profix_token'));
  const [role, setRole] = useState(localStorage.getItem('profix_role')); // 'shop' | 'customer' | null
  const [loading, setLoading] = useState(true);

  // On mount, verify token and load profile
  useEffect(() => {
    if (token && role) {
      fetchMe();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchMe = async () => {
    try {
      if (role === 'shop') {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setShop(data.shop);
        } else {
          logout();
        }
      } else if (role === 'customer') {
        const res = await fetch(`${API_URL}/api/users/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        } else {
          logout();
        }
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

  /* ——— Shop Owner Auth ——— */
  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('profix_token', data.token);
      localStorage.setItem('profix_role', 'shop');
      setToken(data.token);
      setRole('shop');
      setShop(data.shop);
      setUser(null);
    }
    return data;
  };

  const register = async (formData) => {
    const { confirmPassword: _c, ...rest } = formData;
    const payload = {
      businessName: rest.businessName?.trim(),
      ownerName: rest.ownerName?.trim(),
      email: rest.email?.trim(),
      password: rest.password,
      phone: rest.phone?.trim(),
      whatsappNumber: (rest.whatsappNumber || '').trim(),
      services: rest.services,
      address: rest.address || {},
      description: (rest.description || '').trim(),
      openingHours: rest.openingHours || 'Mon-Sat 8AM-8PM',
    };
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('profix_token', data.token);
      localStorage.setItem('profix_role', 'shop');
      setToken(data.token);
      setRole('shop');
      setShop(data.shop);
      setUser(null);
    }
    return data;
  };

  /* ——— Customer Auth ——— */
  const loginUser = async (email, password) => {
    const res = await fetch(`${API_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('profix_token', data.token);
      localStorage.setItem('profix_role', 'customer');
      setToken(data.token);
      setRole('customer');
      setUser(data.user);
      setShop(null);
    }
    return data;
  };

  const registerUser = async ({ name, email, password, phone }) => {
    const res = await fetch(`${API_URL}/api/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name?.trim(), email: email?.trim(), password, phone: (phone || '').trim() })
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('profix_token', data.token);
      localStorage.setItem('profix_role', 'customer');
      setToken(data.token);
      setRole('customer');
      setUser(data.user);
      setShop(null);
    }
    return data;
  };

  /* ——— Shared ——— */
  const logout = () => {
    localStorage.removeItem('profix_token');
    localStorage.removeItem('profix_role');
    setToken(null);
    setRole(null);
    setShop(null);
    setUser(null);
  };

  const updateShop = (updatedShop) => {
    setShop(updatedShop);
  };

  return (
    <AuthContext.Provider value={{
      shop, user, token, role, loading,
      login, register, loginUser, registerUser,
      logout, updateShop, fetchMe,
      isAuthenticated: !!token,
      isShopOwner: role === 'shop',
      isCustomer: role === 'customer',
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
