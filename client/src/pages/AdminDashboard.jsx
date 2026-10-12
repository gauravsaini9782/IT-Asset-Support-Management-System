function AdminDashboard({ onLogout }) {
  return (
    <main>
      <h1>IT Administrator Dashboard</h1>

      <p>Welcome to the IT Asset & Support Management System.</p>

      <section>
        <h2>Administration Overview</h2>
        <p>
          Manage employees, IT assets, and support tickets from one central
          dashboard.
        </p>
      </section>

      <button type="button" onClick={onLogout}>
        Logout
      </button>
    </main>
  );
}

export default AdminDashboard;
