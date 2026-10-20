import { useState } from "react";

function AssetUnassignment({ asset, onAssetUpdated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUnassign = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to unassign ${asset.assetName}?`,
    );

    if (!confirmed) return;

    setLoading(true);
    setError("");

    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/assets/${asset._id}/unassign`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to unassign asset");
      }

      onAssetUpdated(data.asset);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (asset.status !== "assigned") {
    return null;
  }

  return (
    <div>
      <button type="button" onClick={handleUnassign} disabled={loading}>
        {loading ? "Unassigning..." : "Unassign Asset"}
      </button>

      {error && <p role="alert">{error}</p>}
    </div>
  );
}

export default AssetUnassignment;
