import { NextRequest, NextResponse } from "next/server";
import { getResend, isResendConfigured } from "@/lib/resend";

export async function POST(request: NextRequest) {
  try {
    const { name, email, company, topic, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const topicLabels: Record<string, string> = {
      speaking: "Speaking Engagement",
      consulting: "Consulting Project",
      askspm: "Custom AskSPM",
      other: "Other",
    };

    const topicLabel = topicLabels[topic] || topic || "General Inquiry";

    // Check if Resend is configured
    if (!isResendConfigured()) {
      console.log("Contact form (no Resend key):", { name, email, company, topic, message });
      return NextResponse.json({ success: true });
    }

    const resend = await getResend();

    // Send to Todd
    await resend.emails.send({
      from: "IntelligentSPM <noreply@intelligentspm.com>",
      to: "todd@intelligentspm.com",
      replyTo: email,
      subject: `Contact Form: ${topicLabel} from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px;">
          <h2 style="color: #0F172A;">New Contact Form Submission</h2>

          <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #E2E8F0; color: #64748B; width: 120px;">Name</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #E2E8F0; color: #0F172A;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #E2E8F0; color: #64748B;">Email</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #E2E8F0; color: #0F172A;">
                <a href="mailto:${email}" style="color: #38BDF8;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #E2E8F0; color: #64748B;">Company</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #E2E8F0; color: #0F172A;">${company || "Not provided"}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #E2E8F0; color: #64748B;">Topic</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #E2E8F0; color: #0F172A;">${topicLabel}</td>
            </tr>
          </table>

          <h3 style="color: #0F172A; margin-top: 30px;">Message</h3>
          <div style="background: #F8FAFC; padding: 20px; border-radius: 8px; color: #0F172A; white-space: pre-wrap;">${message}</div>

          <p style="color: #64748B; font-size: 12px; margin-top: 30px;">
            Submitted at ${new Date().toISOString()}
          </p>
        </body>
        </html>
      `,
    });

    // Send confirmation to user
    await resend.emails.send({
      from: "The Toddfather <todd@intelligentspm.com>",
      to: email,
      subject: "Thanks for reaching out",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0F172A; color: #E2E8F0; padding: 40px 20px;">
          <div style="max-width: 500px; margin: 0 auto;">
            <h1 style="color: #E2E8F0; font-size: 24px; margin-bottom: 20px;">Got it, ${name.split(" ")[0]}.</h1>

            <p style="color: #94A3B8; line-height: 1.6;">
              Thanks for reaching out. I'll get back to you soon.
            </p>

            <p style="color: #94A3B8; line-height: 1.6;">
              In the meantime, you can connect with me on
              <a href="https://www.linkedin.com/in/thetoddfather" style="color: #38BDF8;">LinkedIn</a>.
            </p>

            <p style="color: #E2E8F0; margin-top: 30px;">
              — The Toddfather
            </p>

            <hr style="border: none; border-top: 1px solid #1E293B; margin: 30px 0;">

            <p style="color: #64748B; font-size: 12px;">
              IntelligentSPM • SPM Reality, No Spin
            </p>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
