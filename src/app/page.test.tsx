import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "./page";

describe("HomePage", () => {
  it("renders the core beta funnel copy", () => {
    render(<HomePage />);

    const cta = screen.getByRole("link", { name: /join beta/i });

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /zrow keeps ai agents inside your real coding workflow/i,
      }),
    ).toBeInTheDocument();
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute("href", "#waitlist");
    expect(screen.getByText(/limited beta/i)).toBeInTheDocument();
  });
});
