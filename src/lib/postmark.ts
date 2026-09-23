const POSTMARK_API = "https://api.postmarkapp.com/email";

export type PostmarkConfig = {
  token: string;
  from: string;
  adminTo: string;
};

export function getPostmarkConfig(): PostmarkConfig | null {
  const token = process.env.POSTMARK_SERVER_TOKEN;
  const from = process.env.POSTMARK_FROM_EMAIL;
  const adminTo = process.env.POSTMARK_TO_EMAIL;

  if (!token || !from || !adminTo) {
    return null;
  }

  return { token, from, adminTo };
}

type SendEmailInput = {
  token: string;
  from: string;
  to: string;
  subject: string;
  textBody: string;
  htmlBody?: string;
  replyTo?: string;
};

export async function sendPostmarkEmail(
  input: SendEmailInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const response = await fetch(POSTMARK_API, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Postmark-Server-Token": input.token,
    },
    body: JSON.stringify({
      From: input.from,
      To: input.to,
      Subject: input.subject,
      TextBody: input.textBody,
      HtmlBody: input.htmlBody,
      ReplyTo: input.replyTo,
    }),
  });

  if (!response.ok) {
    return { ok: false, error: await response.text() };
  }

  return { ok: true };
}
