import { useState } from "react";

function AssetRestore({ asset, onAssetUpdated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRestore = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to restore ${asset.assetName}?`,
    );

    if (!confirmed) return;

    setLoading(true);
    setError("");

    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/assets/${asset._id}/restore`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to restore asset");
      }

      onAssetUpdated(data.asset);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Only archived assets can be restored
  if (asset.status !== "archived") {
    return null;
  }

  return (
    <div>
      <button type="button" onClick={handleRestore} disabled={loading}>
        {loading ? "Restoring..." : "Restore Asset"}
      </button>

      {error && <p role="alert">{error}</p>}
    </div>
  );
}

export default AssetRestore;
