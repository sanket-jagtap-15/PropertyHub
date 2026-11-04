
import React, { useEffect, useState } from "react";

const initialForm = {
  title: "",
  description: "",
  location: "",
  price: "",
  type: "Apartment",
  bedrooms: 1,
  bathrooms: 1,
  image: ""
};

export default function AddProperty({
  onSave,
  editingProperty,
  onCancel
}) {
  const [form, setForm] = useState(initialForm);
  const [preview, setPreview] = useState("");

  const getImageUrl = (image) => {
    if (!image) return "";

    if (
      image.startsWith("http://") ||
      image.startsWith("https://") ||
      image.startsWith("/")
    ) {
      return image;
    }

    return `/images/${image}`;
  };

  useEffect(() => {
    if (editingProperty) {
      const existingImage =
        editingProperty.image ||
        editingProperty.imageUrl ||
        "";

      setForm({
        ...initialForm,
        ...editingProperty,
        type:
          editingProperty.type ||
          editingProperty.propertyType ||
          "Apartment",
        image: existingImage
      });

      setPreview(getImageUrl(existingImage));
    } else {
      setForm(initialForm);
      setPreview("");
    }
  }, [editingProperty]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));

    if (name === "image") {
      setPreview(getImageUrl(value.trim()));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({
      ...form,
      price: Number(form.price),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms)
    });
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
              min="1"
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
              name="type"
              value={form.type}
              onChange={handleChange}
              required
            >
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Villa">Villa</option>
              <option value="Commercial">Commercial</option>
              <option value="Residential Plot">Residential Plot</option>
              <option value="Industrial Plot">Industrial Plot</option>
              <option value="Plot">Plot (Existing)</option>
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
            <label>Property Image URL or Filename</label>
            <input
              className="form-control"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="Paste image URL or enter filename, e.g. house1.jpg"
            />
            <small className="text-muted">
              Enter a direct image URL or a filename from public/images/.
            </small>
          </div>

          {preview && (
            <div className="col-12 mb-3">
              <label>Image Preview</label>
              <div>
                <img
                  src={preview}
                  alt="Property preview"
                  onError={() => setPreview("")}
                  style={{
                    width: "250px",
                    height: "160px",
                    objectFit: "cover",
                    borderRadius: "8px"
                  }}
                />
              </div>
            </div>
          )}

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
