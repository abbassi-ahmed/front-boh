import React, { createContext, useState, useContext, useEffect } from "react";
import { TUser } from "../types/userTypes";
import { useAxios } from "../hooks/fetch-api.hook";

interface AuthContextType {
  user: TUser | null;
  token: string | null;
  login: (user: TUser, token: string) => void;
  logout: () => void;
  refreshUserCredentials: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<TUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  const login = (user: TUser, token: string) => {
    setUser(user);
    setToken(token);

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const { userData } = useAxios("users/", "GET", {}, "userData", false, {});
  useEffect(() => {
    if (userData.responseData) {
      setUser(userData.responseData);
      localStorage.setItem("user", JSON.stringify(userData.responseData));
    }
  }, [userData.responseData]);

  const refreshUserCredentials = () => {
    if (user?.id) userData.submitRequest({}, `users/${user?.id}`, false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        refreshUserCredentials,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
