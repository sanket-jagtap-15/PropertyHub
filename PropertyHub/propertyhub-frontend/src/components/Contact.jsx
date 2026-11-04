
import React, { useEffect, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://propertyhub-backend-ey9t.onrender.com";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: ""
};

export default function Contact({
  selectedProperty,
  category,
  matchingProperties = [],
  onBackHome
}) {
  const [stage, setStage] = useState(
    selectedProperty ? "property-enquiry" : "requirements"
  );

  const [chosenProperty, setChosenProperty] = useState(
    selectedProperty || null
  );

  const [form, setForm] = useState({
    ...emptyForm,
    subject: selectedProperty
      ? `Enquiry about ${selectedProperty.title}`
      : category
        ? `Enquiry for ${category.title}`
        : "",
    message: selectedProperty
      ? `I would like more information about ${selectedProperty.title}.`
      : ""
  });

  const [customerDetails, setCustomerDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setStage(selectedProperty ? "property-enquiry" : "requirements");
    setChosenProperty(selectedProperty || null);
    setCustomerDetails(null);
    setError("");
    setSuccessMessage("");

    setForm({
      ...emptyForm,
      subject: selectedProperty
        ? `Enquiry about ${selectedProperty.title}`
        : category
          ? `Enquiry for ${category.title}`
          : "",
      message: selectedProperty
        ? `I would like more information about ${selectedProperty.title}.`
        : ""
    });
  }, [selectedProperty, category]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const submitEnquiry = async (enquiryData) => {
    const response = await fetch(`${API_BASE_URL}/api/enquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(enquiryData)
    });

    if (!response.ok) {
      throw new Error("Unable to submit your enquiry. Please try again.");
    }
  };

  // First form: save customer details and requirements
  const handleRequirementsSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    const enquiryData = {
      ...form,
      subject: form.subject || `Enquiry for ${category.title}`,
      propertyTitle: category.title
    };

    try {
      await submitEnquiry(enquiryData);

      setCustomerDetails({
        name: form.name,
        email: form.email,
        phone: form.phone
      });

      setStage("properties");
      setSuccessMessage(
        "Your details have been submitted successfully. Here are the properties in your selected category."
      );
    } catch (err) {
      console.error("Requirements enquiry error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Select a matching property
  const handleSelectProperty = (property) => {
    setChosenProperty(property);

    setForm((previous) => ({
      ...previous,
      subject: `Enquiry about ${property.title}`,
      message: `I would like more information about ${property.title}.`
    }));

    setError("");
    setSuccessMessage("");
    setStage("property-enquiry");
  };

  // Second form: save enquiry about the exact property
  const handlePropertyEnquirySubmit = async (e) => {
    e.preventDefault();

    if (!chosenProperty) {
      setError("Please select a property.");
      return;
    }

    setLoading(true);
    setError("");

    const enquiryData = {
      ...form,
      propertyTitle: chosenProperty.title
    };

    try {
      await submitEnquiry(enquiryData);

      setSuccessMessage(
        `Your enquiry about ${chosenProperty.title} has been submitted successfully.`
      );

      setStage("property-success");
    } catch (err) {
      console.error("Property enquiry error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined || price === "") {
      return "Price on request";
    }

    return `₹${Number(price).toLocaleString("en-IN")}`;
  };

  return (
    <div className="contact-page">
      <div className="contact-heading text-center">
        <h1>Contact PrimeNest Realty</h1>
        <p>Where Your Future Finds a Home</p>
        <div className="contact-line"></div>
        <p className="text-muted">
          We are here to help you find the right property.
        </p>
      </div>

      <div className="container pb-5">
        <div className="contact-form-card">

          {category && (
            <div className="category-selected-heading mb-4">
              <h3>{category.title}</h3>
              <p className="text-muted mb-0">
                {category.description}
              </p>
            </div>
          )}

          {successMessage && (
            <div className="alert alert-success">
              {successMessage}
            </div>
          )}

          {/* STAGE 1: CUSTOMER DETAILS */}
          {stage === "requirements" && (
            <>
              <h3>Tell Us What You Are Looking For</h3>

              <p className="text-muted">
                Enter your details and requirements. We will show you
                matching properties after submission.
              </p>

              <form onSubmit={handleRequirementsSubmit}>
                <div className="row">

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      className="form-control"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="Enter subject"
                      required
                    />
                  </div>

                  <div className="col-12 mb-3">
                    <label className="form-label">
                      Your Requirements
                    </label>
                    <textarea
                      name="message"
                      className="form-control"
                      rows="5"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Describe your requirements, budget, preferred location, etc."
                      required
                    />
                  </div>

                  {error && (
                    <div className="col-12">
                      <div className="alert alert-danger">{error}</div>
                    </div>
                  )}

                  <div className="col-12">
                    <button
                      type="submit"
                      className="btn contact-submit-btn"
                      disabled={loading}
                    >
                      {loading ? "Submitting..." : "Submit Details"}
                    </button>
                  </div>

                </div>
              </form>
            </>
          )}

          {/* STAGE 2: SHOW MATCHING PROPERTIES */}
          {stage === "properties" && (
            <>
              <h3>Properties Matching Your Choice</h3>

              {customerDetails && (
                <p className="text-muted">
                  Welcome, {customerDetails.name}. Choose a property
                  below to send a specific enquiry.
                </p>
              )}

              {matchingProperties.length === 0 ? (
                <div className="alert alert-warning">
                  No properties are currently available in this category.
                  Our team has received your details and can assist you.
                </div>
              ) : (
                <div className="row g-4 mt-2">
                  {matchingProperties.map((property) => (
                    <div
                      className="col-md-6 col-lg-4"
                      key={property.id}
                    >
                      <div className="card h-100 shadow-sm">
                        {property.image && (
                          <img
                            src={
                              property.image.startsWith("http") ||
                              property.image.startsWith("/")
                                ? property.image
                                : `/images/${property.image}`
                            }
                            className="card-img-top"
                            alt={property.title}
                            style={{
                              height: "210px",
                              objectFit: "cover"
                            }}
                          />
                        )}

                        <div className="card-body d-flex flex-column">
                          <h5 className="card-title">
                            {property.title}
                          </h5>

                          <p className="text-muted mb-2">
                            📍 {property.location}
                          </p>

                          <h5 className="property-price">
                            {formatPrice(property.price)}
                          </h5>

                          <p className="card-text">
                            {property.description}
                          </p>

                          <button
                            type="button"
                            className="btn contact-submit-btn mt-auto"
                            onClick={() =>
                              handleSelectProperty(property)
                            }
                          >
                            Enquire About This Property
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* STAGE 3: PROPERTY-SPECIFIC ENQUIRY */}
          {stage === "property-enquiry" && (
            <>
              <h3>Enquire About This Property</h3>

              {chosenProperty && (
                <div className="selected-property-info mb-4">
                  <strong>{chosenProperty.title}</strong>
                  <p className="mb-0">
                    {chosenProperty.location} ·{" "}
                    {formatPrice(chosenProperty.price)}
                  </p>
                </div>
              )}

              <p className="text-muted">
                Your contact details are already filled in. You can
                update them if needed.
              </p>

              <form onSubmit={handlePropertyEnquirySubmit}>
                <div className="row">

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      value={form.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      className="form-control"
                      value={form.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12 mb-3">
                    <label className="form-label">Message</label>
                    <textarea
                      name="message"
                      className="form-control"
                      rows="5"
                      value={form.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {error && (
                    <div className="col-12">
                      <div className="alert alert-danger">{error}</div>
                    </div>
                  )}

                  <div className="col-12">
                    <button
                      type="submit"
                      className="btn contact-submit-btn me-2"
                      disabled={loading}
                    >
                      {loading ? "Submitting..." : "Submit Property Enquiry"}
                    </button>

                    {category && (
                      <button
                        type="button"
                        className="btn btn-outline-secondary mt-2"
                        onClick={() => {
                          setStage("properties");
                          setError("");
                          setSuccessMessage("");
                        }}
                      >
                        Back to Properties
                      </button>
                    )}
                  </div>

                </div>
              </form>
            </>
          )}

          {/* STAGE 4: SUCCESS */}
          {stage === "property-success" && (
            <div className="text-center py-4">
              <h3>Thank You!</h3>
              <p>{successMessage}</p>

              <button
                className="btn contact-submit-btn"
                onClick={() => {
                  setStage("properties");
                  setChosenProperty(null);
                  setSuccessMessage("");
                  setError("");
                }}
              >
                View More Properties
              </button>
            </div>
          )}

          <div className="text-center mt-4">
            <button
              className="btn btn-outline-secondary"
              onClick={onBackHome}
            >
              Back to Home
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
