import { useState } from "react";

function TicketAssignment({ ticket, admins, onAssignmentUpdated }) {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const assignedAdminId =
    typeof ticket.assignedTo === "string"
      ? ticket.assignedTo
      : ticket.assignedTo?._id || "";

  // Assign, reassign, or unassign a ticket
  const updateAssignment = async (adminId) => {
    setUpdating(true);
    setError("");

    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tickets/${ticket._id}/assign`,
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
        throw new Error(data.message || "Failed to update ticket assignment");
      }

      const selectedAdmin = adminId
        ? admins.find((admin) => admin._id === adminId)
        : null;

      onAssignmentUpdated(ticket._id, selectedAdmin);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleAssignmentChange = (event) => {
    const adminId = event.target.value;

    if (!adminId || adminId === assignedAdminId) return;

    updateAssignment(adminId);
  };

  const handleUnassign = () => {
    if (!assignedAdminId) return;

    updateAssignment(null);
  };

  const assignedAdminName =
    (typeof ticket.assignedTo === "object" ? ticket.assignedTo?.name : null) ||
    admins.find((admin) => admin._id === assignedAdminId)?.name ||
    (assignedAdminId ? "Assigned administrator" : "Unassigned");

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <label
            htmlFor={`assignment-${ticket._id}`}
            className="block text-sm font-semibold text-slate-800"
          >
            Assign Support Staff
          </label>

          <p className="mt-1 text-xs text-slate-500">
            Select an administrator to handle this ticket.
          </p>
        </div>

        <div className="w-full sm:w-56">
          <select
            id={`assignment-${ticket._id}`}
            value={
              admins.some((admin) => admin._id === assignedAdminId)
                ? assignedAdminId
                : ""
            }
            onChange={handleAssignmentChange}
            disabled={updating || admins.length === 0}
            className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="" disabled>
              {assignedAdminId ? "Select administrator" : "Not assigned"}
            </option>

            {admins.map((admin) => (
              <option key={admin._id} value={admin._id}>
                {admin.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-500">
          Currently assigned:
        </span>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            assignedAdminId
              ? "bg-indigo-50 text-indigo-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {assignedAdminName}
        </span>
      </div>

      {/* Unassign button */}
      {assignedAdminId && (
        <button
          type="button"
          onClick={handleUnassign}
          disabled={updating}
          className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {updating ? "Updating..." : "Unassign Administrator"}
        </button>
      )}

      {admins.length === 0 && (
        <p className="mt-3 text-xs text-amber-700">
          No active administrators are available for assignment.
        </p>
      )}

      {updating && (
        <p role="status" className="mt-3 text-xs font-medium text-indigo-600">
          Updating ticket assignment...
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

export default TicketAssignment;
