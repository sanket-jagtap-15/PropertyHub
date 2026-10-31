import React from "react";

export default function PropertyCard({ property, onDelete, onEdit }) {

  return (
    <div className="card property-card shadow-sm">

      <img
        src={
          property.imageUrl ||
          "https://placehold.co/600x400?text=Property"
        }
        className="card-img-top"
        alt={property.title}
      />

      <div className="card-body">

        <h5 className="card-title">
          {property.title}
        </h5>

        <p className="text-muted">
          📍 {property.location}
        </p>

        <h5 className="text-success">
          ₹ {Number(property.price).toLocaleString("en-IN")}
        </h5>

        <p>
          {property.description}
        </p>

        <p>
          🏠 {property.propertyType}
          {" | "}
          🛏️ {property.bedrooms} Bedrooms
          {" | "}
          🚿 {property.bathrooms} Bathrooms
        </p>

        <button
          className="btn btn-primary me-2"
          onClick={() => onEdit(property)}
        >
          Edit
        </button>

        <button
          className="btn btn-danger"
          onClick={() => onDelete(property.id)}
        >
          Delete
        </button>

      </div>
    </div>
  );
}

