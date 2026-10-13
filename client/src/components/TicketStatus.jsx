import { useState } from "react";

function TicketStatus({ ticket, onStatusUpdated }) {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;

    setUpdating(true);
    setError("");

    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/tickets/${ticket._id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update ticket status");
      }

      onStatusUpdated(ticket._id, newStatus);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      <label htmlFor={`status-${ticket._id}`}>Status: </label>

      <select
        id={`status-${ticket._id}`}
        value={ticket.status}
        onChange={handleStatusChange}
        disabled={updating}
      >
        <option value="open">Open</option>
        <option value="in progress">In Progress</option>
        <option value="resolved">Resolved</option>
      </select>

      {updating && <p>Updating status...</p>}
      {error && <p role="alert">{error}</p>}
    </div>
  );
}

export default TicketStatus;
