/********************************************************/
/* Contact page. Controlled React form using useState;  */
/* useNavigate returns the visitor to Home/Landing page */
/* after submission for now.                            */
/********************************************************/

// useState hook for storing and updating form input values
import { useState } from "react";


function Contact() {

  // Stores all contact form fields in a single state object
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    email: "",
    message: "",
  });

  // Updates the appropriate form field whenever the user enters or changes data
  function handleChange(event) {
    const { name, value } = event.target;

    // Updates only the changed field while preserving the other form values
    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  // Track whether the form is currently being submitted.
  const [submitting, setSubmitting] = useState(false);

  // Store success or error messages.
  const [statusMessage, setStatusMessage] = useState("");

  // Handle the contact form submission.
  async function handleSubmit(event) {
    // Prevent the browser from refreshing the page.
    event.preventDefault();

    // Prevent duplicate submissions while a request is running.
    if (submitting) {
      return;
    }

    // Disable additional submissions until the request completes.
    setSubmitting(true);

    // Clear any previous status message.
    setStatusMessage("");

    try {
      // Send the form information to the Express Contacts API.
      const response = await fetch("/api/contacts", {
        method: "POST",

        // Tell Express that the request contains JSON.
        headers: {
          "Content-Type": "application/json",
        },

        // Convert the JavaScript form object into JSON.
        body: JSON.stringify(formData),
      });

      // Check whether the API successfully saved the contact.
      if (!response.ok) {
        throw new Error("Unable to send your message. Please try again.");
      }

      // Display a confirmation after successful submission.
      //setStatusMessage("Your message has been sent successfully.");
      window.alert("Your message has been sent successfully.");

      // Clear the form fields.
      setFormData({
        firstName: "",
        lastName: "",
        contactNumber: "",
        email: "",
        message: "",
      });
    } catch (error) {
      // Display an error if the API request fails.
      setStatusMessage(error.message);
    } finally {
      // Re-enable the form submission button.
      setSubmitting(false);
    }
  }

  return (
    <section className="contact-page">
      <div className="page-header">
        <p className="section-label">GET IN TOUCH</p>

        <h1>Contact Me</h1>

        <p>
          If you would like to discuss a project, technology solution, or
          professional opportunity, feel free to get in touch.
        </p>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>

            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>

            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="contactNumber">Contact Number</label>

            <input
              type="tel"
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>

            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="message">Message</label>

          <textarea
            id="message"
            name="message"
            rows="7"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? "Sending..." : "Send Message"}
        </button>
      </form>
      {statusMessage && (
        <p role="status">{statusMessage}</p>
      )}
    </section>
  );
}

// Exports so it can be imported and used by other files
export default Contact;