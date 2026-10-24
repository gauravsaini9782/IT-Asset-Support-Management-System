import { useState } from "react";

function AssetAssignment({ asset, employees, onAssetUpdated }) {
  const [employeeId, setEmployeeId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const activeEmployees = employees.filter(
    (employee) => employee.accountStatus === "active",
  );

  const handleCancel = () => {
    setIsOpen(false);
    setEmployeeId("");
    setMessage("");
  };

  const handleAssign = async (event) => {
    event.preventDefault();

    if (!employeeId) return;

    setMessage("");
    setLoading(true);

    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/assets/${asset._id}/assign`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ employeeId }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to assign asset");
      }

      onAssetUpdated(data.asset);
      setEmployeeId("");
      setMessage("");
      setIsOpen(false);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Only available assets can be assigned
  if (asset.status !== "available") {
    return null;
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => {
          if (isOpen) {
            handleCancel();
          } else {
            setIsOpen(true);
            setMessage("");
          }
        }}
        aria-expanded={isOpen}
        aria-controls={`assign-panel-${asset._id}`}
        className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3.5 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M12 8v8M8 12h8" />
        </svg>

        {isOpen ? "Close Assignment" : "Assign Asset"}
      </button>

      {isOpen && (
        <form
          id={`assign-panel-${asset._id}`}
          onSubmit={handleAssign}
          className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5"
        >
          <div className="mb-5 border-b border-slate-200 pb-4">
            <h4 className="text-base font-semibold text-slate-900">
              Assign Asset to Employee
            </h4>

            <p className="mt-1 text-sm text-slate-500">
              Select an active employee to assign{" "}
              <span className="font-medium text-slate-700">
                {asset.assetName}
              </span>
              .
            </p>
          </div>

          <div>
            <label
              htmlFor={`employee-${asset._id}`}
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Select Employee <span className="text-red-500">*</span>
            </label>

            <select
              id={`employee-${asset._id}`}
              value={employeeId}
              onChange={(event) => setEmployeeId(event.target.value)}
              disabled={loading || activeEmployees.length === 0}
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              <option value="">Choose an employee</option>

              {activeEmployees.map((employee) => (
                <option key={employee._id} value={employee._id}>
                  {employee.name} ({employee.email})
                </option>
              ))}
            </select>

            {activeEmployees.length === 0 && (
              <p className="mt-2 text-sm text-amber-700">
                No active employees are available for assignment.
              </p>
            )}
          </div>

          {message && (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {message}
            </p>
          )}

          <div className="mt-5 flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-5">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || !employeeId}
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Assigning..." : "Confirm Assignment"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default AssetAssignment;
