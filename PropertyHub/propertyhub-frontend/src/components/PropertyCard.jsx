
export default function PropertyCard({
  property,
  onDelete,
  onEdit,
  isAdmin
}) {
  const placeholderImage =
    "https://placehold.co/600x400?text=Property";

  const handleImageError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = placeholderImage;
  };

  return (
    <div className="card property-card shadow-sm">
      <img
        src={
          property.image ||
          property.imageUrl ||
          placeholderImage
        }
        onError={handleImageError}
        className="card-img-top"
        alt={property.title || "Property"}
        style={{
          width: "100%",
          height: "220px",
          objectFit: "cover"
        }}
      />

      <div className="card-body">
        <h5 className="card-title">{property.title}</h5>

        <p className="text-muted">
          📍 {property.location}
        </p>

        <h5 className="text-success">
          ₹ {Number(property.price).toLocaleString("en-IN")}
        </h5>

        <p>{property.description}</p>

        <p>
          🏠 {property.type || property.propertyType}
          {" | "}
          🛏️ {property.bedrooms} Bedrooms
          {" | "}
          🚿 {property.bathrooms} Bathrooms
        </p>

        {isAdmin && (
          <div>
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
        )}
      </div>
    </div>
  );
}
