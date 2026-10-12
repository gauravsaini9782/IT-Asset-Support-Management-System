function EmployeeDashboard({ onLogout }) {
  return (
    <main>
      <h1>Employee Dashboard</h1>

      <p>Welcome to your IT Asset & Support Management System.</p>

      <section>
        <h2>My Workspace</h2>
        <p>
          Here you will be able to view your assigned IT assets and manage your
          support tickets.
        </p>
      </section>

      <button type="button" onClick={onLogout}>
        Logout
      </button>
    </main>
  );
}

export default EmployeeDashboard;
