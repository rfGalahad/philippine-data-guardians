export function subscriptionEmail(
  planName: string, 
  actionLink: string, 
  logoUrl?: string,
  isExisting: boolean = false
): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Philippine Data Guardians</title>
</head>
<body style="margin:0;padding:0;background:#f0f2f5;font-family:Inter,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f2f5;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#0a3d6b;padding:24px 32px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    ${logoUrl ? `<img src="${logoUrl}" alt="Philippine Data Guardians" height="32" style="display:block;margin-right:12px;" />` : ""}
                  </td>
                  <td>
                    <span style="font-size:18px;font-weight:700;color:#ffffff;">Philippine Data Guardians</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Accent bar -->
          <tr>
            <td style="height:3px;background:linear-gradient(90deg,#fbbf24,#f59e0b,#fbbf24);font-size:0;">&nbsp;</td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 32px 32px;">

              <h1 style="font-size:24px;font-weight:700;color:#0a2744;margin:0 0 8px;line-height:1.3;">
                ${isExisting ? "Welcome back" : "Welcome aboard"}  
              </h1>
              <p style="font-size:15px;color:#64748b;margin:0 0 0;line-height:1.6;">
                ${isExisting
                  ? `Your <strong>${planName}</strong> account already exists.`
                  : `Your <strong>${planName}</strong> subscription for the Privacy Impact Assessment service is now active.`
                }
              </p>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
                <tr>
                  <td style="border-top:1px solid #e8edf3;font-size:0;">&nbsp;</td>
                </tr>
              </table>

              <!-- CTA -->
              <p style="font-size:14px;color:#475569;text-align:center;margin:0 0 20px;line-height:1.6;">
                ${isExisting
                  ? "Click below to sign in to your existing account."
                  : "Click below to set your password and access your account."
                }
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:28px;">
                    <a href="${actionLink}" style="...">
                      ${isExisting ? "Sign in to my account &rarr;" : "Set up my account &rarr;"}
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Warning -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:12px 16px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="20" valign="top" style="padding-right:10px;padding-top:1px;">
                          <img src="https://cdn-icons-png.flaticon.com/512/564/564619.png"
                            width="16" height="16" alt="" style="display:block;" />
                        </td>
                        <td style="font-size:13px;color:#92400e;line-height:1.5;">
                          This link expires in <strong>24 hours</strong>. Didn't make this purchase? You can safely ignore this email.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafd;border-top:1px solid #e8edf3;padding:18px 32px;text-align:center;">
              <p style="font-size:12px;color:#94a3b8;line-height:1.8;margin:0;">
                Philippine Data Guardians &middot; Securing your digital future.<br />
                <a href="#" style="color:#1565a8;text-decoration:none;">Privacy policy</a>
                &nbsp;&middot;&nbsp;
                <a href="#" style="color:#1565a8;text-decoration:none;">Terms of service</a>
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