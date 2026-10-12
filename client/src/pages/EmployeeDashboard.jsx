import { useEffect, useState } from "react";

function EmployeeDashboard({ onLogout }) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/assets/my-assets",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch assigned assets");
        }

        const data = await response.json();
        setAssets(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  return (
    <main>
      <h1>Employee Dashboard</h1>
      <p>Welcome to your IT Asset & Support Management System.</p>

      <section>
        <h2>My Assigned Assets</h2>

        {loading ? (
          <p>Loading assets...</p>
        ) : error ? (
          <p>{error}</p>
        ) : assets.length === 0 ? (
          <p>No assets assigned yet.</p>
        ) : (
          <ul>
            {assets.map((asset) => (
              <li key={asset._id}>
                <strong>{asset.assetName}</strong>
                <p>Asset Tag: {asset.assetTag}</p>
                <p>Category: {asset.category}</p>
                <p>Status: {asset.status}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <button type="button" onClick={onLogout}>
        Logout
      </button>
    </main>
  );
}

export default EmployeeDashboard;
