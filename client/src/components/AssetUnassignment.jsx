import { useState } from "react";

function AssetUnassignment({ asset, onAssetUpdated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUnassign = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to unassign "${asset.assetName}"?\n\nThis asset will become available for assignment to another employee.`,
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

  // Show only for assigned assets
  if (asset.status !== "assigned") {
    return null;
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleUnassign}
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
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
          <path d="M9 9l6 6M15 9l-6 6" />
        </svg>

        {loading ? "Unassigning..." : "Unassign Asset"}
      </button>

      {error && (
        <div
          role="alert"
          className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}
    </div>
  );
}

export default AssetUnassignment;
