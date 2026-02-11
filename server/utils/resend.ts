import { Resend } from "resend";

let resendClient: Resend | null = null;

export const getResend = (): Resend => {
  if (!resendClient) {
    const config = useRuntimeConfig();
    resendClient = new Resend(config.resendApiKey);
  }
  return resendClient;
};
