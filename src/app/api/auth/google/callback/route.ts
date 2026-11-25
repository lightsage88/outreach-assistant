
import { NextResponse } from "next/server";

import {
  createGoogleOAuthClient,
} from "@/lib/server/googleOAuth";

import { getGmailSession } from "@/lib/server/gmailSession";

export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return new Response("Not found", { status: 404 });
  }

  const url = new URL(request.url);

  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  const session = await getGmailSession();
  const pending = session.pendingGoogleOAuth;

  // Verify that this callback belongs to an
  // authorization request started by our app.
  if (
    !pending ||
    !state ||
    state !== pending.state ||
    Date.now() - pending.createdAt > 10 * 60 * 1000
  ) {
    return new Response(
      "Invalid or expired OAuth request. Please reconnect.",
      { status: 400 }
    );
  }

  // Prevent the authorization state from being reused.
  delete session.pendingGoogleOAuth;

  if (error) {
    await session.save();

    return NextResponse.redirect(
      new URL("/workspace?gmail=denied", request.url)
    );
  }

  if (!code) {
    await session.save();

    return new Response(
      "Google did not return an authorization code.",
      { status: 400 }
    );
  }

  try {
    const client = createGoogleOAuthClient();

    // Exchange the one-time authorization code
    // using the original PKCE verifier.
    const { tokens } = await client.getToken({
      code,
      codeVerifier: pending.codeVerifier,
    });

    if (!tokens.access_token) {
      throw new Error("Missing access token.");
    }

    // Store credentials only in the protected session.
    // Preserve a previous refresh token if Google
    // doesn't issue a new one.
    const refreshToken =
      tokens.refresh_token ??
      session.gmailTokens?.refreshToken;

    session.gmailTokens = {
      accessToken: tokens.access_token,
      ...(refreshToken
        ? { refreshToken }
        : {}),
      ...(tokens.expiry_date
        ? { expiryDate: tokens.expiry_date }
        : {}),
    };

    await session.save();

    // Redirect away from the URL containing the
    // sensitive authorization code.
    return NextResponse.redirect(
      new URL("/workspace?gmail=connected", request.url)
    );
  } catch {
    await session.save();

    return new Response(
      "Google authorization failed. Please try connecting again.",
      { status: 502 }
    );
  }
}
