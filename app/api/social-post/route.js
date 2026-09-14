
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const PLATFORM_URLS = {
  Instagram: "https://www.instagram.com/",
  Facebook: "https://www.facebook.com/",
  Telegram: "https://web.telegram.org/",
  Reddit: "https://www.reddit.com/",
  "X.com": "https://x.com/",
};

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function createPlatformCard(platform, content, url) {
  const safePlatform = escapeHtml(platform);
  const safeContent = escapeHtml(content);

  return `
    <div style="
      background:#ffffff;
      border:1px solid #e5e7eb;
      border-radius:16px;
      margin:0 0 20px 0;
      overflow:hidden;
    ">

      <div style="
        padding:18px 20px;
        border-bottom:1px solid #eef0f3;
        background:#fafafa;
      ">
        <div style="
          font-size:18px;
          font-weight:700;
          color:#111827;
          margin-bottom:4px;
        ">
          ${safePlatform}
        </div>

        <div style="
          font-size:13px;
          color:#6b7280;
        ">
          Platform-specific content
        </div>
      </div>

      <div style="padding:20px;">

        <div style="
          background:#f8fafc;
          border:1px solid #e5e7eb;
          border-radius:12px;
          padding:16px;
          color:#1f2937;
          font-size:14px;
          line-height:1.7;
          white-space:pre-wrap;
          word-break:break-word;
          font-family:Arial,Helvetica,sans-serif;
        ">${safeContent}</div>

        <div style="margin-top:16px;">
          <a
            href="${url}"
            target="_blank"
            style="
              display:inline-block;
              background:#111827;
              color:#ffffff;
              text-decoration:none;
              padding:11px 17px;
              border-radius:9px;
              font-size:14px;
              font-weight:600;
            "
          >
            Open ${safePlatform} →
          </a>
        </div>

      </div>
    </div>
  `;
}

function createEmailHtml(content) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Social Media Content</title>
</head>

<body style="
  margin:0;
  padding:0;
  background:#f3f4f6;
  font-family:Arial,Helvetica,sans-serif;
  color:#111827;
">

  <div style="
    width:100%;
    background:#f3f4f6;
    padding:30px 12px;
    box-sizing:border-box;
  ">

    <div style="
      max-width:680px;
      margin:0 auto;
    ">

      <!-- Header -->

      <div style="
        background:#111827;
        border-radius:18px 18px 0 0;
        padding:28px 24px;
        color:#ffffff;
      ">

        <div style="
          font-size:13px;
          font-weight:600;
          color:#c7d2fe;
          text-transform:uppercase;
          letter-spacing:1px;
          margin-bottom:8px;
        ">
          LibDesk AI Headshots
        </div>

        <div style="
          font-size:26px;
          line-height:1.25;
          font-weight:800;
        ">
          Your Social Media Content
        </div>

        <div style="
          margin-top:9px;
          font-size:14px;
          line-height:1.6;
          color:#d1d5db;
        ">
          Fresh platform-specific content generated for your next post.
        </div>

      </div>

      <!-- Content -->

      <div style="
        background:#f9fafb;
        padding:24px 18px;
      ">

        ${createPlatformCard(
          "Instagram",
          content.instagram,
          PLATFORM_URLS.Instagram
        )}

        ${createPlatformCard(
          "Facebook",
          content.facebook,
          PLATFORM_URLS.Facebook
        )}

        ${createPlatformCard(
          "Telegram",
          content.telegram,
          PLATFORM_URLS.Telegram
        )}

        ${createPlatformCard(
          "Reddit",
          content.reddit,
          PLATFORM_URLS.Reddit
        )}

        ${createPlatformCard(
          "X.com",
          content.x,
          PLATFORM_URLS["X.com"]
        )}

      </div>

      <!-- Footer -->

      <div style="
        background:#ffffff;
        border-radius:0 0 18px 18px;
        padding:22px 20px;
        text-align:center;
        border-top:1px solid #e5e7eb;
      ">

        <div style="
          font-size:12px;
          color:#9ca3af;
          line-height:1.6;
        ">
          Generated automatically by your LibDesk AI Headshots
          social-content automation.
        </div>

      </div>

    </div>

  </div>

</body>
</html>
  `;
}

export async function GET(request) {
  try {
    // -----------------------------------------
    // 1. Protect cron endpoint
    // -----------------------------------------

    const authHeader = request.headers.get("authorization");

    if (
      !authHeader ||
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // -----------------------------------------
    // 2. Generate platform-specific content
    // -----------------------------------------

    const geminiResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/interactions",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },

        body: JSON.stringify({
          model: "gemini-3.5-flash-lite",

          input: `
You are the social media content strategist for an AI professional headshot SaaS.

PRODUCT:

The product helps people create professional-looking headshots from their
own photos using AI.

The main audience includes:

- Job seekers
- Students
- Professionals
- Freelancers
- Founders
- Creators
- People improving their LinkedIn/profile photos

The product focuses on professional appearance while preserving the person's
identity and facial characteristics.

YOUR TASK:

Create ONE fresh social media content package.

IMPORTANT:

Do NOT write one generic post and reuse it on every platform.

Write a completely platform-specific piece of content for each platform.

Platforms:

1. Instagram
2. Facebook
3. Telegram
4. Reddit
5. X.com

