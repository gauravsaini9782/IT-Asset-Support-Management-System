import { useState } from "react";

function TicketPriority({ ticket, onPriorityUpdated }) {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const handlePriorityChange = async (event) => {
    const newPriority = event.target.value;

    setUpdating(true);
    setError("");

    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/tickets/${ticket._id}/priority`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            priority: newPriority,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update priority");
      }

      onPriorityUpdated(ticket._id, newPriority);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      <label htmlFor={`priority-${ticket._id}`}>Priority: </label>

      <select
        id={`priority-${ticket._id}`}
        value={ticket.priority}
        onChange={handlePriorityChange}
        disabled={updating}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      {updating && <p>Updating priority...</p>}
      {error && <p role="alert">{error}</p>}
    </div>
  );
}

export default TicketPriority;
