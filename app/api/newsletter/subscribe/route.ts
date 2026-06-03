// app/api/newsletter/subscribe/route.ts
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { z } from "zod";
import { Resend } from "resend";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = schema.parse(body);

    const supabase = await createAdminClient();

    const { error } = await supabase
      .from("newsletter_subscribers")
      .upsert({ email, is_active: true }, { onConflict: "email" });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "You're already subscribed!" },
          { status: 400 }
        );
      }
      throw error;
    }

    // Send welcome email via Resend (optional)
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "hello@nexthub.app",
        to: email,
        subject: "Welcome to NextHub! 🎉",
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h1 style="font-size: 24px; margin-bottom: 16px;">Welcome to NextHub!</h1>
            <p style="color: #666; margin-bottom: 16px;">
              Thanks for subscribing. You'll receive weekly updates on the best 
              tools, services, and resources from across the web.
            </p>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}" 
               style="display: inline-block; background: #5B4CF6; color: white; 
                      padding: 12px 24px; border-radius: 8px; text-decoration: none;">
              Explore NextHub →
            </a>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }
    console.error("Newsletter error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
