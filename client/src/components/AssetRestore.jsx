import { useState } from "react";
import { API_BASE_URL } from "../config";

function AssetRestore({ asset, onAssetUpdated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleRestore = async () => {
    setLoading(true);
    setError("");

    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/assets/${asset._id}/restore`,
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
      setShowConfirmation(false);
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
    <div className="w-full">
      <button
        type="button"
        onClick={() => {
          setShowConfirmation((previous) => !previous);
          setError("");
        }}
        disabled={loading}
        aria-expanded={showConfirmation}
        aria-controls={`restore-panel-${asset._id}`}
        className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
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
          <path d="M3 12a9 9 0 1 0 3-6.7" />
          <path d="M3 3v6h6" />
          <path d="M12 7v5l3 2" />
        </svg>

        {showConfirmation ? "Close Restore" : "Restore Asset"}
      </button>

      {showConfirmation && (
        <div
          id={`restore-panel-${asset._id}`}
          className="mt-4 w-full rounded-2xl border border-emerald-200 bg-emerald-50 p-4 sm:p-5"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 7v5h-5" />
                <path d="M4 17v-5h5" />
                <path d="M5.6 9a7 7 0 0 1 12-2L20 12" />
                <path d="M4 12l2.4 5a7 7 0 0 0 12-2" />
              </svg>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-emerald-900">
                Restore this asset?
              </h4>

              <p className="mt-1 text-sm leading-6 text-emerald-800">
                You are about to restore{" "}
                <span className="font-semibold">{asset.assetName}</span> (
                {asset.assetTag}).
              </p>

              <p className="mt-2 text-sm leading-6 text-emerald-800">
                The asset will change from{" "}
                <span className="font-semibold">Archived</span> to{" "}
                <span className="font-semibold">Available</span>. It can then be
                assigned to an active employee.
              </p>
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <div className="mt-5 flex flex-wrap justify-end gap-3 border-t border-emerald-200 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowConfirmation(false);
                setError("");
              }}
              disabled={loading}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleRestore}
              disabled={loading}
              className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Restoring..." : "Confirm Restore"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssetRestore;
