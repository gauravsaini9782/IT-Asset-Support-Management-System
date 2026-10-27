import { useState } from "react";

function TicketStatus({ ticket, onStatusUpdated }) {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const statusStyles = {
    open: "border-amber-200 bg-amber-50 text-amber-700",
    "in progress": "border-blue-200 bg-blue-50 text-blue-700",
    resolved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  };

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;

    if (newStatus === ticket.status) return;

    setUpdating(true);
    setError("");

    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tickets/${ticket._id}/status`,
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
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <label
            htmlFor={`status-${ticket._id}`}
            className="block text-sm font-semibold text-slate-800"
          >
            Ticket Status
          </label>

          <p className="mt-1 text-xs text-slate-500">
            Track the progress of this support request.
          </p>
        </div>

        <div className="w-full sm:w-44">
          <select
            id={`status-${ticket._id}`}
            value={ticket.status}
            onChange={handleStatusChange}
            disabled={updating}
            className={`w-full cursor-pointer rounded-xl border px-4 py-2.5 text-sm font-semibold outline-none transition focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 ${
              statusStyles[ticket.status] ||
              "border-slate-200 bg-slate-50 text-slate-700"
            }`}
          >
            <option value="open">Open</option>
            <option value="in progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {updating && (
        <p role="status" className="mt-3 text-xs font-medium text-indigo-600">
          Updating ticket status...
        </p>
      )}

      {error && (
        <p
          role="alert"
          className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default TicketStatus;
