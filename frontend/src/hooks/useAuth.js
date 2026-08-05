import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "skinscope_auth_user";

export function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        setUser(parsed);
      }
    } catch {
      setUser(null);
    }
  }, []);

  const logout = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const login = (nextUser) => {
    const resolvedUser = nextUser ?? {
      name: "SkinScope User",
      avatar: "",
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(resolvedUser));
    setUser(resolvedUser);
  };

  return useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user]
  );
}
