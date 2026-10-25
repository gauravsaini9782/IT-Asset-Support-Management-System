import { useEffect, useState } from "react";

function EmployeeEditForm({ employee, onEmployeeUpdated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(employee.name || "");
  const [department, setDepartment] = useState(employee.department || "");
  const [accountStatus, setAccountStatus] = useState(
    employee.accountStatus || "active",
  );
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Keep form values synchronized with updated employee data.
  useEffect(() => {
    setName(employee.name || "");
    setDepartment(employee.department || "");
    setAccountStatus(employee.accountStatus || "active");
  }, [
    employee._id,
    employee.name,
    employee.department,
    employee.accountStatus,
  ]);

  const handleCancel = () => {
    setName(employee.name || "");
    setDepartment(employee.department || "");
    setAccountStatus(employee.accountStatus || "active");
    setError("");
    setMessage("");
    setIsEditing(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/users/${employee._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: name.trim(),
            department: department.trim(),
            accountStatus,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update employee");
      }

      onEmployeeUpdated(data.employee);
      setMessage("Employee updated successfully.");
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => {
          if (isEditing) {
            handleCancel();
          } else {
            setIsEditing(true);
            setMessage("");
            setError("");
          }
        }}
        disabled={loading}
        aria-expanded={isEditing}
        className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100 disabled:opacity-50"
      >
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L9 17l-4 1 1-4L16.5 3.5z" />
        </svg>
        {isEditing ? "Close Editor" : "Edit Employee"}
      </button>

      {message && (
        <p
          role="status"
          className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
        >
          {message}
        </p>
      )}

      {isEditing && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 space-y-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5"
        >
          <div>
            <h4 className="text-base font-bold text-slate-900">
              Edit Employee Details
            </h4>
            <p className="mt-1 text-sm text-slate-500">
              Update employee information and account access.
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor={`employee-name-${employee._id}`}
              className="block text-sm font-semibold text-slate-700"
            >
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              id={`employee-name-${employee._id}`}
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={inputClass}
              placeholder="Enter employee name"
              maxLength={100}
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor={`employee-department-${employee._id}`}
              className="block text-sm font-semibold text-slate-700"
            >
              Department
            </label>
            <input
              id={`employee-department-${employee._id}`}
              type="text"
              value={department}
              onChange={(event) => setDepartment(event.target.value)}
              className={inputClass}
              placeholder="e.g. Information Technology"
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor={`employee-status-${employee._id}`}
              className="block text-sm font-semibold text-slate-700"
            >
              Account Status
            </label>
            <select
              id={`employee-status-${employee._id}`}
              value={accountStatus}
              onChange={(event) => setAccountStatus(event.target.value)}
              className={inputClass}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <p className="text-xs leading-5 text-slate-500">
              Choose whether this employee account should be active or inactive.
            </p>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
            >
              {error}
            </p>
          )}

          <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default EmployeeEditForm;
