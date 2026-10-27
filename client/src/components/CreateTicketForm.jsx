import { useState } from "react";

function CreateTicketForm({ assets, onTicketCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("hardware");
  const [relatedAsset, setRelatedAsset] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle || !trimmedDescription || !relatedAsset) {
      setError("Please complete all required fields.");
      return;
    }

    // Validate title length
    if (trimmedTitle.length < 5 || trimmedTitle.length > 100) {
      setError("Issue title must contain between 5 and 100 characters.");
      return;
    }

    // Validate description length
    if (trimmedDescription.length < 10 || trimmedDescription.length > 1000) {
      setError(
        "Issue description must contain between 10 and 1000 characters.",
      );
      return;
    }

    if (!assets.some((asset) => asset._id === relatedAsset)) {
      setError("Please select a valid assigned asset.");
      return;
    }

    setSubmitting(true);

    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tickets`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: trimmedTitle,
            description: trimmedDescription,
            category,
            relatedAsset,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create support ticket");
      }

      // Reset form
      setTitle("");
      setDescription("");
      setCategory("hardware");
      setRelatedAsset("");

      // Update Employee Dashboard
      onTicketCreated(data.ticket);

      setSuccess("Support ticket created successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60";

  const labelClass = "mb-2 block text-sm font-semibold text-slate-700";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="ticket-title" className={labelClass}>
          Issue Title <span className="text-rose-500">*</span>
        </label>

        <input
          id="ticket-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. Laptop is not connecting to Wi-Fi"
          minLength={5}
          maxLength={100}
          required
          disabled={submitting}
          className={inputClass}
        />

        <p className="mt-2 text-xs text-slate-500">
          Enter a short, clear title describing the problem.
        </p>
      </div>

      {/* Category and Asset */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Category */}
        <div>
          <label htmlFor="ticket-category" className={labelClass}>
            Issue Category <span className="text-rose-500">*</span>
          </label>

          <select
            id="ticket-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            disabled={submitting}
            required
            className={inputClass}
          >
            <option value="hardware">Hardware</option>
            <option value="software">Software</option>
            <option value="network">Network</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Related Asset */}
        <div>
          <label htmlFor="ticket-asset" className={labelClass}>
            Related Asset <span className="text-rose-500">*</span>
          </label>

          <select
            id="ticket-asset"
            value={relatedAsset}
            onChange={(event) => setRelatedAsset(event.target.value)}
            disabled={submitting || assets.length === 0}
            required
            className={inputClass}
          >
            <option value="">Select an assigned asset</option>

            {assets.map((asset) => (
              <option key={asset._id} value={asset._id}>
                {asset.assetName} ({asset.assetTag})
              </option>
            ))}
          </select>

          {assets.length === 0 && (
            <p className="mt-2 text-xs font-medium text-amber-700">
              No assigned assets available. Contact your IT administrator.
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="ticket-description" className={labelClass}>
          Issue Description <span className="text-rose-500">*</span>
        </label>

        <textarea
          id="ticket-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Describe the issue, when it started, and any troubleshooting steps you have tried..."
          rows={5}
          minLength={10}
          maxLength={1000}
          required
          disabled={submitting}
          className={`${inputClass} resize-y`}
        />

        <div className="mt-2 flex justify-between gap-3">
          <p className="text-xs text-slate-500">
            Provide enough detail for the IT support team.
          </p>

          <span className="text-xs text-slate-400">
            {description.length}/1000
          </span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
        >
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
        >
          {success}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-5">
        <p className="text-xs text-slate-500">
          Your ticket will be submitted to the IT support team.
        </p>

        <button
          type="submit"
          disabled={
            submitting ||
            assets.length === 0 ||
            !title.trim() ||
            !description.trim() ||
            !relatedAsset
          }
          className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Creating Ticket..." : "Submit Support Ticket"}
        </button>
      </div>
    </form>
  );
}

export default CreateTicketForm;
