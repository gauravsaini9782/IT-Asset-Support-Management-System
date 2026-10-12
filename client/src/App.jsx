import { useEffect, useState } from "react";
import Login from "./pages/Login";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import "./App.css";

function App() {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

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
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setUserRole(null);
  };

  if (loading) {
    return (
      <main>
        <p>Loading your session...</p>
      </main>
    );
  }

  if (userRole === "employee") {
    return <EmployeeDashboard onLogout={handleLogout} />;
  }

  if (userRole === "admin") {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return <Login onLogin={handleLogin} />;
}

export default App;
