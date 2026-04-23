import { describe, expect, it } from "vitest";
import { parseWaitlistInput } from "./schema";

describe("parseWaitlistInput", () => {
  it("returns normalized data for a valid payload", () => {
    const result = parseWaitlistInput({
      name: "  Ada Lovelace  ",
      email: "ADA@example.com ",
      role: "  Engineer ",
      useCase: "I want to replace IDE/chat context switching.",
      contact: "  @ada ",
      referral: "  GitHub ",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected ok result");
    expect(result.data.name).toBe("Ada Lovelace");
    expect(result.data.email).toBe("ada@example.com");
    expect(result.data.role).toBe("Engineer");
    expect(result.data.contact).toBe("@ada");
    expect(result.data.referral).toBe("GitHub");
  });

  it("returns field errors for an invalid payload", () => {
    const result = parseWaitlistInput({
      name: "",
      email: "bad",
      role: "",
      useCase: "short",
      contact: "",
      referral: "",
    });

    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected error result");
    expect(result.errors.name).toContain("name");
    expect(result.errors.email).toContain("valid email");
    expect(result.errors.role).toContain("role");
    expect(result.errors.useCase).toContain("at least");
    expect(result.errors.contact).toContain("contact handle");
    expect(result.errors.referral).toContain("found Zrow");
  });

  it("enforces the use case boundary at 20 characters", () => {
    const tooShort = parseWaitlistInput({
      name: "Ada Lovelace",
      email: "ada@example.com",
      role: "Engineer",
      useCase: "1234567890123456789",
      contact: "@ada",
      referral: "GitHub",
    });

    expect(tooShort.ok).toBe(false);
    if (tooShort.ok) throw new Error("expected error result");
    expect(tooShort.errors.useCase).toContain("at least 20 characters");

    const atLimit = parseWaitlistInput({
      name: "Ada Lovelace",
      email: "ada@example.com",
      role: "Engineer",
      useCase: "12345678901234567890",
      contact: "@ada",
      referral: "GitHub",
    });

    expect(atLimit.ok).toBe(true);
  });

  it("treats non-string and whitespace-only values as invalid without throwing", () => {
    const result = parseWaitlistInput({
      name: "   ",
      email: null,
      role: 123,
      useCase: {},
      contact: [],
      referral: undefined,
    });

    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected error result");

    expect(result.errors.name).toContain("name");
    expect(result.errors.email).toContain("valid email");
    expect(result.errors.role).toContain("role");
    expect(result.errors.useCase).toContain("at least 20 characters");
    expect(result.errors.contact).toContain("contact handle");
    expect(result.errors.referral).toContain("found Zrow");
  });
});
