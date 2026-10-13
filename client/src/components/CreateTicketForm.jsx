import { useState } from "react";

function CreateTicketForm({ assets, onTicketCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("hardware");
  const [relatedAsset, setRelatedAsset] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          category,
          relatedAsset,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create ticket");
      }

      setTitle("");
      setDescription("");
      setCategory("hardware");
      setRelatedAsset("");

      onTicketCreated(data.ticket);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section>
      <h2>Create Support Ticket</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="ticket-title">Title</label>
        <input
          id="ticket-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />

        <label htmlFor="ticket-description">Description</label>
        <textarea
          id="ticket-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
        />

        <label htmlFor="ticket-category">Category</label>
        <select
          id="ticket-category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="hardware">Hardware</option>
          <option value="software">Software</option>
          <option value="network">Network</option>
          <option value="other">Other</option>
        </select>

        <label htmlFor="ticket-asset">Related Asset</label>
        <select
          id="ticket-asset"
          value={relatedAsset}
          onChange={(event) => setRelatedAsset(event.target.value)}
          required
        >
          <option value="">Select an asset</option>
          {assets.map((asset) => (
            <option key={asset._id} value={asset._id}>
              {asset.assetName} ({asset.assetTag})
            </option>
          ))}
        </select>

        {error && <p role="alert">{error}</p>}

        <button type="submit" disabled={submitting || assets.length === 0}>
          {submitting ? "Creating..." : "Create Ticket"}
        </button>
      </form>
    </section>
  );
}

export default CreateTicketForm;
