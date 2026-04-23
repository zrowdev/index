import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { WaitlistForm } from "./waitlist-form";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("WaitlistForm", () => {
  it("shows client validation before sending", async () => {
    render(<WaitlistForm />);

    fireEvent.click(screen.getByRole("button", { name: /submit application/i }));

    expect(await screen.findByText(/enter your name/i)).toBeInTheDocument();
    expect(screen.getByText(/enter a valid email address/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toHaveFocus();
    });
  });

  it("shows success state after a successful submit", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );

    render(<WaitlistForm />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "  Ada Lovelace  " } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "ADA@example.com " } });
    fireEvent.change(screen.getByLabelText(/role/i), { target: { value: " Engineer " } });
    fireEvent.change(screen.getByLabelText(/use case/i), {
      target: { value: "I want agent workflows inside my editor without tab switching." },
    });
    fireEvent.change(screen.getByLabelText(/contact handle/i), { target: { value: " @ada " } });
    fireEvent.change(screen.getByLabelText(/how did you find zrow/i), { target: { value: " GitHub " } });

    fireEvent.click(screen.getByRole("button", { name: /submit application/i }));

    await waitFor(() => {
      expect(screen.getByText(/application received/i)).toBeInTheDocument();
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith("/api/waitlist", expect.any(Object));

    const request = fetchMock.mock.calls[0]?.[1];
    expect(request).toEqual(
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }),
    );
    expect(JSON.parse(String(request?.body))).toEqual({
      name: "Ada Lovelace",
      email: "ada@example.com",
      role: "Engineer",
      useCase: "I want agent workflows inside my editor without tab switching.",
      contact: "@ada",
      referral: "GitHub",
    });
  });

  it("shows server validation errors and focuses the first invalid field", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          message: "Please fix the highlighted fields.",
          errors: {
            email: "Enter a valid email address.",
            useCase: "Tell us more about your use case (at least 20 characters).",
          },
        }),
        {
          status: 422,
          headers: { "Content-Type": "application/json" },
        },
      ),
    );

    render(<WaitlistForm />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Ada Lovelace" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "ada@example.com" } });
    fireEvent.change(screen.getByLabelText(/role/i), { target: { value: "Engineer" } });
    fireEvent.change(screen.getByLabelText(/use case/i), {
      target: { value: "I want agent workflows inside my editor without tab switching." },
    });
    fireEvent.change(screen.getByLabelText(/contact handle/i), { target: { value: "@ada" } });
    fireEvent.change(screen.getByLabelText(/how did you find zrow/i), { target: { value: "GitHub" } });

    fireEvent.click(screen.getByRole("button", { name: /submit application/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/please fix the highlighted fields/i);
    expect(screen.getByText(/enter a valid email address/i)).toBeInTheDocument();
    expect(screen.getByText(/at least 20 characters/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByLabelText(/email/i)).toHaveFocus();
    });
    expect(screen.getByRole("button", { name: /submit application/i })).toBeEnabled();
  });

  it("shows a generic error message when the request fails", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("network down"));

    render(<WaitlistForm />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Ada Lovelace" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "ada@example.com" } });
    fireEvent.change(screen.getByLabelText(/role/i), { target: { value: "Engineer" } });
    fireEvent.change(screen.getByLabelText(/use case/i), {
      target: { value: "I want agent workflows inside my editor without tab switching." },
    });
    fireEvent.change(screen.getByLabelText(/contact handle/i), { target: { value: "@ada" } });
    fireEvent.change(screen.getByLabelText(/how did you find zrow/i), { target: { value: "GitHub" } });

    fireEvent.click(screen.getByRole("button", { name: /submit application/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /we could not submit your application\. please try again\./i,
    );
    expect(screen.getByRole("button", { name: /submit application/i })).toBeEnabled();
  });
});
