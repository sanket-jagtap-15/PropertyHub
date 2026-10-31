import React, { useEffect, useState } from "react";

const initialForm = {
  title: "",
  description: "",
  location: "",
  price: "",
  propertyType: "Apartment",
  bedrooms: 1,
  bathrooms: 1,
  imageUrl: ""
};

export default function AddProperty({ onSave, editingProperty, onCancel }) {

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (editingProperty) {
      setForm({ ...editingProperty });
    } else {
      setForm(initialForm);
    }
  }, [editingProperty]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({
      ...form,
      price: Number(form.price),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms)
    });

    setForm(initialForm);
  };

  return (
    <div className="card p-4 shadow-sm mb-4">

      <h4>
        {editingProperty ? "Update Property" : "Add New Property"}
      </h4>

      <form onSubmit={handleSubmit}>

        <div className="row">

          <div className="col-md-6 mb-3">
            <label>Property Title</label>
            <input
              className="form-control"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>Location</label>
            <input
              className="form-control"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>Price (₹)</label>
            <input
              type="number"
              min="0"
              className="form-control"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>Property Type</label>
            <select
              className="form-control"
              name="propertyType"
              value={form.propertyType}
              onChange={handleChange}
            >
              <option>Apartment</option>
              <option>House</option>
              <option>Villa</option>
              <option>Plot</option>
              <option>Commercial</option>
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label>Bedrooms</label>
            <input
              type="number"
              min="0"
              className="form-control"
              name="bedrooms"
              value={form.bedrooms}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>Bathrooms</label>
            <input
              type="number"
              min="0"
              className="form-control"
              name="bathrooms"
              value={form.bathrooms}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-12 mb-3">
            <label>Image URL</label>
            <input
              className="form-control"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="Paste image URL"
            />
          </div>

          <div className="col-12 mb-3">
            <label>Description</label>
            <textarea
              className="form-control"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

        </div>

        <button className="btn btn-success me-2" type="submit">
          {editingProperty ? "Update Property" : "Add Property"}
        </button>

        {editingProperty && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}

      </form>
    </div>
  );
}

