import { useState } from "react";
import { API_BASE_URL } from "../config";

function AssetArchive({ asset, onAssetUpdated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleArchive = async () => {
    setLoading(true);
    setError("");

    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/assets/${asset._id}/archive`,
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
      setShowConfirmation(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Archived assets should not show the Archive button
  if (asset.status === "archived") {
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
        aria-controls={`archive-panel-${asset._id}`}
        className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:cursor-not-allowed disabled:opacity-50"
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
          <rect x="3" y="4" width="18" height="4" rx="1" />
          <path d="M5 8v12h14V8M10 12h4" />
        </svg>

        {showConfirmation ? "Close Archive" : "Archive Asset"}
      </button>

      {showConfirmation && (
        <div
          id={`archive-panel-${asset._id}`}
          className="mt-4 w-full rounded-2xl border border-red-200 bg-red-50 p-4 sm:p-5"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
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
                <path d="M12 9v4M12 17h.01" />
                <path d="m10.3 3.9-8.1 14a2 2 0 0 0 1.7 3h16.2a2 2 0 0 0 1.7-3l-8.1-14a2 2 0 0 0-3.4 0Z" />
              </svg>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-red-900">
                Archive this asset?
              </h4>

              <p className="mt-1 text-sm leading-6 text-red-800">
                You are about to archive{" "}
                <span className="font-semibold">{asset.assetName}</span>. It
                will no longer be available for assignment.
                {asset.status === "assigned" &&
                  " Its current employee assignment will also be removed."}{" "}
                The asset record will be retained and can be restored later.
              </p>
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-red-300 bg-white px-4 py-3 text-sm text-red-700"
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
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleArchive}
              disabled={loading}
              className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Archiving..." : "Confirm Archive"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssetArchive;
