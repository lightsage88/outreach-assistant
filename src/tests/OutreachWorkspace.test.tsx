/**
 * @jest-environment jsdom
 */

import {
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";

import OutreachWorkspace from "../components/OutreachWorkspace";

describe("OutreachWorkspace demo", () => {
  it("restores the original recipient after clicking Reset Demo", async () => {
    render(<OutreachWorkspace mode="demo" />);

    const firstNameInput = await screen.findByRole(
      "textbox",
      { name: "First name for demo-001" }
    );

    // Confirm the demo starts with its original data.
    expect(firstNameInput).toHaveValue("Alex");

    // Simulate someone editing the recipient.
    fireEvent.change(firstNameInput, {
      target: { value: "Solid Snake" },
    });

    expect(firstNameInput).toHaveValue("Solid Snake");

    // Reset the demo.
    fireEvent.click(
      screen.getByRole("button", {
        name: "Reset Demo",
      })
    );

    // The original recipient should be restored.
    expect(firstNameInput).toHaveValue("Alex");
  });

  it("renders personalized Markdown as formatted HTML", async () => {
    render(<OutreachWorkspace mode="demo" />);

    // Wait for demo campaign to load
    await screen.findByRole("textbox", {
      name: "First name for demo-001",
    });

    // Enter a Markdown template
    fireEvent.change(
      screen.getByRole("textbox", {name: "Message"}),
      {
        target: {
          value: 
            "Hello {{firstName}},\n\n" +
            "**Performance:** " +
            "[Watch my performance](https://example.com/video)",
        }
      }
    );

    const preview = screen.getByRole("region", {
      name: "Rendered email preview"
    });

    // Verify that the Markdown becomes a real HTML link
    expect(
      within(preview).getByRole("link", {
        name: "Watch my performance",
      })
    ).toHaveAttribute("href", "https://example.com/video");

    // Verify that the Markdown bold formatting is rendered.
    expect(
      within(preview).getByText("Performance:")
      .tagName
    ).toBe("STRONG");

    fireEvent.change(
      screen.getByRole("combobox", {
        name: "Preview Recipient"
      }),
      {
        target: { value: "demo-002"},
      }
    );

    expect(
      within(preview).getByText("Hello Jordan,")
    ).toBeInTheDocument();
  });

});