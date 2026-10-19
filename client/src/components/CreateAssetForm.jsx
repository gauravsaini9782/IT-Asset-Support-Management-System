import { useState } from "react";

function CreateAssetForm({ onAssetCreated }) {
  const [form, setForm] = useState({
    assetName: "",
    assetTag: "",
    category: "laptop",
    brand: "",
    model: "",
    serialNumber: "",
    purchaseDate: "",
    notes: "",
  });

  const [message, setMessage] = useState("");
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

      const response = await fetch("http://localhost:5000/api/assets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create asset");
      }

      onAssetCreated(data.asset);
      setMessage("Asset created successfully");

      setForm({
        assetName: "",
        assetTag: "",
        category: "laptop",
        brand: "",
        model: "",
        serialNumber: "",
        purchaseDate: "",
        notes: "",
      });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add New IT Asset</h3>

      <label htmlFor="assetName">Asset Name</label>
      <input
        id="assetName"
        name="assetName"
        value={form.assetName}
        onChange={handleChange}
        required
      />

      <label htmlFor="assetTag">Asset Tag</label>
      <input
        id="assetTag"
        name="assetTag"
        value={form.assetTag}
        onChange={handleChange}
        required
      />

      <label htmlFor="category">Category</label>
      <select
        id="category"
        name="category"
        value={form.category}
        onChange={handleChange}
      >
        <option value="laptop">Laptop</option>
        <option value="monitor">Monitor</option>
        <option value="mobile">Mobile Phone</option>
        <option value="other">Other</option>
      </select>

      <label htmlFor="brand">Brand</label>
      <input
        id="brand"
        name="brand"
        value={form.brand}
        onChange={handleChange}
        required
      />

      <label htmlFor="model">Model</label>
      <input
        id="model"
        name="model"
        value={form.model}
        onChange={handleChange}
        required
      />

      <label htmlFor="serialNumber">Serial Number (optional)</label>
      <input
        id="serialNumber"
        name="serialNumber"
        value={form.serialNumber}
        onChange={handleChange}
      />

      <label htmlFor="purchaseDate">Purchase Date (optional)</label>
      <input
        id="purchaseDate"
        name="purchaseDate"
        type="date"
        value={form.purchaseDate}
        onChange={handleChange}
      />

      <label htmlFor="notes">Notes (optional)</label>
      <textarea
        id="notes"
        name="notes"
        value={form.notes}
        onChange={handleChange}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Asset"}
      </button>

      {message && <p role="status">{message}</p>}
    </form>
  );
}

export default CreateAssetForm;
