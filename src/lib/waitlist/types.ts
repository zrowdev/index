export type WaitlistInput = {
  name: string;
  email: string;
  role: string;
  useCase: string;
  contact: string;
  referral: string;
};

export type WaitlistErrors = Partial<Record<keyof WaitlistInput, string>>;

export type ParsedWaitlistInput = WaitlistInput;
