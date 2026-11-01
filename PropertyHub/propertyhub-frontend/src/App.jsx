import React, { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "./components/Navbar";
import PropertyCard from "./components/PropertyCard";
import AddProperty from "./components/AddProperty";

import "./App.css";

const API_URL = "https://propertyhub-backend-ey9t.onrender.com/api/properties";

export default function App() {

  const [properties, setProperties] = useState([]);
  const [editingProperty, setEditingProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get all properties
  const fetchProperties = async () => {
    try {
      const response = await axios.get(API_URL);
      setProperties(response.data);
      setError("");
    } catch (err) {
      setError("Unable to connect to backend. Check Spring Boot.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Add or update property
  const saveProperty = async (property) => {
    try {
      if (editingProperty) {
        await axios.put(
          `${API_URL}/${editingProperty.id}`,
          property
        );
        setEditingProperty(null);
      } else {
        await axios.post(API_URL, property);
      }

      await fetchProperties();

    } catch (err) {
      alert("Unable to save property. Please check your details.");
    }
  };

  // Delete property
  const deleteProperty = async (id) => {

    if (!window.confirm("Are you sure you want to delete?")) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/${id}`);
      await fetchProperties();
    } catch (err) {
      alert("Unable to delete property.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4">

        <div className="text-center mb-4">
          <h1>Welcome to PropertyHub</h1>
          <p>Find and manage your dream properties</p>
        </div>
         <h3 className="mb-4">Available Properties</h3>

        {loading && <p>Loading properties...</p>}

        {error && <p className="text-danger">{error}</p>}

        {!loading && !error && properties.length === 0 && (
          <p>No properties available. Add your first property!</p>
        )}
        
         <div className="row">

          {properties.map((property) => (
            <div className="col-md-4 mb-4" key={property.id}>

              <PropertyCard
                property={property}
                onDelete={deleteProperty}
                onEdit={setEditingProperty}
              />

            </div>
          ))}

        </div>

        <AddProperty
          onSave={saveProperty}
          editingProperty={editingProperty}
          onCancel={() => setEditingProperty(null)}
        />

       

       

      </div>
    </>
  );
}

