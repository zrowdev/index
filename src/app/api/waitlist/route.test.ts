import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const storage = vi.hoisted(() => ({
  createWaitlistSubmission: vi.fn(),
}));

vi.mock("@/lib/waitlist/storage", () => storage);

afterEach(() => {
  storage.createWaitlistSubmission.mockReset();
});

const createValidRequest = () =>
  new Request("http://localhost/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "  Ada Lovelace  ",
      email: "ADA@example.com ",
      role: " Engineer ",
      useCase: "I want agent workflows inside my editor without tab switching.",
      contact: " @ada ",
      referral: " GitHub ",
    }),
  });

describe("POST /api/waitlist", () => {
  it("returns 200 for valid submissions", async () => {
    storage.createWaitlistSubmission.mockResolvedValueOnce({
      ok: true,
      duplicate: false,
      id: "abc123",
    });

    const response = await POST(createValidRequest());
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      ok: true,
      message: "Application received.",
    });
    expect(storage.createWaitlistSubmission).toHaveBeenCalledTimes(1);
    expect(storage.createWaitlistSubmission).toHaveBeenCalledWith({
      name: "Ada Lovelace",
      email: "ada@example.com",
      role: "Engineer",
      useCase: "I want agent workflows inside my editor without tab switching.",
      contact: "@ada",
      referral: "GitHub",
    });
  });

  it("returns 200 for duplicate submissions", async () => {
    storage.createWaitlistSubmission.mockResolvedValueOnce({
      ok: true,
      duplicate: true,
      id: "abc123",
    });

    const response = await POST(createValidRequest());
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      ok: true,
      message: "Application received.",
    });
  });

  it("returns 400 for invalid submissions", async () => {
    const request = new Request("http://localhost/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "bad" }),
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.ok).toBe(false);
    expect(payload.errors.email).toContain("valid email");
    expect(storage.createWaitlistSubmission).not.toHaveBeenCalled();
  });

  it("returns 500 when storage fails", async () => {
    storage.createWaitlistSubmission.mockRejectedValueOnce(new Error("blob down"));

    const response = await POST(createValidRequest());
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      message: "We could not save your request right now. Please try again.",
    });
  });
});
