
import { cookies } from "next/headers";
import {
  getIronSession,
  type SessionOptions,
} from "iron-session";

export type GmailSessionData = {
  pendingGoogleOAuth?: {
    state: string;
    codeVerifier: string;
    createdAt: number;
  };

  gmailTokens?: {
    accessToken: string;
    refreshToken?: string;
    expiryDate?: number;
  };
};

export async function getGmailSession() {
  const password = process.env.SESSION_PASSWORD;

  if (!password || password.length < 32) {
    throw new Error(
      "SESSION_PASSWORD must contain at least 32 characters."
    );
  }

  const options: SessionOptions = {
    password,
    cookieName: "outreach-gmail-session",
    ttl: 60 * 60 * 24,
    cookieOptions: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    },
  };

  return getIronSession<GmailSessionData>(
    await cookies(),
    options
  );
}
