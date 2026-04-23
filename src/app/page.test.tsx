import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "./page";

describe("HomePage", () => {
  it("renders the core beta funnel copy", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /zrow keeps ai agents inside your real coding workflow/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /join beta/i })).toBeInTheDocument();
    expect(screen.getByText(/limited beta/i)).toBeInTheDocument();
  });
});
