import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("nexachain_token"));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("nexachain_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback((newToken, newUser) => {
    localStorage.setItem("nexachain_token", newToken);
    localStorage.setItem("nexachain_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("nexachain_token");
    localStorage.removeItem("nexachain_user");
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: Boolean(token) }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
