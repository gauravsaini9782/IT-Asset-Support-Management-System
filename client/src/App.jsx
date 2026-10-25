import { useEffect, useState } from "react";
import Login from "./pages/Login";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Register from "./pages/Register";
import "./App.css";

function App() {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authPage, setAuthPage] = useState("login");

  useEffect(() => {
    const restoreSession = async () => {
      const token = sessionStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Session is invalid");
        }

        const data = await response.json();
        const role = data.user?.role;

        if (!["employee", "admin"].includes(role)) {
          throw new Error("Invalid user role");
        }

        setUserRole(role);
      } catch (error) {
        console.error("Session restoration failed:", error.message);

        sessionStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const handleLogin = (role) => {
    setUserRole(role);
    setAuthPage("login");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setUserRole(null);
    setAuthPage("login");
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm font-medium text-slate-600">
          Loading your session...
        </p>
      </main>
    );
  }

  if (userRole === "employee") {
    return <EmployeeDashboard onLogout={handleLogout} />;
  }

  if (userRole === "admin") {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  // Employee Registration Page
  if (authPage === "register") {
    return <Register onBackToLogin={() => setAuthPage("login")} />;
  }

  return (
    <div>
      <Login onLogin={handleLogin} />

      <div className="fixed bottom-4 left-1/2 z-10 -translate-x-1/2">
        <button
          type="button"
          onClick={() => setAuthPage("register")}
          className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-indigo-600 shadow-md hover:bg-indigo-50"
        >
          New employee? Create an account
        </button>
      </div>
    </div>
  );
}

export default App;
