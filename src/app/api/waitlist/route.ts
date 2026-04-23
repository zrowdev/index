import { NextResponse } from "next/server";
import { parseWaitlistInput } from "@/lib/waitlist/schema";
import { createWaitlistSubmission } from "@/lib/waitlist/storage";

export async function POST(request: Request) {
  const raw = await request.json().catch(() => null);
  const parsed = parseWaitlistInput(raw ?? {});

  if (!parsed.ok) {
    return NextResponse.json({ ok: false, errors: parsed.errors }, { status: 400 });
  }

  try {
    const result = await createWaitlistSubmission(parsed.data);

    return NextResponse.json({
      ok: true,
      message: "Application received.",
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "We could not save your request right now. Please try again.",
      },
      { status: 500 },
    );
  }
}
