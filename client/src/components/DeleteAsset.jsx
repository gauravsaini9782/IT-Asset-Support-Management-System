
import { useState } from "react";

function DeleteAsset({ asset, onAssetDeleted }) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/assets/${asset._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete asset");
      }

      setShowConfirmation(false);
      onAssetDeleted(data.deletedAssetId);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => {
          setShowConfirmation((previous) => !previous);
          setError("");
        }}
        disabled={loading}
        aria-expanded={showConfirmation}
        aria-controls={`delete-panel-${asset._id}`}
        className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3.5 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
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
          <path d="M3 6h18M8 6V4h8v2M5 6l1 14h12l1-14M10 10v6M14 10v6" />
        </svg>

        Delete Permanently
      </button>

      {showConfirmation && (
        <div
          id={`delete-panel-${asset._id}`}
          className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 sm:p-5"
        >
          <h4 className="text-sm font-semibold text-red-900">
            Permanently delete this asset?
          </h4>

          <p className="mt-2 text-sm leading-6 text-red-800">
            You are about to permanently delete{" "}
            <strong>{asset.assetName}</strong> ({asset.assetTag}).
            This action cannot be undone.
          </p>

          <p className="mt-2 text-xs text-red-700">
            Assets with support ticket history cannot be deleted.
            Archive those assets instead.
          </p>

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-lg border border-red-200 bg-white p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <div className="mt-5 flex flex-wrap justify-end gap-3 border-t border-red-200 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowConfirmation(false);
                setError("");
              }}
              disabled={loading}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Deleting..." : "Yes, Delete Permanently"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeleteAsset;
