
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Contact from "../pages/Contact";

// Group all tests related to the Contact component.
describe("Contact Form Unit Tests", () => {
  let user;

  // Run before each test to prepare a clean environment.
  beforeEach(() => {
    // Create a userEvent instance to simulate user interaction.
    user = userEvent.setup();

    // Mock the browser alert to avoid displaying actual popups.
    vi.spyOn(window, "alert").mockImplementation(() => {});

    // Mock fetch to prevent requests to the real Express API.
    vi.stubGlobal("fetch", vi.fn());
  });

  // Restore mocked functions after each test.
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  // Helper function to complete all contact form fields.
  async function fillContactForm() {
    await user.type(screen.getByLabelText("First Name"), "John");
    await user.type(screen.getByLabelText("Last Name"), "Smith");
    await user.type(screen.getByLabelText("Contact Number"), "4165551234");
    await user.type(screen.getByLabelText("Email"), "john@example.com");
    await user.type(screen.getByLabelText("Message"), "Testing the contact form.");
  }

  // UT-01: Verify that user input updates the form fields.
  it("UT-01: accepts user input in all form fields", async () => {
    render(<Contact />);

    await fillContactForm();

    expect(screen.getByLabelText("First Name")).toHaveValue("John");
    expect(screen.getByLabelText("Last Name")).toHaveValue("Smith");
    expect(screen.getByLabelText("Contact Number")).toHaveValue("4165551234");
    expect(screen.getByLabelText("Email")).toHaveValue("john@example.com");
    expect(screen.getByLabelText("Message")).toHaveValue(
      "Testing the contact form."
    );
  });

  // UT-02: Verify that empty required fields prevent submission.
  it("UT-02: prevents submission when required fields are empty", async () => {
    render(<Contact />);

    const submitButton = screen.getByRole("button", {
      name: "Send Message",
    });

    await user.click(submitButton);

    // HTML5 form validation should prevent the submit handler.
    expect(screen.getByLabelText("First Name")).toBeInvalid();

    // No API request should have been made.
    expect(fetch).not.toHaveBeenCalled();
  });

  // UT-03: Verify that form data is sent to the correct API endpoint.
  it("UT-03: sends correct JSON data to the Contacts API", async () => {
    // Simulate a successful response from the Express API.
    fetch.mockResolvedValue({ ok: true });

    render(<Contact />);

    await fillContactForm();
    await user.click(screen.getByRole("button", { name: "Send Message" }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: "John",
          lastName: "Smith",
          contactNumber: "4165551234",
          email: "john@example.com",
          message: "Testing the contact form.",
        }),
      });
    });
  });

  // UT-04: Verify success feedback and form reset.
  it("UT-04: displays success alert and clears the form", async () => {
    fetch.mockResolvedValue({ ok: true });

    render(<Contact />);

    await fillContactForm();
    await user.click(screen.getByRole("button", { name: "Send Message" }));

    // Wait for the asynchronous submission to finish.
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Your message has been sent successfully."
      );
    });

    // Verify that the form fields are cleared.
    expect(screen.getByLabelText("First Name")).toHaveValue("");
    expect(screen.getByLabelText("Last Name")).toHaveValue("");
    expect(screen.getByLabelText("Contact Number")).toHaveValue("");
    expect(screen.getByLabelText("Email")).toHaveValue("");
    expect(screen.getByLabelText("Message")).toHaveValue("");
  });

  // UT-05: Verify the error handling when the API rejects the request.
  it("UT-05: displays an error when the API request fails", async () => {
    fetch.mockResolvedValue({ ok: false });

    render(<Contact />);

    await fillContactForm();
    await user.click(screen.getByRole("button", { name: "Send Message" }));

    // Verify that the component displays its existing error message.
    expect(
      await screen.findByRole("status")
    ).toHaveTextContent(
      "Unable to send your message. Please try again."
    );

    // Verify that the submit button is enabled again.
    expect(
      screen.getByRole("button", { name: "Send Message" })
    ).toBeEnabled();
  });
});
