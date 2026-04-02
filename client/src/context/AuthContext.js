import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api/auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('fetchUser response:', res.status);
      const data = await res.json();
      console.log('fetchUser data:', data);
      if (res.ok) {
        setUser(data.user);
      } else {
        console.log('fetchUser failed, logging out');
        logout();
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message);
    }
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (username, email, password) => {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message);
    }
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/signout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const deleteAccount = async (confirmPassword) => {
    const res = await fetch(`${API_URL}/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ confirmPassword })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message);
    }
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    return data;
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout, deleteAccount }}
    >
      {children}
    </AuthContext.Provider>
  );
};