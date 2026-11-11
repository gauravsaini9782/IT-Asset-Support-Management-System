import { useEffect, useState } from "react";
import Login from "./pages/Login";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Register from "./pages/Register";
import "./App.css";

function LogoutModal({ onCancel, onConfirm }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-title"
        aria-describedby="logout-description"
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9" />
          </svg>
        </div>

        <h2 id="logout-title" className="text-xl font-bold text-slate-900">
          Log out of AssetFlow?
        </h2>

        <p
          id="logout-description"
          className="mt-2 text-sm leading-6 text-slate-500"
        >
          Are you sure you want to log out? You will need to sign in again to
          access your workspace.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            Yes, log out
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authPage, setAuthPage] = useState("login");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  useEffect(() => {
    const restoreSession = async () => {
      const token = sessionStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

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
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    sessionStorage.removeItem("token");
    setUserRole(null);
    setAuthPage("login");
    setShowLogoutModal(false);
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
    return (
      <>
        <EmployeeDashboard onLogout={handleLogout} />

        {showLogoutModal && (
          <LogoutModal
            onCancel={() => setShowLogoutModal(false)}
            onConfirm={confirmLogout}
          />
        )}
      </>
    );
  }

  if (userRole === "admin") {
    return (
      <>
        <AdminDashboard onLogout={handleLogout} />

        {showLogoutModal && (
          <LogoutModal
            onCancel={() => setShowLogoutModal(false)}
            onConfirm={confirmLogout}
          />
        )}
      </>
    );
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
