export const heroContent = {
  title: "Zrow keeps AI agents inside your real coding workflow.",
  description:
    "A local-first desktop environment for people who want delegation, real tools, and explicit control over automation.",
  primaryCta: "Join beta",
} as const;

export const capabilitiesContent = {
  title: "What Zrow helps with",
} as const;

export const capabilityItems = [
  {
    title: "Delegate real work",
    body:
      "Break larger tasks into bounded runs instead of forcing one chat thread to do everything.",
  },
  {
    title: "Keep tools close",
    body:
      "Work with files, terminal commands, and context in one place instead of juggling tabs and pasted snippets.",
  },
  {
    title: "Control the risk",
    body:
      "Use explicit approval flows and policies instead of treating every tool call as equally safe.",
  },
] as const;

export const betaExplainerContent = {
  title: "Limited beta, reviewed manually.",
  body:
    "We are keeping the preview small on purpose. Applications are reviewed manually and invites go out in waves based on fit, use case, and timing.",
  bullets: ["No auto-accept", "No automatic email", "Manual follow-up only"],
} as const;

export const waitlistContent = {
  title: "Join the waitlist.",
  body:
    "Tell us who you are, how you work, and why you want early access.",
  fields: [
    "Name",
    "Email",
    "Role",
    "Use case",
    "Contact handle",
    "Referral source",
  ],
  note: "The editable form will appear here next.",
} as const;

export const siteFooterContent = {
  label: "Zrow",
  caption: "beta waitlist",
} as const;
