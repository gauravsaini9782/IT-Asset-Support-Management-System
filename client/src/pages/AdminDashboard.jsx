import { useEffect, useState } from "react";
import TicketPriority from "../components/TicketPriority";
import TicketAssignment from "../components/TicketAssignment";
import TicketStatus from "../components/TicketStatus";
import EmployeeEditForm from "../components/EmployeeEditForm";

function AdminDashboard({ onLogout }) {
  // Employee states
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Administrator states
  const [admins, setAdmins] = useState([]);

  // Asset states
  const [assets, setAssets] = useState([]);
  const [assetsLoading, setAssetsLoading] = useState(true);
  const [assetsError, setAssetsError] = useState("");

  // Ticket states
  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [ticketsError, setTicketsError] = useState("");

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch employees");
        }

        const data = await response.json();
        setEmployees(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Fetch active administrators
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/users/admins", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch administrators");
        }

        const data = await response.json();
        setAdmins(data);
      } catch (err) {
        console.error("Administrator fetch error:", err.message);
      }
    };

    fetchAdmins();
  }, []);

  // Fetch all IT assets
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/assets", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch IT assets");
        }

        const data = await response.json();
        setAssets(data);
      } catch (err) {
        setAssetsError(err.message);
      } finally {
        setAssetsLoading(false);
      }
    };

    fetchAssets();
  }, []);

  // Fetch all support tickets
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/tickets", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch support tickets");
        }

        const data = await response.json();
        setTickets(data);
      } catch (err) {
        setTicketsError(err.message);
      } finally {
        setTicketsLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // Update ticket priority in React state
  const handlePriorityUpdated = (ticketId, newPriority) => {
    setTickets((previousTickets) =>
      previousTickets.map((ticket) =>
        ticket._id === ticketId ? { ...ticket, priority: newPriority } : ticket,
      ),
    );
  };

  // Update ticket status in React state
  const handleStatusUpdated = (ticketId, newStatus) => {
    setTickets((previousTickets) =>
      previousTickets.map((ticket) =>
        ticket._id === ticketId ? { ...ticket, status: newStatus } : ticket,
      ),
    );
  };

  // Update assigned administrator in React state
  const handleAssignmentUpdated = (ticketId, selectedAdmin) => {
    setTickets((previousTickets) =>
      previousTickets.map((ticket) =>
        ticket._id === ticketId
          ? { ...ticket, assignedTo: selectedAdmin }
          : ticket,
      ),
    );
  };

  const handleEmployeeUpdated = (updatedEmployee) => {
    setEmployees((previousEmployees) =>
      previousEmployees.map((employee) =>
        employee._id === updatedEmployee._id ? updatedEmployee : employee,
      ),
    );
  };

  return (
    <main>
      <h1>IT Administrator Dashboard</h1>

      <p>Welcome to the IT Asset & Support Management System.</p>

      {/* Employee Management Section */}
      <section>
        <h2>Employee Management</h2>

        {loading ? (
          <p>Loading employees...</p>
        ) : error ? (
          <p>{error}</p>
        ) : employees.length === 0 ? (
          <p>No employees found.</p>
        ) : (
          <ul>
            {employees.map((employee) => (
              <li key={employee._id}>
                <strong>{employee.name}</strong>
                <p>Email: {employee.email}</p>
                <p>Role: {employee.role}</p>
                <EmployeeEditForm
                  employee={employee}
                  onEmployeeUpdated={handleEmployeeUpdated}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* IT Asset Management Section */}
      <section>
        <h2>IT Asset Management</h2>

        {assetsLoading ? (
          <p>Loading assets...</p>
        ) : assetsError ? (
          <p>{assetsError}</p>
        ) : assets.length === 0 ? (
          <p>No IT assets found.</p>
        ) : (
          <ul>
            {assets.map((asset) => (
              <li key={asset._id}>
                <strong>{asset.assetName}</strong>
                <p>Asset Tag: {asset.assetTag}</p>
                <p>Category: {asset.category}</p>
                <p>Brand: {asset.brand}</p>
                <p>Model: {asset.model}</p>
                <p>Status: {asset.status}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Support Ticket Management Section */}
      <section>
        <h2>Support Ticket Management</h2>

        {ticketsLoading ? (
          <p>Loading tickets...</p>
        ) : ticketsError ? (
          <p>{ticketsError}</p>
        ) : tickets.length === 0 ? (
          <p>No support tickets found.</p>
        ) : (
          <ul>
            {tickets.map((ticket) => (
              <li key={ticket._id}>
                <h3>{ticket.title}</h3>
                <p>Description: {ticket.description}</p>
                <p>Employee: {ticket.createdBy?.name || "Unknown"}</p>
                <p>Asset: {ticket.relatedAsset?.assetName || "Unknown"}</p>
                <p>Category: {ticket.category}</p>

                <TicketPriority
                  ticket={ticket}
                  onPriorityUpdated={handlePriorityUpdated}
                />

                <TicketStatus
                  ticket={ticket}
                  onStatusUpdated={handleStatusUpdated}
                />

                <TicketAssignment
                  ticket={ticket}
                  admins={admins}
                  onAssignmentUpdated={handleAssignmentUpdated}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <button type="button" onClick={onLogout}>
        Logout
      </button>
    </main>
  );
}

export default AdminDashboard;
