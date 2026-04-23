import { describe, expect, it } from "vitest";
import { parseWaitlistInput } from "./schema";

describe("parseWaitlistInput", () => {
  it("returns normalized data for a valid payload", () => {
    const result = parseWaitlistInput({
      name: "  Ada Lovelace  ",
      email: "ADA@example.com ",
      role: "Engineer",
      useCase: "I want to replace IDE/chat context switching.",
      contact: "@ada",
      referral: "GitHub",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected ok result");
    expect(result.data.name).toBe("Ada Lovelace");
    expect(result.data.email).toBe("ada@example.com");
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
    expect(result.errors.email).toContain("valid email");
    expect(result.errors.useCase).toContain("at least");
  });
});
