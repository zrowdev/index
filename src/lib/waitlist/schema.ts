import type {
  ParsedWaitlistInput,
  WaitlistErrors,
  WaitlistInput,
} from "./types";

const MIN_USE_CASE_LENGTH = 20;

const normalize = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export function parseWaitlistInput(
  input: Partial<Record<keyof WaitlistInput, unknown>>,
):
  | { ok: true; data: ParsedWaitlistInput }
  | { ok: false; errors: WaitlistErrors } {
  const data: ParsedWaitlistInput = {
    name: normalize(input.name),
    email: normalize(input.email).toLowerCase(),
    role: normalize(input.role),
    useCase: normalize(input.useCase),
    contact: normalize(input.contact),
    referral: normalize(input.referral),
  };

  const errors: WaitlistErrors = {};

  if (!data.name) errors.name = "Enter your name.";
  if (!isEmail(data.email)) errors.email = "Enter a valid email address.";
  if (!data.role) errors.role = "Tell us your role.";
  if (data.useCase.length < MIN_USE_CASE_LENGTH) {
    errors.useCase = "Tell us more about your use case (at least 20 characters).";
  }
  if (!data.contact) errors.contact = "Add a contact handle.";
  if (!data.referral) errors.referral = "Tell us where you found Zrow.";

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, data };
}
