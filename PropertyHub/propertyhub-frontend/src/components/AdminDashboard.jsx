
import React from "react";

export default function AdminDashboard({
  properties = [],
  enquiries = [],
  enquiriesLoading = false,
  enquiriesError = "",
  onAddProperty,
  onEditProperty,
  onDeleteProperty,
  onDeleteEnquiry,
  onBackToWebsite,
  username
}) {
  const totalProperties = properties.length;

  const totalValue = properties.reduce(
    (total, property) => total + Number(property.price || 0),
    0
  );

  const averagePrice =
    totalProperties > 0 ? totalValue / totalProperties : 0;

  const propertyTypes = new Set(
    properties.map((property) => property.type || property.propertyType)
  ).size;

  const formatPrice = (price) =>
    "₹ " + Number(price || 0).toLocaleString("en-IN");

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (confirmDelete) {
      onDeleteProperty(id);
    }
  };

  const handleDeleteEnquiry = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this enquiry?"
    );

    if (confirmDelete && onDeleteEnquiry) {
      onDeleteEnquiry(id);
    }
  };

  return (
    <div className="container-fluid px-4 py-4 bg-light min-vh-100">

      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">PrimeNest Realty</h2>
          <h5 className="text-secondary">Admin Dashboard</h5>
          <p className="text-muted mb-0">
            Welcome back, {username || "Admin"}!
          </p>
        </div>

        <button
          className="btn btn-outline-primary mt-2"
          onClick={onBackToWebsite}
        >
          ← Back to Website
        </button>
      </div>

      {/* Statistics */}
      <div className="row g-3 mb-4">

        <div className="col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm p-3 h-100">
            <p className="text-muted mb-2">Total Properties</p>
            <h2 className="fw-bold text-primary">{totalProperties}</h2>
            <small className="text-muted">Properties listed</small>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm p-3 h-100">
            <p className="text-muted mb-2">Property Types</p>
            <h2 className="fw-bold text-success">{propertyTypes}</h2>
            <small className="text-muted">Different categories</small>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm p-3 h-100">
            <p className="text-muted mb-2">Total Listed Value</p>
            <h4 className="fw-bold text-success">
              {formatPrice(totalValue)}
            </h4>
            <small className="text-muted">Combined property prices</small>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm p-3 h-100">
            <p className="text-muted mb-2">Average Property Price</p>
            <h4 className="fw-bold text-warning">
              {formatPrice(averagePrice)}
            </h4>
            <small className="text-muted">Average listed price</small>
          </div>
        </div>

      </div>

      {/* Property Management */}
      <div className="card border-0 shadow-sm p-4 mb-4">

        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold mb-1">Manage Properties</h4>
            <p className="text-muted mb-0">
              View, add, update and delete properties.
            </p>
          </div>

          <button
            className="btn btn-success mt-2"
            onClick={onAddProperty}
          >
            + Add New Property
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle">

            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Property Title</th>
                <th>Location</th>
                <th>Type</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {properties.length > 0 ? (
                properties.map((property) => (
                  <tr key={property.id}>
                    <td>{property.id}</td>

                    <td className="fw-semibold">
                      {property.title}
                    </td>

                    <td>{property.location}</td>

                    <td>
                      <span className="badge bg-info text-dark">
                        {property.type || property.propertyType || "N/A"}
                      </span>
                    </td>

                    <td className="fw-semibold text-success">
                      {formatPrice(property.price)}
                    </td>

                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2 mb-1"
                        onClick={() => onEditProperty(property)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-sm btn-outline-danger mb-1"
                        onClick={() => handleDelete(property.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    <h5 className="text-muted">No Properties Found</h5>
                    <p className="text-muted">
                      Click Add New Property to get started.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>

      {/* Customer Enquiries */}
      <div className="card border-0 shadow-sm p-4">

        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold mb-1">
              Customer Enquiries
            </h4>
            <p className="text-muted mb-0">
              View and manage enquiries submitted by customers.
            </p>
          </div>

          <span className="badge bg-primary fs-6">
            Total: {enquiries.length}
          </span>
        </div>

        {enquiriesLoading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted mt-2">Loading enquiries...</p>
          </div>
        ) : enquiriesError ? (
          <div className="alert alert-danger">
            {enquiriesError}
          </div>
        ) : enquiries.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover align-middle">

              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Property</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Enquiry Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {enquiries.map((enquiry) => (
                  <tr key={enquiry.id}>
                    <td>{enquiry.id}</td>

                    <td className="fw-semibold">
                      {enquiry.name}
                    </td>

                    <td>
                      <div>{enquiry.email}</div>
                      <small className="text-muted">
                        {enquiry.phone}
                      </small>
                    </td>

                    <td>
                      {enquiry.propertyTitle || "General Enquiry"}
                    </td>

                    <td>{enquiry.subject}</td>

                    <td style={{ minWidth: "200px", maxWidth: "300px" }}>
                      <div
                        style={{
                          whiteSpace: "pre-wrap",
                          overflowWrap: "anywhere"
                        }}
                      >
                        {enquiry.message}
                      </div>
                    </td>

                    <td style={{ minWidth: "150px" }}>
                      {formatDate(enquiry.enquiryDate)}
                    </td>

                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteEnquiry(enquiry.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        ) : (
          <div className="text-center py-5">
            <h5 className="text-muted">
              No Customer Enquiries Found
            </h5>
            <p className="text-muted mb-0">
              Customer enquiries will appear here after submission.
            </p>
          </div>
        )}

      </div>

      {/* Footer */}
      <p className="text-center text-muted mt-4">
        © 2026 PrimeNest Realty | Admin Panel
      </p>

    </div>
  );
}
