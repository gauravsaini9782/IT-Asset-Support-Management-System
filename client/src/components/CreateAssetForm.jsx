import { useState } from "react";

const initialForm = {
  assetName: "",
  assetTag: "",
  category: "laptop",
  brand: "",
  model: "",
  serialNumber: "",
  purchaseDate: "",
  notes: "",
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

function CreateAssetForm({ onAssetCreated }) {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
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
      };

      if (form.serialNumber.trim()) {
        payload.serialNumber = form.serialNumber.trim();
      }

      if (form.purchaseDate) {
        payload.purchaseDate = form.purchaseDate;
      }

      if (form.notes.trim()) {
        payload.notes = form.notes.trim();
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/assets`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create asset");
      }

      onAssetCreated(data.asset);
      setMessage("Asset created successfully.");
      setForm({ ...initialForm });
    } catch (error) {
      setIsError(true);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="mb-6 border-b border-slate-100 pb-5">
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M12 8v8M8 12h8" />
          </svg>
        </div>

        <h3 className="text-lg font-semibold text-slate-900">
          Add New IT Asset
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Register a new device in your organisation's asset inventory.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">
        <div>
          <label htmlFor="assetName" className={labelClass}>
            Asset Name <span className="text-red-500">*</span>
          </label>
          <input
            id="assetName"
            name="assetName"
            value={form.assetName}
            onChange={handleChange}
            placeholder="e.g. Dell Latitude 5420"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label htmlFor="assetTag" className={labelClass}>
            Asset Tag <span className="text-red-500">*</span>
          </label>
          <input
            id="assetTag"
            name="assetTag"
            value={form.assetTag}
            onChange={handleChange}
            placeholder="e.g. LAP-001"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label htmlFor="category" className={labelClass}>
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
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
          <label htmlFor="brand" className={labelClass}>
            Brand <span className="text-red-500">*</span>
          </label>
          <input
            id="brand"
            name="brand"
            value={form.brand}
            onChange={handleChange}
            placeholder="e.g. Dell"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label htmlFor="model" className={labelClass}>
            Model <span className="text-red-500">*</span>
          </label>
          <input
            id="model"
            name="model"
            value={form.model}
            onChange={handleChange}
            placeholder="e.g. Latitude 5420"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label htmlFor="serialNumber" className={labelClass}>
            Serial Number
            <span className="ml-1 font-normal text-slate-400">(Optional)</span>
          </label>
          <input
            id="serialNumber"
            name="serialNumber"
            value={form.serialNumber}
            onChange={handleChange}
            placeholder="Enter serial number"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="purchaseDate" className={labelClass}>
            Purchase Date
            <span className="ml-1 font-normal text-slate-400">(Optional)</span>
          </label>
          <input
            id="purchaseDate"
            name="purchaseDate"
            type="date"
            value={form.purchaseDate}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="notes" className={labelClass}>
            Additional Notes
            <span className="ml-1 font-normal text-slate-400">(Optional)</span>
          </label>
          <textarea
            id="notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            placeholder="Add any additional information about this asset..."
            className={`${inputClass} resize-y`}
          />
        </div>
      </div>

      {message && (
        <div
          role="status"
          aria-live="polite"
          className={`mt-5 rounded-xl border px-4 py-3 text-sm ${
            isError
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {message}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
        <p className="text-xs text-slate-400">Fields marked * are required.</p>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating Asset..." : "+ Create Asset"}
        </button>
      </div>
    </form>
  );
}

export default CreateAssetForm;
