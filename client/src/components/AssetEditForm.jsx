import { useState } from "react";

function AssetEditForm({ asset, onAssetUpdated }) {
  const [form, setForm] = useState({
    assetName: asset.assetName || "",
    assetTag: asset.assetTag || "",
    category: asset.category || "",
    brand: asset.brand || "",
    model: asset.model || "",
    serialNumber: asset.serialNumber || "",
    notes: asset.notes || "",
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

      const response = await fetch(
        `http://localhost:5000/api/assets/${asset._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update asset");
      }

      onAssetUpdated(data.asset);
      setMessage("Asset updated successfully");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4>Edit IT Asset</h4>

      <label htmlFor={`assetName-${asset._id}`}>Asset Name</label>
      <input
        id={`assetName-${asset._id}`}
        name="assetName"
        value={form.assetName}
        onChange={handleChange}
        required
      />

      <label htmlFor={`assetTag-${asset._id}`}>Asset Tag</label>
      <input
        id={`assetTag-${asset._id}`}
        name="assetTag"
        value={form.assetTag}
        onChange={handleChange}
        required
      />

      <label htmlFor={`category-${asset._id}`}>Category</label>
      <select
        id={`category-${asset._id}`}
        name="category"
        value={form.category}
        onChange={handleChange}
        required
      >
        <option value="laptop">Laptop</option>
        <option value="monitor">Monitor</option>
        <option value="mobile">Mobile Phone</option>
        <option value="other">Other</option>
      </select>

      <label htmlFor={`brand-${asset._id}`}>Brand</label>
      <input
        id={`brand-${asset._id}`}
        name="brand"
        value={form.brand}
        onChange={handleChange}
      />

      <label htmlFor={`model-${asset._id}`}>Model</label>
      <input
        id={`model-${asset._id}`}
        name="model"
        value={form.model}
        onChange={handleChange}
      />

      <label htmlFor={`serialNumber-${asset._id}`}>Serial Number</label>
      <input
        id={`serialNumber-${asset._id}`}
        name="serialNumber"
        value={form.serialNumber}
        onChange={handleChange}
      />

      <label htmlFor={`notes-${asset._id}`}>Notes</label>
      <textarea
        id={`notes-${asset._id}`}
        name="notes"
        value={form.notes}
        onChange={handleChange}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Update Asset"}
      </button>

      {message && <p role="status">{message}</p>}
    </form>
  );
}

export default AssetEditForm;
