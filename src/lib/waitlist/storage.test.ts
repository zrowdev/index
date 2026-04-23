import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BlobNotFoundError } from "@vercel/blob";
import { createWaitlistSubmission } from "./storage";

const blob = vi.hoisted(() => ({
  head: vi.fn(),
  put: vi.fn(),
}));

vi.mock("@vercel/blob", async () => {
  const actual = await vi.importActual<typeof import("@vercel/blob")>("@vercel/blob");

  return {
    ...actual,
    head: blob.head,
    put: blob.put,
  };
});

describe("createWaitlistSubmission", () => {
  beforeEach(() => {
    process.env.BLOB_READ_WRITE_TOKEN = "blob-token";
    process.env.WAITLIST_SIGNING_SECRET = "waitlist-secret";
  });

  afterEach(() => {
    blob.head.mockReset();
    blob.put.mockReset();
  });

  it("stores a new submission as a private blob without random suffixes", async () => {
    blob.head.mockRejectedValueOnce(new BlobNotFoundError());
    blob.put.mockResolvedValueOnce({ url: "https://example.com/blob" });

    const result = await createWaitlistSubmission({
      name: "Ada Lovelace",
      email: "ada@example.com",
      role: "Engineer",
      useCase: "I want agent workflows inside my editor without tab switching.",
      contact: "@ada",
      referral: "GitHub",
    });

    expect(result).toEqual({
      ok: true,
      duplicate: false,
      id: expect.any(String),
    });
    expect(blob.put).toHaveBeenCalledWith(
      `waitlist/${result.id}.json`,
      expect.stringContaining('"email": "ada@example.com"'),
      expect.objectContaining({
        access: "private",
        addRandomSuffix: false,
        token: "blob-token",
        contentType: "application/json",
      }),
    );
  });

  it("returns duplicate when the blob already exists", async () => {
    blob.head.mockResolvedValueOnce({ pathname: "waitlist/existing.json" });

    const result = await createWaitlistSubmission({
      name: "Ada Lovelace",
      email: "ada@example.com",
      role: "Engineer",
      useCase: "I want agent workflows inside my editor without tab switching.",
      contact: "@ada",
      referral: "GitHub",
    });

    expect(result).toEqual({
      ok: true,
      duplicate: true,
      id: expect.any(String),
    });
    expect(blob.put).not.toHaveBeenCalled();
  });

  it("surfaces non-not-found head failures", async () => {
    blob.head.mockRejectedValueOnce(new Error("blob auth failed"));

    await expect(
      createWaitlistSubmission({
        name: "Ada Lovelace",
        email: "ada@example.com",
        role: "Engineer",
        useCase: "I want agent workflows inside my editor without tab switching.",
        contact: "@ada",
        referral: "GitHub",
      }),
    ).rejects.toThrow(/blob auth failed/i);
  });

  it("uses a keyed stable id rather than the raw email", async () => {
    blob.head.mockRejectedValue(new BlobNotFoundError());
    blob.put.mockResolvedValue({ url: "https://example.com/blob" });

    const first = await createWaitlistSubmission({
      name: "Ada Lovelace",
      email: "ada@example.com",
      role: "Engineer",
      useCase: "I want agent workflows inside my editor without tab switching.",
      contact: "@ada",
      referral: "GitHub",
    });

    const second = await createWaitlistSubmission({
      name: "Ada Lovelace",
      email: "ada@example.com",
      role: "Engineer",
      useCase: "I want agent workflows inside my editor without tab switching.",
      contact: "@ada",
      referral: "GitHub",
    });

    expect(first.id).toBe(second.id);
    expect(first.id).not.toContain("ada");
  });
});