PLATFORM RULES:

INSTAGRAM:
- Short-to-medium caption.
- Strong opening hook.
- Natural and visual.
- Suitable for an AI headshot/product post.
- Use a few relevant hashtags.
- Avoid excessive hashtags.
- Do not sound like spam.

FACEBOOK:
- Conversational and easy to read.
- Can be slightly longer.
- Encourage discussion or engagement.
- Suitable for professional and general audiences.
- Avoid sounding like an aggressive advertisement.

TELEGRAM:
- Short and direct.
- Useful and easy to scan.
- Suitable for a Telegram channel.
- Include a clear reason someone should care.
- Keep it concise.

REDDIT:
- This is NOT an advertisement.
- Write like a genuine Reddit post.
- Lead with an interesting problem, observation, question, experiment,
  lesson, or useful information related to professional headshots,
  personal branding, job searching, or AI photography.
- Mention the product only naturally when appropriate.
- Do not use marketing language such as "Buy now", "Limited offer",
  "Revolutionary", etc.
- Do not pretend to be a customer.
- Do not fabricate personal experiences.

X.COM:
- Concise.
- Strong first line.
- Interesting enough to make someone stop scrolling.
- Suitable for a single post.
- Avoid excessive hashtags.
- Can mention AI, professional headshots, personal branding, careers,
  or profile photos.

CONTENT QUALITY:

- Every platform must have DIFFERENT wording and structure.
- Do not make unrealistic claims.
- Do not claim guaranteed jobs, interviews, followers, or success.
- Do not invent statistics.
- Do not use fake testimonials.
- Do not pretend that the product has features that were not described.
- Avoid generic AI marketing phrases.
- Make the content useful, interesting and natural.
- Vary the topic and angle between runs.
- Sometimes educate.
- Sometimes give a practical tip.
- Sometimes discuss personal branding.
- Sometimes discuss professional photography.
- Sometimes discuss AI photography.
- Sometimes softly mention the product.

IMPORTANT FOR REDDIT:

Never write "I built this" unless the post is explicitly written from
the founder's perspective.

OUTPUT:

Return ONLY valid JSON.

Use exactly this structure:

{
  "instagram": "Instagram content here",
  "facebook": "Facebook content here",
  "telegram": "Telegram content here",
  "reddit": "Reddit content here",
  "x": "X.com content here"
}

Do not wrap the JSON in markdown.
Do not add explanations before or after the JSON.
          `,
        }),
      }
    );

    // -----------------------------------------
    // 3. Check Gemini response
    // -----------------------------------------

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();

      console.error("Gemini API error:", errorText);

      return NextResponse.json(
        {
          success: false,
          error: "Gemini API request failed",
        },
        { status: 500 }
      );
    }

    const geminiData = await geminiResponse.json();

    // -----------------------------------------
    // 4. Extract model output
    // -----------------------------------------

    const outputStep = geminiData?.steps?.find(
      (step) => step.type === "model_output"
    );

    const rawText = outputStep?.content
      ?.filter((item) => item.type === "text")
      ?.map((item) => item.text)
      ?.join("\n")
      ?.trim();

    if (!rawText) {
      console.error("No text returned by Gemini:", geminiData);

      return NextResponse.json(
        {
          success: false,
          error: "Gemini returned no text",
        },
        { status: 500 }
      );
    }

    // -----------------------------------------
    // 5. Parse JSON
    // -----------------------------------------

    let content;

    try {
      // Remove accidental markdown fences if Gemini adds them.
      const cleanedText = rawText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      content = JSON.parse(cleanedText);
    } catch (error) {
      console.error("Failed to parse Gemini JSON:", rawText);

      return NextResponse.json(
        {
          success: false,
          error: "Gemini returned invalid JSON",
        },
        { status: 500 }
      );
    }

    // -----------------------------------------
    // 6. Validate required fields
    // -----------------------------------------

    const requiredFields = [
      "instagram",
      "facebook",
      "telegram",
      "reddit",
      "x",
    ];

    for (const field of requiredFields) {
      if (
        typeof content[field] !== "string" ||
        !content[field].trim()
      ) {
        console.error(`Missing Gemini field: ${field}`, content);

        return NextResponse.json(
          {
            success: false,
            error: `Missing ${field} content`,
          },
          { status: 500 }
        );
      }
    }

    // -----------------------------------------
    // 7. Create beautiful HTML email
    // -----------------------------------------

    const html = createEmailHtml(content);

    // -----------------------------------------
    // 8. Send email using Resend
    // -----------------------------------------

    const { data: emailData, error: emailError } =
      await resend.emails.send({
        from: "AI Headshots <ai@libdesk.online>",
        to: ["hellobittukumar12@gmail.com"],
        subject: "Your New Social Media Content",
        html,
      });

    if (emailError) {
      console.error("Resend error:", emailError);

      return NextResponse.json(
        {
          success: false,
          error: "Failed to send email",
        },
        { status: 500 }
      );
    }

    // -----------------------------------------
    // 9. Success
    // -----------------------------------------

    console.log("Social content email sent:", emailData);

    return NextResponse.json({
      success: true,
      message: "Social content generated and email sent",
      emailId: emailData?.id,
    });
  } catch (error) {
    console.error("Social post route error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

