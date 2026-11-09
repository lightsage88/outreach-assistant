/**
 * @jest-environment jsdom
 */

import {
  fireEvent,
  render,
  screen,
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
});