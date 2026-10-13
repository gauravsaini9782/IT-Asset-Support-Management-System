import { useEffect, useState } from "react";
import CreateTicketForm from "../components/CreateTicketForm";
import TicketComments from "../components/TicketComments";

function EmployeeDashboard({ onLogout }) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [ticketsError, setTicketsError] = useState("");

  // Fetch employee's assigned assets
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/assets/my-assets",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch assigned assets");
        }

        const data = await response.json();
        setAssets(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  // Fetch employee's support tickets
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/tickets/my-tickets",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

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

  // Add newly created ticket to the dashboard
  const handleTicketCreated = (newTicket) => {
    setTickets((previousTickets) => [
      {
        ...newTicket,
        relatedAsset:
          assets.find((asset) => asset._id === newTicket.relatedAsset) ||
          newTicket.relatedAsset,
      },
      ...previousTickets,
    ]);
  };

  return (
    <main>
      <h1>Employee Dashboard</h1>
      <p>Welcome to your IT Asset & Support Management System.</p>

      {/* Assigned Assets Section */}
      <section>
        <h2>My Assigned Assets</h2>

        {loading ? (
          <p>Loading assets...</p>
        ) : error ? (
          <p>{error}</p>
        ) : assets.length === 0 ? (
          <p>No assets assigned yet.</p>
        ) : (
          <ul>
            {assets.map((asset) => (
              <li key={asset._id}>
                <strong>{asset.assetName}</strong>
                <p>Asset Tag: {asset.assetTag}</p>
                <p>Category: {asset.category}</p>
                <p>Status: {asset.status}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Create Support Ticket Form */}
      <CreateTicketForm assets={assets} onTicketCreated={handleTicketCreated} />

      {/* Support Tickets Section */}
      <section>
        <h2>My Support Tickets</h2>

        {ticketsLoading ? (
          <p>Loading tickets...</p>
        ) : ticketsError ? (
          <p>{ticketsError}</p>
        ) : tickets.length === 0 ? (
          <p>You haven't created any support tickets yet.</p>
        ) : (
          <ul>
            {tickets.map((ticket) => (
              <li key={ticket._id}>
                <strong>{ticket.title}</strong>
                <p>Asset: {ticket.relatedAsset?.assetName || "Unknown"}</p>
                <p>Category: {ticket.category}</p>
                <p>Priority: {ticket.priority}</p>
                <p>Status: {ticket.status}</p>
                <TicketComments ticketId={ticket._id} />
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

export default EmployeeDashboard;
