import { createContext, useEffect, useState } from "react";
import { apiFetch } from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchUser() {
    try {
      const data = await apiFetch("/me");
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  async function login(username, password) {
    await apiFetch("/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    await fetchUser();
  }

  async function logout() {
    await apiFetch("/logout", { method: "POST" });
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
