import { useState } from "react";
import { AuthContext } from "./auth-context";
import { register, login as loginApi } from "@/app/shared/services/auth-service";
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

export function AuthProvider({ children }) {
  const currentUser = getCurrentEmail();
  const [user, setUser] = useState(currentUser ? { email: currentUser } : null);
  const [admin, setAdmin] = useState(currentUser === ADMIN_EMAIL);

  async function signUp(email, password) {
    try {
      const data = await register(email, password);
      localStorage.setItem("currentUserEmail", email);
      localStorage.setItem("token", data.token);
      setUser({ email });
      isAdmin(getCurrentEmail());
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }


  async function login(email, password) {
    try {
      const data = await loginApi(email, password);
      localStorage.setItem("currentUserEmail", email);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      setUser({ email });
      isAdmin(getCurrentEmail());
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  function logout() {
    localStorage.removeItem("currentUserEmail");
    setUser(null);
    setAdmin(false);
  }

  function isAdmin(current) {
    const userIsAdmin = current && current === ADMIN_EMAIL;
    setAdmin(userIsAdmin);
  }

  function getCurrentEmail() {
    return localStorage.getItem("currentUserEmail");
  }

  function hasCurrentEmail() {
    return !!getCurrentEmail();
  }

  return (
    <AuthContext.Provider
      value={{
        admin,
        user,
        signUp,
        logout,
        login,
        hasCurrentEmail,
        getCurrentEmail
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

