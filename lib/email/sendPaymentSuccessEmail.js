import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPaymentSuccessEmail({
  email,
  name,
  planName,
  coins,
  amount,
  currency,
  paymentId,
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Libdesk <noreply@libdesk.online>",
      to: [email],
      subject: "Payment successful — Your Libdesk coins are ready",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2>Payment Successful 🎉</h2>

          <p>Hi ${name || "there"},</p>

          <p>
            Your payment was successfully completed and your Libdesk coins
            have been added to your account.
          </p>

          <div style="
            background:#f5f5f5;
            padding:20px;
            border-radius:10px;
            margin:20px 0;
          ">
            <p><strong>Plan:</strong> ${planName}</p>
            <p><strong>Coins added:</strong> ${coins}</p>
            <p><strong>Amount:</strong> ${currency} ${(amount / 100).toFixed(2)}</p>
            <p><strong>Payment ID:</strong> ${paymentId}</p>
          </div>

          <p>
            You can now use your coins to generate professional AI headshots.
          </p>

          <p>
            Thanks for using Libdesk!
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Payment email error:", error);
      return { success: false, error };
    }

    return {
      success: true,
      emailId: data?.id,
    };
  } catch (error) {
    console.error("Payment email exception:", error);

    return {
      success: false,
      error,
    };
  }
}