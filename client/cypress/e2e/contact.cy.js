
/********************************************************/
/* Assignment 4 - Contact Form End-to-End Test          */
/* Tests the real React frontend and Express API.       */
/********************************************************/

describe("Portfolio Contact Form E2E Test", () => {

  it("E2E-01: submits a contact message successfully", () => {

    // Open the Contact page in the running React application.
    cy.visit("/contact");

    // Verify the Contact page is displayed.
    cy.contains("h1", "Contact Me").should("be.visible");

    // Enter contact information using the actual form fields.
    cy.get("#firstName").type("Cypress");
    cy.get("#lastName").type("Test");
    cy.get("#contactNumber").type("4165551234");
    cy.get("#email").type("cypress.test@example.com");
    cy.get("#message").type("Assignment 4 automated E2E test.");

    // Observe the real POST request to the Express Contacts API.
    cy.intercept("POST", "/api/contacts").as("createContact");

    // Verify the form can be submitted.
    cy.contains("button", "Send Message").should("be.enabled");

    // Listen for the expected browser success alert.
    cy.on("window:alert", (message) => {
      expect(message).to.equal(
        "Your message has been sent successfully."
      );
    });

    // Submit the form.
    cy.contains("button", "Send Message").click();

    // Wait for the API response and confirm the backend accepted it.
    cy.wait("@createContact").then(({ request, response }) => {
      expect(request.body.email).to.equal(
        "cypress.test@example.com"
      );

      expect(response.statusCode).to.be.within(200, 299);
    });

    // Verify the form was cleared after successful submission.
    cy.get("#firstName").should("have.value", "");
    cy.get("#lastName").should("have.value", "");
    cy.get("#email").should("have.value", "");
    cy.get("#message").should("have.value", "");

    // Verify the submission button is enabled again.
    cy.contains("button", "Send Message").should("be.enabled");
  });

});
