import { NextRequest, NextResponse } from "next/server";

// Lazy initialization to avoid build-time errors
function getResend() {
  const { Resend } = require("resend");
  return new Resend(process.env.RESEND_API_KEY);
}

// Audience ID for waitlist signups (create in Resend dashboard)
const WAITLIST_AUDIENCE_ID = process.env.RESEND_WAITLIST_AUDIENCE_ID;

export async function POST(request: NextRequest) {
  try {
    const { email, list } = await request.json();

    if (!email || !list) {
      return NextResponse.json(
        { error: "Email and list are required" },
        { status: 400 }
      );
    }

    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
      console.log("Waitlist signup (no Resend key):", { email, list });
      return NextResponse.json({ success: true });
    }

    const resend = getResend();

    // Add to Resend audience with list tag
    if (WAITLIST_AUDIENCE_ID) {
      try {
        await resend.contacts.create({
          email,
          audienceId: WAITLIST_AUDIENCE_ID,
          firstName: "",
          lastName: "",
          unsubscribed: false,
        });
      } catch (e) {
        console.error("Failed to add contact:", e);
      }
    }

    // Send confirmation email
    await resend.emails.send({
      from: "IntelligentSPM <noreply@intelligentspm.com>",
      to: email,
      subject: getSubjectByList(list),
      html: getEmailHtml(list, email),
    });

    // Also notify Todd
    await resend.emails.send({
      from: "IntelligentSPM <noreply@intelligentspm.com>",
      to: "todd@intelligentspm.com",
      subject: `New Waitlist Signup: ${list}`,
      html: `
        <p>New waitlist signup:</p>
        <ul>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>List:</strong> ${list}</li>
          <li><strong>Time:</strong> ${new Date().toISOString()}</li>
        </ul>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Waitlist signup error:", error);
    return NextResponse.json(
      { error: "Failed to process signup" },
      { status: 500 }
    );
  }
}

function getSubjectByList(list: string): string {
  const subjects: Record<string, string> = {
    "podcast": "You're on the Podcast waitlist",
    "videos": "You're on the Videos waitlist",
    "magic-wave": "You're on The Magic Wave waitlist",
    "sit-down": "You're on The Sit-Down waitlist",
    "healthcheck-spm": "You're on the SPM Healthcheck waitlist",
    "healthcheck-comp-plan": "You're on the Plan Analyzer waitlist",
    "healthcheck-governance": "You're on the Governance Checker waitlist",
    "healthcheck-askspm": "You're on the AskSPM waitlist",
  };
  return subjects[list] || "You're on the IntelligentSPM waitlist";
}

function getEmailHtml(list: string, email: string): string {
  const listNames: Record<string, string> = {
    "podcast": "The Toddfather Podcast",
    "videos": "The Toddfather Videos",
    "magic-wave": "The Magic Wave 2026",
    "sit-down": "The Sit-Down",
    "healthcheck-spm": "SPM Healthcheck",
    "healthcheck-comp-plan": "Comp Plan Analyzer",
    "healthcheck-governance": "Governance Checker",
    "healthcheck-askspm": "AskSPM",
  };

  const productName = listNames[list] || "IntelligentSPM";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0F172A; color: #E2E8F0; padding: 40px 20px;">
      <div style="max-width: 500px; margin: 0 auto;">
        <h1 style="color: #E2E8F0; font-size: 24px; margin-bottom: 20px;">You're on the list.</h1>

        <p style="color: #94A3B8; line-height: 1.6;">
          Thanks for signing up for <strong style="color: #FF8737;">${productName}</strong>.
          We'll notify you at <strong>${email}</strong> as soon as it's ready.
        </p>

        <p style="color: #94A3B8; line-height: 1.6;">
          In the meantime, connect with The Toddfather on
          <a href="https://www.linkedin.com/in/thetoddfather" style="color: #38BDF8;">LinkedIn</a>
          for SPM insights and updates.
        </p>

        <hr style="border: none; border-top: 1px solid #1E293B; margin: 30px 0;">

        <p style="color: #64748B; font-size: 12px;">
          IntelligentSPM • SPM Reality, No Spin
        </p>
      </div>
    </body>
    </html>
  `;
}
