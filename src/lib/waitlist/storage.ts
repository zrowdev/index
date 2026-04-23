import { createHmac } from "node:crypto";
import { BlobNotFoundError, head, put } from "@vercel/blob";
import type { ParsedWaitlistInput } from "./types";

export type WaitlistRecord = ParsedWaitlistInput & {
  id: string;
  status: "new" | "reviewed" | "invited" | "hold" | "rejected";
  submittedAt: string;
};

export type WaitlistSubmissionResult = {
  ok: true;
  duplicate: boolean;
  id: string;
};

const WAITLIST_KEY_LENGTH = 32;

function getWaitlistSigningSecret() {
  const secret = process.env.WAITLIST_SIGNING_SECRET;

  if (!secret) {
    throw new Error("WAITLIST_SIGNING_SECRET is required.");
  }

  return secret;
}

function makeId(email: string) {
  return createHmac("sha256", getWaitlistSigningSecret())
    .update(email)
    .digest("hex")
    .slice(0, WAITLIST_KEY_LENGTH);
}

function isBlobAlreadyPresentError(error: unknown) {
  return error instanceof Error && /already exists|precondition/i.test(error.message);
}

export async function createWaitlistSubmission(
  input: ParsedWaitlistInput,
): Promise<WaitlistSubmissionResult> {
  const id = makeId(input.email);
  const pathname = `waitlist/${id}.json`;

  const existing = await head(pathname, {
    token: process.env.BLOB_READ_WRITE_TOKEN,
  }).catch((error: unknown) => {
    if (error instanceof BlobNotFoundError) {
      return null;
    }

    throw error;
  });

  if (existing) {
    return { ok: true, duplicate: true, id };
  }

  const record: WaitlistRecord = {
    ...input,
    id,
    status: "new",
    submittedAt: new Date().toISOString(),
  };

  try {
    await put(pathname, JSON.stringify(record, null, 2), {
      access: "private",
      addRandomSuffix: false,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: "application/json",
    });
  } catch (error) {
    if (isBlobAlreadyPresentError(error)) {
      return { ok: true, duplicate: true, id };
    }

    throw error;
  }

  return { ok: true, duplicate: false, id };
}
