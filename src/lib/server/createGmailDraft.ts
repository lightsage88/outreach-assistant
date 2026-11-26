
import { google } from "googleapis";

import { createGoogleOAuthClient } from "./googleOAuth";
import { getGmailSession } from "./gmailSession";

export class GmailNotConnectedError extends Error {
  constructor() {
    super("Gmail is not connected. Please reconnect.");
  }
}

export async function createGmailDraft(
  raw: string
): Promise<string> {
  const session = await getGmailSession();
  const stored = session.gmailTokens;

  if (!stored?.accessToken && !stored?.refreshToken) {
    throw new GmailNotConnectedError();
  }

  const auth = createGoogleOAuthClient();

  auth.setCredentials({
    access_token: stored.accessToken,
    refresh_token: stored.refreshToken,
    expiry_date: stored.expiryDate,
  });

  const gmail = google.gmail({
    version: "v1",
    auth,
  });

  // Creates a draft. Does NOT send the message.
  const response = await gmail.users.drafts.create({
    // "me" is a special identifier that refers to the authenticated user
    userId: "me",
    requestBody: {
      message: {
        raw,
      },
    },
  });

  // Preserve refreshed credentials if Google renewed them.
  const latest = auth.credentials;

  if (
    latest.access_token &&
    (
      latest.access_token !== stored.accessToken ||
      latest.expiry_date !== stored.expiryDate
    )
  ) {
    session.gmailTokens = {
      accessToken: latest.access_token,
      ...(latest.refresh_token || stored.refreshToken
        ? {
            refreshToken:
              latest.refresh_token ?? stored.refreshToken,
          }
        : {}),
      ...(latest.expiry_date
        ? { expiryDate: latest.expiry_date }
        : {}),
    };

    await session.save();
  }

  if (!response.data.id) {
    throw new Error("Gmail did not return a draft ID.");
  }

  return response.data.id;
}
