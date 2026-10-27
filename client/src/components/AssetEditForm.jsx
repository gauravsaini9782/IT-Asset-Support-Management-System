import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

const getInitialForm = (asset) => ({
  assetName: asset.assetName || "",
  assetTag: asset.assetTag || "",
  category: asset.category || "laptop",
  brand: asset.brand || "",
  model: asset.model || "",
  serialNumber: asset.serialNumber || "",
  notes: asset.notes || "",
});

function AssetEditForm({ asset, onAssetUpdated }) {
  const [form, setForm] = useState(() => getInitialForm(asset));
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(getInitialForm(asset));
  }, [
    asset._id,
    asset.assetName,
    asset.assetTag,
    asset.category,
    asset.brand,
    asset.model,
    asset.serialNumber,
    asset.notes,
  ]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setForm(getInitialForm(asset));
    setMessage("");
    setIsError(false);
    setIsOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setIsError(false);
    setLoading(true);

    try {
      const token = sessionStorage.getItem("token");

      const payload = {
        assetName: form.assetName.trim(),
        assetTag: form.assetTag.trim(),
        category: form.category,
        brand: form.brand.trim(),
        model: form.model.trim(),
        serialNumber: form.serialNumber.trim(),
        notes: form.notes.trim(),
      };

      const response = await fetch(`${API_BASE_URL}/api/assets/${asset._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update asset");
      }

      onAssetUpdated(data.asset);
      setMessage("Asset updated successfully.");
      setIsOpen(false);
    } catch (error) {
      setIsError(true);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => {
          if (isOpen) {
            handleCancel();
          } else {
            setMessage("");
            setIsError(false);
            setIsOpen(true);
          }
        }}
        aria-expanded={isOpen}
        aria-controls={`edit-asset-${asset._id}`}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
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
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L9 17l-4 1 1-4 10.5-10.5Z" />
        </svg>

        {isOpen ? "Close Editor" : "Edit Asset"}
      </button>

      {message && (
        <p
          role="status"
          aria-live="polite"
          className={`mt-3 rounded-lg px-3 py-2 text-sm ${
            isError
              ? "bg-red-50 text-red-700"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {message}
        </p>
      )}

      {isOpen && (
        <form
          id={`edit-asset-${asset._id}`}
          onSubmit={handleSubmit}
          className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5"
        >
          <div className="mb-5 border-b border-slate-200 pb-4">
            <h4 className="text-base font-semibold text-slate-900">
              Edit Asset Details
            </h4>
            <p className="mt-1 text-sm text-slate-500">
              Update the information for {asset.assetName}.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor={`assetName-${asset._id}`} className={labelClass}>
                Asset Name *
              </label>
              <input
                id={`assetName-${asset._id}`}
                name="assetName"
                value={form.assetName}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label htmlFor={`assetTag-${asset._id}`} className={labelClass}>
                Asset Tag *
              </label>
              <input
                id={`assetTag-${asset._id}`}
                name="assetTag"
                value={form.assetTag}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label htmlFor={`category-${asset._id}`} className={labelClass}>
                Category *
              </label>
              <select
                id={`category-${asset._id}`}
                name="category"
                value={form.category}
                onChange={handleChange}
                className={inputClass}
                required
              >
                <option value="laptop">Laptop</option>
                <option value="monitor">Monitor</option>
                <option value="mobile">Mobile Phone</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor={`brand-${asset._id}`} className={labelClass}>
                Brand
              </label>
              <input
                id={`brand-${asset._id}`}
                name="brand"
                value={form.brand}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor={`model-${asset._id}`} className={labelClass}>
                Model
              </label>
              <input
                id={`model-${asset._id}`}
                name="model"
                value={form.model}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor={`serialNumber-${asset._id}`}
                className={labelClass}
              >
                Serial Number
              </label>
              <input
                id={`serialNumber-${asset._id}`}
                name="serialNumber"
                value={form.serialNumber}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor={`notes-${asset._id}`} className={labelClass}>
                Notes
              </label>
              <textarea
                id={`notes-${asset._id}`}
                name="notes"
                rows={3}
                value={form.notes}
                onChange={handleChange}
                className={`${inputClass} resize-y`}
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-5">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default AssetEditForm;
