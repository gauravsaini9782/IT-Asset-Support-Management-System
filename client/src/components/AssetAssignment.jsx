import { useState } from "react";

function AssetAssignment({ asset, employees, onAssetUpdated }) {
  const [employeeId, setEmployeeId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const activeEmployees = employees.filter(
    (employee) => employee.accountStatus === "active",
  );

  const handleAssign = async (event) => {
    event.preventDefault();
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
      setMessage("Asset assigned successfully");
      setEmployeeId("");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (asset.status !== "available") {
    return null;
  }

  return (
    <form onSubmit={handleAssign}>
      <h4>Assign Asset</h4>

      <label htmlFor={`employee-${asset._id}`}>Select Employee</label>

      <select
        id={`employee-${asset._id}`}
        value={employeeId}
        onChange={(event) => setEmployeeId(event.target.value)}
        required
      >
        <option value="">Select an employee</option>

        {activeEmployees.map((employee) => (
          <option key={employee._id} value={employee._id}>
            {employee.name}
          </option>
        ))}
      </select>

      <button type="submit" disabled={loading || !employeeId}>
        {loading ? "Assigning..." : "Assign Asset"}
      </button>

      {message && <p role="status">{message}</p>}
    </form>
  );
}

export default AssetAssignment;
