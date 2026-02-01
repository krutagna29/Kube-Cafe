import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // -------------------------
  // 🔐 ADMIN STATE
  // -------------------------
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');

  // -------------------------
  // 👤 USER STATE
  // -------------------------
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('userData');
    return stored ? JSON.parse(stored) : null;
  });
  const [userToken, setUserToken] = useState(localStorage.getItem('userToken') || '');

  // -------------------------
  // 🧠 PERSIST ADMIN TOKEN
  // -------------------------
  useEffect(() => {
    if (token) {
      localStorage.setItem('adminToken', token);
    } else {
      localStorage.removeItem('adminToken');
    }
  }, [token]);

  // -------------------------
  // 💾 PERSIST USER TOKEN & DATA
  // -------------------------
  useEffect(() => {
    if (userToken) {
      localStorage.setItem('userToken', userToken);
    } else {
      localStorage.removeItem('userToken');
    }

    if (user) {
      localStorage.setItem('userData', JSON.stringify(user));
    } else {
      localStorage.removeItem('userData');
    }
  }, [user, userToken]);

  // -------------------------
  // 🧑‍💼 ADMIN LOGIN / LOGOUT
  // -------------------------
  const login = (adminData, jwtToken) => {
    setAdmin(adminData);
    setToken(jwtToken);
  };

  const logout = () => {
    setAdmin(null);
    setToken('');
    localStorage.removeItem('adminToken');
  };

  const isAdminAuthenticated = !!token;

  // -------------------------
  // 🙋‍♂️ USER LOGIN / LOGOUT
  // -------------------------
  const loginUser = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Handle new standardized response format
        const token = data.data?.token || data.token;
        const user = data.data?.user || data.user;
        
        // ✅ Store user info and token
        if (token) setUserToken(token);
        if (user) setUser(user);

        return { success: true, user: user || {} };
      } else {
        // Handle validation errors
        const errorMessage = data.message || 
                            (data.errors && data.errors.length > 0 ? data.errors[0].msg : 'Invalid email or password');
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const registerUser = async (userData) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password
          // Note: phone and address are not sent as backend only accepts name, email, password
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // ✅ Store user info and token
        if (data.data && data.data.token) {
          // Decode token to get user info (or use the user data from response if available)
          const token = data.data.token;
          setUserToken(token);
          
          // If user data is in response, use it; otherwise we'll need to fetch it
          if (data.data.user) {
            setUser(data.data.user);
          } else {
            // Store basic user info from registration
            setUser({
              name: userData.name,
              email: userData.email,
              role: 'user'
            });
          }
        }

        return { success: true };
      } else {
        // Handle validation errors
        const errorMessage = data.message || 
                            (data.errors && data.errors.length > 0 ? data.errors[0].msg : 'Registration failed');
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logoutUser = () => {
    setUser(null);
    setUserToken('');
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
  };

  const isUserAuthenticated = !!userToken;

  // -------------------------
  // 🌍 CONTEXT VALUE
  // -------------------------
  return (
    <AuthContext.Provider
      value={{
        // Admin
        admin,
        token,
        login,
        logout,
        isAdminAuthenticated,

        // User
        user,
        userToken,
        loginUser,
        registerUser,
        logoutUser,
        isUserAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
