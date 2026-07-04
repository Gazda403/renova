import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, phone, email, message } = await request.json();

    // 1. Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Ime, email i poruka su obavezna polja." },
        { status: 400 }
      );
    }

    // 2. Fetch destination email from environment variables (fallback to default)
    const toEmail = process.env.CONTACT_RECEIVER_EMAIL || "info@renovabih.com";

    // 3. Trigger email send via Resend client
    const { data, error } = await resend.emails.send({
      from: "ReNova Web Form <onboarding@resend.dev>",
      to: [toEmail],
      subject: `Novi upit sa sajta: ${name}`,
      replyTo: email,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #111; max-width: 600px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #3B82F6; margin-top: 0; border-bottom: 2px solid #3B82F6; padding-bottom: 10px;">Novi Upit — ReNova</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 120px;">Ime i prezime:</td>
              <td style="padding: 8px 0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Telefon:</td>
              <td style="padding: 8px 0;">${phone ? `<a href="tel:${phone}" style="color: #3B82F6; text-decoration: none;">${phone}</a>` : "Nije navedeno"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Email adresa:</td>
              <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #3B82F6; text-decoration: none;">${email}</a></td>
            </tr>
          </table>

          <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 5px; border-left: 4px solid #3B82F6;">
            <p style="margin: 0; font-weight: bold; margin-bottom: 8px; color: #555;">Poruka / opis projekta:</p>
            <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>

          <p style="font-size: 11px; color: #999; margin-top: 30px; text-align: center; border-top: 1px solid #eee; padding-top: 15px;">
            Ova poruka je automatski generisana i poslata sa kontakt forme na renovabih.com.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    console.error("Internal Server Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Došlo je do greške prilikom slanja poruke.";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
