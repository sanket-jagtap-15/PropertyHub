
import React, { useState } from "react";

export default function Contact({ selectedProperty, onBackHome }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: selectedProperty
      ? `Enquiry about ${selectedProperty.title}`
      : "",
    message: selectedProperty
      ? `I would like more information about ${selectedProperty.title}.`
      : ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // We will connect this form to the backend in a later step.
    setSubmitted(true);
  };

  return (
    <div className="contact-page">
      <div className="contact-heading text-center">
        <h1>Contact PrimeNest Realty</h1>
        <p>Where Your Future Finds a Home</p>
        <div className="contact-line"></div>
        <p className="text-muted">
          Have questions about a property? We are here to help.
        </p>
      </div>

      <div className="container pb-5">
        <div className="row g-4">

          <div className="col-md-5">
            <div className="contact-info-card h-100">
              <h3>Get In Touch</h3>
              <p>
                Connect with PrimeNest Realty for property information
                and assistance.
              </p>

              <div className="contact-info-item">
                <span>☎</span>
                <div>
                  <h6>Phone</h6>
                  <p>Add your contact number</p>
                </div>
              </div>

              <div className="contact-info-item">
                <span>✉</span>
                <div>
                  <h6>Email</h6>
                  <p>Add your business email</p>
                </div>
              </div>

              <div className="contact-info-item">
                <span>⌖</span>
                <div>
                  <h6>Address</h6>
                  <p>Add your business address</p>
                </div>
              </div>

              <div className="contact-info-item">
                <span>🌐</span>
                <div>
                  <h6>Website</h6>
                  <p>PrimeNest Realty</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-7">
            <div className="contact-form-card">
              <h3>Send Us An Enquiry</h3>
              <p className="text-muted">
                Fill out the form and let us know how we can help.
              </p>

              {submitted ? (
                <div className="alert alert-success">
                  Your enquiry form has been submitted in this demo.
                  Backend submission will be connected in the next step.
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
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
                      <label className="form-label">Message</label>
                      <textarea
                        name="message"
                        className="form-control"
                        rows="5"
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Write your enquiry..."
                        required
                      />
                    </div>

                    <div className="col-12">
                      <button
                        type="submit"
                        className="btn contact-submit-btn"
                      >
                        Submit Enquiry
                      </button>
                    </div>

                  </div>
                </form>
              )}
            </div>
          </div>

        </div>

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
  );
}
