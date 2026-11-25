
import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";

import {
  createGoogleOAuthClient,
  GMAIL_SCOPES,
} from "@/lib/server/googleOAuth";

import { getGmailSession } from "@/lib/server/gmailSession";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return new Response("Not found", { status: 404 });
  }

  const client = createGoogleOAuthClient();

  // Google's library generates the PKCE verifier
  // and corresponding SHA-256 challenge.
  const { codeVerifier, codeChallenge } =
    await client.generateCodeVerifierAsync();

  // This random state protects against OAuth CSRF.
  const state = randomBytes(32).toString("base64url");

  const session = await getGmailSession();

  session.pendingGoogleOAuth = {
    state,
    codeVerifier,
    createdAt: Date.now(),
  };

  await session.save();

  const authorizationUrl = client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: GMAIL_SCOPES,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  return NextResponse.redirect(authorizationUrl);
}
