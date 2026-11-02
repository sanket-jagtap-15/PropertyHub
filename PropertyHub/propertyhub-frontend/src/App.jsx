
import { useEffect, useState, useRef } from "react";
import axios from "axios";

import Navbar from "./components/Navbar";
import PropertyCard from "./components/PropertyCard";
import AddProperty from "./components/AddProperty";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";

import "./App.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://propertyhub-backend-ey9t.onrender.com";

const API_URL = `${API_BASE_URL}/api/properties`;

export default function App() {
  const [properties, setProperties] = useState([]);
  const [editingProperty, setEditingProperty] = useState(null);
  const [admin, setAdmin] = useState(null);

  const [currentView, setCurrentView] = useState("home");
  const [showLogin, setShowLogin] = useState(false);
  const [showPropertyForm, setShowPropertyForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const propertyFormRef = useRef(null);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(API_URL);
      setProperties(response.data);
      setError("");
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Unable to connect to backend. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    if (showPropertyForm) {
      propertyFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }, [showPropertyForm, editingProperty]);

  const adminConfig = () => ({
    headers: {
      Authorization: `Bearer ${admin.token}`
    }
  });

  // Successful login opens Admin Dashboard automatically
  const handleLogin = (loginData) => {
    setAdmin(loginData);
    setShowLogin(false);
    setShowPropertyForm(false);
    setEditingProperty(null);
    setCurrentView("dashboard");

    alert("Admin login successful!");
  };

  // Logout returns to public website
  const handleLogout = () => {
    setAdmin(null);
    setEditingProperty(null);
    setShowPropertyForm(false);
    setShowLogin(false);
    setCurrentView("home");

    alert("Admin logged out.");
  };

  const saveProperty = async (property) => {
    if (!admin?.token) {
      alert("Please login as Admin first.");
      return;
    }

    try {
      if (editingProperty) {
        await axios.put(
          `${API_URL}/${editingProperty.id}`,
          property,
          adminConfig()
        );
      } else {
        await axios.post(API_URL, property, adminConfig());
      }

      setEditingProperty(null);
      setShowPropertyForm(false);

      await fetchProperties();

      alert("Property saved successfully!");
    } catch (err) {
      console.error("Save error:", err);
      alert("Unable to save property. Please try again.");
    }
  };

  const deleteProperty = async (id) => {
    if (!admin?.token) {
      alert("Please login as Admin first.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this property?")) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/${id}`, adminConfig());
      await fetchProperties();

      alert("Property deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Unable to delete property.");
    }
  };

  const openAddProperty = () => {
    setEditingProperty(null);
    setShowPropertyForm(true);
  };

  const startEditing = (property) => {
    setEditingProperty(property);
    setShowPropertyForm(true);
  };

  const cancelPropertyForm = () => {
    setEditingProperty(null);
    setShowPropertyForm(false);
  };

  return (
    <>
      <Navbar
        isAdmin={Boolean(admin)}
        onAdminClick={() => {
          if (admin) {
            setCurrentView("dashboard");
          } else {
            setShowLogin(true);
            setCurrentView("home");
          }
        }}
        onLogout={handleLogout}
      />

      {currentView === "dashboard" && admin ? (
        <div className="container mt-4">

          {showPropertyForm && (
            <div ref={propertyFormRef} id="property-form">
              <AddProperty
                onSave={saveProperty}
                editingProperty={editingProperty}
                onCancel={cancelPropertyForm}
              />
            </div>
          )}

          <AdminDashboard
            properties={properties}
            username={admin.username}
            onAddProperty={openAddProperty}
            onEditProperty={startEditing}
            onDeleteProperty={deleteProperty}
            onBackToWebsite={() => {
              setShowPropertyForm(false);
              setEditingProperty(null);
              setCurrentView("home");
            }}
          />

        </div>
      ) : (
        <div className="container mt-4">

          <div className="text-center mb-5">
            <h1 className="prime-heading">
              Welcome to PrimeNest Realty
            </h1>

            <p className="prime-tagline">
              Where Your Future Finds a Home
            </p>
          </div>

          {showLogin && !admin && (
            <div className="mb-4">
              <AdminLogin
                onLogin={handleLogin}
                onCancel={() => setShowLogin(false)}
              />
            </div>
          )}

          <h3 className="mb-4" id="properties">
            Available Properties
          </h3>

          {loading && <p>Loading properties...</p>}

          {error && (
            <p className="text-danger">{error}</p>
          )}

          {!loading && !error && properties.length === 0 && (
            <p>No properties available yet. Please check back soon!</p>
          )}

          <div className="row">
            {properties.map((property) => (
              <div className="col-md-4 mb-4" key={property.id}>
                <PropertyCard
                  property={property}
                  isAdmin={Boolean(admin)}
                  onEdit={startEditing}
                  onDelete={deleteProperty}
                />
              </div>
            ))}
          </div>

        </div>
      )}
    </>
  );
}
