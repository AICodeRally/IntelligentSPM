import { NextRequest, NextResponse } from "next/server";
import { getResend, isResendConfigured } from "@/lib/resend";

// Audience ID for The Syndicate newsletter
const SYNDICATE_AUDIENCE_ID = process.env.RESEND_SYNDICATE_AUDIENCE_ID;

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if Resend is configured
    if (!isResendConfigured()) {
      console.log("Syndicate signup (no Resend key):", { email });
      return NextResponse.json({ success: true });
    }

    const resend = await getResend();

    // Add to Resend audience
    if (SYNDICATE_AUDIENCE_ID) {
      try {
        await resend.contacts.create({
          email,
          audienceId: SYNDICATE_AUDIENCE_ID,
          firstName: "",
          lastName: "",
          unsubscribed: false,
        });
      } catch (e) {
        console.error("Failed to add contact:", e);
      }
    }

    // Send welcome email
    await resend.emails.send({
      from: "The Toddfather <todd@intelligentspm.com>",
      to: email,
      subject: "Welcome to The Syndicate",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0F172A; color: #E2E8F0; padding: 40px 20px;">
          <div style="max-width: 500px; margin: 0 auto;">
            <h1 style="color: #FF8737; font-size: 28px; margin-bottom: 20px;">Welcome to The Syndicate.</h1>

            <p style="color: #94A3B8; line-height: 1.6;">
              You're in. Every Tuesday, you'll get the real story on SPM—what works, what breaks,
              and what the vendors won't tell you.
            </p>

            <h3 style="color: #E2E8F0; font-size: 16px; margin-top: 30px;">What you'll get:</h3>
            <ul style="color: #94A3B8; line-height: 1.8; padding-left: 20px;">
              <li><strong style="color: #E2E8F0;">Weekly Digest</strong> — SPM reality, delivered</li>
              <li><strong style="color: #E2E8F0;">Office Hours</strong> — Monthly Q&A sessions</li>
              <li><strong style="color: #E2E8F0;">Early Access</strong> — Tools and benchmarks first</li>
              <li><strong style="color: #E2E8F0;">The Network</strong> — Connect with SPM professionals</li>
            </ul>

            <p style="color: #94A3B8; line-height: 1.6; margin-top: 30px;">
              Questions? Just reply to this email.
            </p>

            <p style="color: #E2E8F0; margin-top: 30px;">
              — The Toddfather
            </p>

            <hr style="border: none; border-top: 1px solid #1E293B; margin: 30px 0;">

            <p style="color: #64748B; font-size: 12px;">
              IntelligentSPM • SPM Reality, No Spin<br>
              <a href="https://www.linkedin.com/in/thetoddfather" style="color: #38BDF8;">LinkedIn</a>
            </p>
          </div>
        </body>
        </html>
      `,
    });

    // Notify Todd
    await resend.emails.send({
      from: "IntelligentSPM <noreply@intelligentspm.com>",
      to: "todd@intelligentspm.com",
      subject: "New Syndicate Subscriber",
      html: `
        <p>New Syndicate subscriber:</p>
        <ul>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Time:</strong> ${new Date().toISOString()}</li>
        </ul>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}
