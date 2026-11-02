
export default function AdminDashboard({
  properties,
  onAddProperty,
  onEditProperty,
  onDeleteProperty,
  onBackToWebsite,
  username
}) {
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Admin Dashboard</h2>
          <p className="text-muted">
            Welcome, {username}
          </p>
        </div>

        <button
          className="btn btn-outline-primary"
          onClick={onBackToWebsite}
        >
          Back to Website
        </button>
      </div>

      <div className="card shadow-sm p-4 mb-4">
        <h5>Total Properties</h5>
        <h2>{properties.length}</h2>
      </div>

      <div className="mb-4">
        <button className="btn btn-success" onClick={onAddProperty}>
          + Add New Property
        </button>
      </div>

      <h4 className="mb-3">Manage Properties</h4>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Property Title</th>
              <th>Location</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {properties.map((property) => (
              <tr key={property.id}>
                <td>{property.id}</td>
                <td>{property.title}</td>
                <td>{property.location}</td>
                <td>
                  ₹ {Number(property.price).toLocaleString("en-IN")}
                </td>
                <td>
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => onEditProperty(property)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onDeleteProperty(property.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
