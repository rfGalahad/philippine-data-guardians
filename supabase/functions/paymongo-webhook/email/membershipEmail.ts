function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function membershipEmail(
  memberName: string,
  memberEmail: string, 
  memberId?: string,
  logoUrl?: string,
  membershipType: string = "Member",
  memberSince: Date = new Date(),
  idDownloadUrl: string | null = null,
  idAttached = false
): string {
  
  const name = memberName ? escapeHtml(memberName) : "";
  const id = memberId ? escapeHtml(memberId) : "";
  const type = escapeHtml(membershipType);
  const since = memberSince.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Manila",
  });

  const detailRow = (label: string, value: string) => `
                      <tr>
                        <td style="padding:2px 0;color:#64748b;width:40%;">${label}</td>
                        <td style="padding:2px 0;color:#0a2744;font-weight:700;">${value}</td>
                      </tr>`;

  const detailRows = [
    id ? detailRow("Member ID", id) : "",
    name ? detailRow("Name", name) : "",
    detailRow("Membership type", type),
    detailRow("Member since", since),
  ].join("");

  const idBlock = idAttached
    ? `<p style="font-size:14px;color:#334155;line-height:1.7;margin:0 0 16px;">
         Your digital Membership ID is attached to this email as a PDF. Please save it for your records.
       </p>
       ${
         idDownloadUrl
           ? `<table cellpadding="0" cellspacing="0" style="margin:0 0 8px;">
                <tr>
                  <td style="background:#0a3d6b;border-radius:6px;">
                    <a href="${escapeHtml(idDownloadUrl)}" style="display:inline-block;padding:12px 20px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">
                      Download your ID
                    </a>
                  </td>
                </tr>
              </table>
              <p style="font-size:12px;color:#94a3b8;margin:0;">This link expires in 7 days.</p>`
           : ""
       }`
    : `<p style="font-size:14px;color:#334155;line-height:1.7;margin:0;">
         We're preparing your digital Membership ID and will send it to you shortly.
       </p>`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>You're a Member of Philippine Data Guardians</title>
</head>
<body style="margin:0;padding:0;background:#f0f2f5;font-family:Inter,Helvetica,Arial,sans-serif;">

  <!-- Preheader (hidden inbox preview text) -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;font-size:1px;line-height:1px;color:#f0f2f5;">
    Your membership is confirmed. Here's your member ID and what you get as a member.
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f2f5;padding:16px 0;">
    <tr>
      <td align="center" style="padding:0 8px;">
        <table cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:0px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#0a3d6b;padding:16px 24px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  ${
                    logoUrl
                      ? `<td style="padding-right:12px;">
                    <img src="${logoUrl}" alt="Philippine Data Guardians" width="26" height="32" style="display:block;border:0;" />
                  </td>`
                      : ""
                  }
                  <td>
                    <span style="font-size:18px;font-weight:700;color:#ffffff;">Philippine Data Guardians</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Accent bar (solid fallback + gradient) -->
          <tr>
            <td style="height:3px;line-height:3px;background:#f59e0b;background-image:linear-gradient(90deg,#fbbf24,#f59e0b,#fbbf24);font-size:0;">&nbsp;</td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 32px 24px;">
              <h1 style="font-size:24px;font-weight:700;color:#0a2744;margin:0 0 8px;line-height:1.3;">
                You're officially a PDG member!
              </h1>
              <p style="font-size:15px;color:#64748b;margin:0;line-height:1.6;">
                ${name ? `Hi <strong>${name}</strong>, your` : "Your"} registration as a Member of <strong>Philippine Data Guardians</strong> has been confirmed. Keep your membership details below for future reference.
              </p>
            </td>
          </tr>

          <!-- Membership details -->
          <tr>
            <td style="padding:0 32px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafd;border:1px solid #e8edf3;border-radius:6px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="font-size:15px;font-weight:700;color:#0a2744;margin:0 0 10px;">Membership details</p>
                    <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.6;">${detailRows}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Digital ID -->
          <tr>
            <td style="padding:0 32px 28px;">
              ${idBlock}
            </td>
          </tr>

          <!-- Support + Facebook -->
          <tr>
            <td style="padding:0 32px 32px;">
              <p style="font-size:14px;color:#334155;line-height:1.7;margin:0 0 8px;">
                <strong style="color:#0a2744;">Need help?</strong> Email us at
                <a href="mailto:info@philippinedataguardians.org" style="color:#1565a8;text-decoration:none;">info@philippinedataguardians.org</a>.
              </p>
              <p style="font-size:14px;color:#334155;line-height:1.7;margin:0;">
                <strong style="color:#0a2744;">Join the community.</strong> Follow us on
                <a href="https://www.facebook.com/profile.php?id=61578893785140" style="color:#1565a8;text-decoration:none;font-weight:700;">Facebook</a>
                for news, events, and announcements.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafd;border-top:1px solid #e8edf3;padding:20px 32px;text-align:center;">
              <p style="font-size:12px;color:#94a3b8;line-height:1.8;margin:0;">
                You received this email because you registered as a member of Philippine Data Guardians.
              </p>
              <p style="font-size:12px;color:#94a3b8;line-height:1.8;margin:0;">
                &copy; ${new Date().getFullYear()} Philippine Data Guardians &middot; All rights reserved &middot; Securing your digital future.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `.trim();
}