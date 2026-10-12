import { useState } from "react";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login failed");
        return;
      }

      if (!data.token) {
        alert("Login response did not include a token");
        return;
      }

      sessionStorage.setItem("token", data.token);

      const profileResponse = await fetch(
        "http://localhost:5000/api/auth/profile",
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        },
      );

      if (!profileResponse.ok) {
        sessionStorage.removeItem("token");
        alert("Unable to retrieve user profile");
        return;
      }

      const profile = await profileResponse.json();

      if (!["employee", "admin"].includes(profile.user?.role)) {
        sessionStorage.removeItem("token");
        alert("Invalid user role");
        return;
      }

      onLogin(profile.user.role);
    } catch (error) {
      console.error("Login error:", error);
      alert("Unable to connect to the server");
    }
  };

  return (
    <main>
      <h1>Welcome Back</h1>
      <p>Sign in to your IT Asset & Support Management System</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <button type="submit">Sign In</button>
      </form>
    </main>
  );
}

export default Login;
