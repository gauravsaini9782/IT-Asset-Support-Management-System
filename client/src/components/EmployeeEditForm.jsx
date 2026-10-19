
import { useState } from "react";

function EmployeeEditForm({ employee, onEmployeeUpdated }) {
  const [name, setName] = useState(employee.name);
  const [department, setDepartment] = useState(
    employee.department || ""
  );
  const [accountStatus, setAccountStatus] = useState(
    employee.accountStatus || "active"
  );
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
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
            name,
            department,
            accountStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update employee");
      }

      onEmployeeUpdated(data.employee);
      setMessage("Employee updated successfully");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </label>
      </div>

      <div>
        <label>
          Department:
          <input
            type="text"
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          Account Status:
          <select
            value={accountStatus}
            onChange={(event) =>
              setAccountStatus(event.target.value)
            }
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Update Employee"}
      </button>

      {message && <p role="status">{message}</p>}
    </form>
  );
}

export default EmployeeEditForm;
