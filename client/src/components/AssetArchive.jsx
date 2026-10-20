import { useState } from "react";

function AssetArchive({ asset, onAssetUpdated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleArchive = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to archive ${asset.assetName}?`,
    );

    if (!confirmed) return;

    setLoading(true);
    setError("");

    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/assets/${asset._id}/archive`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to archive asset");
      }

      onAssetUpdated(data.asset);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (asset.status === "archived") {
    return null;
  }

  return (
    <div>
      <button type="button" onClick={handleArchive} disabled={loading}>
        {loading ? "Archiving..." : "Archive Asset"}
      </button>

      {error && <p role="alert">{error}</p>}
    </div>
  );
}

export default AssetArchive;
