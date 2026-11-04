
import { useEffect, useState, useRef } from "react";
import axios from "axios";

import Navbar from "./components/Navbar";
import AddProperty from "./components/AddProperty";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import Contact from "./components/Contact";

import "./App.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://propertyhub-backend-ey9t.onrender.com";

const API_URL = `${API_BASE_URL}/api/properties`;
const ENQUIRY_API_URL = `${API_BASE_URL}/api/enquiries`;

// Homepage property categories
const propertyCategories = [
  {
    id: "residential-built-up",
    title: "Residential Built-up Properties",
    description: "Flats, apartments, independent houses and bungalows.",
    icon: "🏡",
    types: ["Apartment", "House", "Villa"]
  },
  {
    id: "commercial-built-up",
    title: "Commercial Built-up Properties",
    description: "Shops, offices, commercial buildings and showrooms.",
    icon: "🏢",
    types: ["Commercial"]
  },
  {
    id: "industrial-plots",
    title: "Industrial Plots",
    description: "Industrial land, factory plots and warehouse plots.",
    icon: "🏭",
    types: ["Industrial Plot"]
  },
  {
    id: "residential-plots",
    title: "Residential Plots",
    description: "Open land for residential construction.",
    icon: "🌳",
    types: ["Residential Plot", "Plot"]
  }
];

