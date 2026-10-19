import { useState } from "react";

function TicketAssignment({ ticket, admins, onAssignmentUpdated }) {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const handleAssignmentChange = async (event) => {
    const adminId = event.target.value;

    if (!adminId) return;

    setUpdating(true);
    setError("");

    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/tickets/${ticket._id}/assign`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ adminId }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to assign support ticket");
      }

      const selectedAdmin = admins.find((admin) => admin._id === adminId);

      onAssignmentUpdated(ticket._id, selectedAdmin);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      <label htmlFor={`assignment-${ticket._id}`}>Assigned To: </label>

      <select
        id={`assignment-${ticket._id}`}
        value={ticket.assignedTo?._id || ""}
        onChange={handleAssignmentChange}
        disabled={updating}
      >
        <option value="">Unassigned</option>

        {admins.map((admin) => (
          <option key={admin._id} value={admin._id}>
            {admin.name}
          </option>
        ))}
      </select>

      {updating && <p>Assigning ticket...</p>}
      {error && <p role="alert">{error}</p>}
    </div>
  );
}

export default TicketAssignment;
