import { useState } from "react";

function TicketPriority({ ticket, onPriorityUpdated }) {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const priorityStyles = {
    low: "bg-emerald-50 text-emerald-700 border-emerald-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    high: "bg-rose-50 text-rose-700 border-rose-200",
  };

  const handlePriorityChange = async (event) => {
    const newPriority = event.target.value;

    if (newPriority === ticket.priority) return;

    setUpdating(true);
    setError("");

    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tickets/${ticket._id}/priority`,
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
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <label
            htmlFor={`priority-${ticket._id}`}
            className="block text-sm font-semibold text-slate-800"
          >
            Ticket Priority
          </label>

          <p className="mt-1 text-xs text-slate-500">
            Set the urgency level of this support request.
          </p>
        </div>

        <div className="relative w-full sm:w-44">
          <select
            id={`priority-${ticket._id}`}
            value={ticket.priority}
            onChange={handlePriorityChange}
            disabled={updating}
            className={`w-full cursor-pointer rounded-xl border px-4 py-2.5 text-sm font-semibold capitalize outline-none transition focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 ${
              priorityStyles[ticket.priority] ||
              "border-slate-200 bg-slate-50 text-slate-700"
            }`}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>
      </div>

      {updating && (
        <p role="status" className="mt-3 text-xs font-medium text-indigo-600">
          Updating ticket priority...
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

export default TicketPriority;