export default function App() {

  const [properties, setProperties] = useState([]);
  const [enquiries, setEnquiries] = useState([]);

  const [editingProperty, setEditingProperty] = useState(null);
  const [admin, setAdmin] = useState(null);

  const [currentView, setCurrentView] = useState("home");
  const [showLogin, setShowLogin] = useState(false);
  const [showPropertyForm, setShowPropertyForm] = useState(false);

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [enquiriesLoading, setEnquiriesLoading] = useState(false);
  const [enquiriesError, setEnquiriesError] = useState("");

  const propertyFormRef = useRef(null);

  // Fetch Properties
  const fetchProperties = async () => {
    try {
      const response = await axios.get(API_URL);

      setProperties(response.data);
      setError("");

    } catch (err) {
      console.error("Fetch properties error:", err);
      setError("Unable to connect to backend. Please try again.");

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Fetch Customer Enquiries
  const fetchEnquiries = async (token) => {

    if (!token) return;

    setEnquiriesLoading(true);
    setEnquiriesError("");

    try {
      const response = await axios.get(ENQUIRY_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Latest enquiry first
      const sortedEnquiries = [...response.data].sort((a, b) => {
        const dateA = new Date(a.enquiryDate || 0).getTime();
        const dateB = new Date(b.enquiryDate || 0).getTime();

        return dateB - dateA;
      });

      setEnquiries(sortedEnquiries);

    } catch (err) {
      console.error("Fetch enquiries error:", err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        setEnquiriesError(
          "Access denied. Please check your admin login and JWT permissions."
        );
      } else {
        setEnquiriesError(
          "Unable to load customer enquiries. Please try again."
        );
      }

    } finally {
      setEnquiriesLoading(false);
    }
  };

  // Load Enquiries When Admin Dashboard Opens
  useEffect(() => {
    if (admin?.token && currentView === "dashboard") {
      fetchEnquiries(admin.token);
    }
  }, [admin, currentView]);

  // Contact Page URL Handling
  useEffect(() => {

    const handleHashChange = () => {

      if (window.location.hash === "#contact") {

        setCurrentView("contact");
        setShowLogin(false);
        setShowPropertyForm(false);

      } else if (currentView === "contact") {

        setCurrentView("home");
        setSelectedProperty(null);
        setSelectedCategory(null);
      }
    };

    window.addEventListener("hashchange", handleHashChange);

    if (window.location.hash === "#contact") {
      setCurrentView("contact");
    }

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };

  }, [currentView]);

  // Scroll to Property Form
  useEffect(() => {

    if (showPropertyForm) {
      propertyFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }

  }, [showPropertyForm, editingProperty]);

  // Admin Authorization Header
  const adminConfig = () => ({
    headers: {
      Authorization: `Bearer ${admin.token}`
    }
  });

  // Admin Login
  const handleLogin = (loginData) => {

    setAdmin(loginData);
    setShowLogin(false);
    setShowPropertyForm(false);
    setEditingProperty(null);
    setCurrentView("dashboard");

    alert("Admin login successful!");
  };

  // Admin Logout
  const handleLogout = () => {

    setAdmin(null);
    setEnquiries([]);
    setEnquiriesError("");

    setEditingProperty(null);
    setShowPropertyForm(false);
    setShowLogin(false);
    setCurrentView("home");

    alert("Admin logged out.");
  };

  // Save or Update Property
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

        await axios.post(
          API_URL,
          property,
          adminConfig()
        );
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

  // Delete Property
  const deleteProperty = async (id) => {

    if (!admin?.token) {
      alert("Please login as Admin first.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this property?")) {
      return;
    }

    try {

      await axios.delete(
        `${API_URL}/${id}`,
        adminConfig()
      );

      await fetchProperties();

      alert("Property deleted successfully!");

    } catch (err) {

      console.error("Delete property error:", err);
      alert("Unable to delete property.");
    }
  };

  // Delete Customer Enquiry
  const deleteEnquiry = async (id) => {

    if (!admin?.token) {
      alert("Please login as Admin first.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this customer enquiry?"
    );

    if (!confirmed) return;

    try {

      await axios.delete(
        `${ENQUIRY_API_URL}/${id}`,
        adminConfig()
      );

      // Remove deleted enquiry from dashboard immediately
      setEnquiries((previousEnquiries) =>
        previousEnquiries.filter(
          (enquiry) => enquiry.id !== id
        )
      );

      alert("Enquiry deleted successfully!");

    } catch (err) {

      console.error("Delete enquiry error:", err);
      alert("Unable to delete enquiry. Please try again.");
    }
  };

  // Add Property
  const openAddProperty = () => {
    setEditingProperty(null);
    setShowPropertyForm(true);
  };

  // Edit Property
  const startEditing = (property) => {
    setEditingProperty(property);
    setShowPropertyForm(true);
  };

  // Cancel Property Form
  const cancelPropertyForm = () => {
    setEditingProperty(null);
    setShowPropertyForm(false);
  };

  // Open Contact Page For An Individual Property
  const openContact = (property = null) => {

    setSelectedProperty(property);
    setSelectedCategory(null);
    setCurrentView("contact");
    setShowLogin(false);
    setShowPropertyForm(false);

    window.location.hash = "contact";
  };

  // Open Contact Page For A Selected Category
  const openCategoryContact = (category) => {

    setSelectedProperty(null);
    setSelectedCategory(category);
    setCurrentView("contact");
    setShowLogin(false);
    setShowPropertyForm(false);

    window.location.hash = "contact";
  };

  // Back to Home
  const backToHome = () => {

    setSelectedProperty(null);
    setSelectedCategory(null);
    setCurrentView("home");

    if (window.location.hash === "#contact") {

      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }
  };

  // Get Properties Matching Selected Category
  const matchingProperties = selectedCategory
    ? properties.filter((property) =>
        selectedCategory.types.includes(
          property.type || property.propertyType
        )
      )
    : [];

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

      {/* ADMIN DASHBOARD */}
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
            enquiries={enquiries}
            enquiriesLoading={enquiriesLoading}
            enquiriesError={enquiriesError}
            username={admin.username}

            onAddProperty={openAddProperty}
            onEditProperty={startEditing}
            onDeleteProperty={deleteProperty}
            onDeleteEnquiry={deleteEnquiry}

            onBackToWebsite={() => {
              setShowPropertyForm(false);
              setEditingProperty(null);
              setCurrentView("home");
            }}
          />

        </div>

      ) : currentView === "contact" ? (

        /* CONTACT PAGE */

        <Contact
          selectedProperty={selectedProperty}
          category={selectedCategory}
          matchingProperties={matchingProperties}
          onBackHome={backToHome}
        />

      ) : (

        /* HOME PAGE */

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

          {/* PROPERTY CATEGORY SELECTION */}
          <section className="category-section mb-5">

            <h2 className="category-main-heading text-center">
              What kind of property are you looking for?
            </h2>

            <p className="category-subheading text-center">
              Choose a property category to explore available options.
            </p>

            <div className="row g-4 mt-3">

              {propertyCategories.map((category) => (

                <div className="col-md-6 col-lg-3" key={category.id}>

                  <button
                    type="button"
                    className="category-card"
                    onClick={() => openCategoryContact(category)}
                  >

                    <span className="category-icon">
                      {category.icon}
                    </span>

                    <h4>{category.title}</h4>

                    <p>{category.description}</p>

                    <span className="category-card-link">
                      Explore Properties →
                    </span>

                  </button>

                </div>
              ))}

            </div>

          </section>

          {/* No property listings are displayed on the homepage */}

        </div>
      )}

    </>
  );
}
