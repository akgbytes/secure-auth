export const emailVerifyTemplate = (
  link: string,
  brandColor: string = "#117149"
) => ({
  subject: "Verify your SecureAuth account",
  text: `Welcome to SecureAuth! 

Please verify your email by clicking this link: ${link}

If you didn’t create this account, you can safely ignore this email.

Need help? Contact our support team.`,
  html: `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f4f4f4; padding:20px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
            
            <!-- Header -->
            <tr>
              <td align="center" style="background:${brandColor}; padding:20px; font-size:24px; font-weight:bold; color:#ffffff;">
                SecureAuth
              </td>
            </tr>
            
            <!-- Content -->
            <tr>
              <td align="center" style="padding:30px 20px; color:#333333;">
                <h1 style="margin:0 0 15px; font-size:22px; font-weight:bold;">Confirm Your Email Address</h1>
                <p style="margin:0 0 25px; font-size:16px; line-height:1.5; color:#555555;">
                  Welcome to SecureAuth. Please confirm your account by clicking the button below.
                </p>
                
                <!-- Button -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:20px auto;">
                  <tr>
                    <td align="center" bgcolor="${brandColor}" style="border-radius:6px;">
                      <a href="${link}" target="_blank" 
                        style="display:inline-block; padding:14px 28px; font-size:16px; font-weight:bold; color:#ffffff; text-decoration:none; border-radius:6px;">
                        Verify Email
                      </a>
                    </td>
                  </tr>
                </table>
                
                <p style="margin:20px 0 0; font-size:14px; color:#555555;">
                  If you didn’t create this account, you can safely ignore this email.
                </p>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td align="center" style="padding:20px; font-size:13px; color:#888888;">
                <p style="margin:0;">Need help? <a href="mailto:no-reply@akgbytes.com" style="color:${brandColor}; text-decoration:underline;">Contact support</a> anytime.</p>
                <p style="margin:5px 0 0;">&copy; ${new Date().getFullYear()} SecureAuth. All rights reserved.</p>
              </td>
            </tr>
            
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `,
});

export const passwordResetTemplate = (
  link: string,
  brandColor: string = "#2563EB"
) => ({
  subject: "Reset your SecureAuth password",
  text: `We received a request to reset your password.

Reset it using this link: ${link}

If you didn’t request this, you can safely ignore this email.

Need help? Contact our support team.`,
  html: `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f4f4f4; padding:20px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
            <!-- Header -->
            <tr>
              <td align="center" style="background:${brandColor}; padding:20px; font-size:24px; font-weight:bold; color:#ffffff;">
                SecureAuth
              </td>
            </tr>
            <!-- Content -->
            <tr>
              <td align="center" style="padding:30px 20px; color:#333333;">
                <h1 style="margin:0 0 15px; font-size:22px; font-weight:bold;">Reset Your Password</h1>
                <p style="margin:0 0 25px; font-size:16px; line-height:1.5; color:#555555;">
                  We received a request to reset your password. Click the button below to set up a new one.
                </p>
                <!-- Button -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:20px auto;">
                  <tr>
                    <td align="center" bgcolor="${brandColor}" style="border-radius:6px;">
                      <a href="${link}" target="_blank"
                        style="display:inline-block; padding:14px 28px; font-size:16px; font-weight:bold; color:#ffffff; text-decoration:none; border-radius:6px;">
                        Reset Password
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin:20px 0 0; font-size:14px; color:#555555;">
                  If you didn’t request a reset, you can safely ignore this email.
                </p>
                <p style="margin:10px 0 0; font-size:13px; color:#999999;">
                  For your security, this link will expire in 60 minutes.
                </p>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td align="center" style="padding:20px; font-size:13px; color:#888888;">
                <p style="margin:0;">Need help? <a href="mailto:no-reply@akgbytes.com" style="color:${brandColor}; text-decoration:underline;">Contact support</a> anytime.</p>
                <p style="margin:5px 0 0;">&copy; ${new Date().getFullYear()} SecureAuth. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `,
});
