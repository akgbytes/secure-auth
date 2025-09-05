export const verifyEmailTemplate = (
  link: string,
  brandColor: string = "#2563eb"
) => ({
  subject: "Verify your SecureAuth account",
  text: `Welcome to SecureAuth! Please verify your email by clicking this link: ${link}`,
  html: `
    <html><head><style>
      body, html { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); }
      .header { background-color: ${brandColor}; font-weight:bold; font-size: 24px; color: #ffffff; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px; }
      .content { padding: 20px; text-align: center; }
      .content h1 { font-size: 22px; margin-bottom: 10px; }
      .content p { font-size: 16px; color: #555555; margin: 10px 0 20px; }
      .button { display: inline-block; padding: 14px 28px; font-size: 16px; font-weight: bold;  background-color: ${brandColor}; color: #fff!important; border-radius: 6px; text-decoration: none; margin-top: 20px; }
      .footer { font-size: 13px; color: #888888; text-align: center; padding: 20px; }
    </style></head><body>
      <div class="container">
        <div class="header">SecureAuth</div>
        <div class="content">
          <h1>Confirm Your Email Address</h1>
          <p>Welcome to SecureAuth. Please confirm your account by clicking the button below.</p>
          <a href="${link}" class="button">Verify Email</a>
          <p>If you didn’t create this account, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          <p>Need help? Reply to this email or reach out to our support team anytime.</p>
        </div>
      </div>
    </body></html>
  `,
});

export const passwordResetTemplate = (
  link: string,
  brandColor: string = "#2563EB"
) => ({
  subject: "Reset your SecureAuth password",
  text: `We received a request to reset your password. Reset it using this link: ${link}`,
  html: `
    <html><head><style>
      body, html { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); }
      .header { background-color: ${brandColor}; font-size: 24px; font-weight:bold; color: #ffffff; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px; }
      .content { padding: 20px; text-align: center; }
      .content h1 { font-size: 22px; margin-bottom: 10px; }
      .content p { font-size: 16px; color: #555555; margin: 10px 0 20px; }
      .button { display: inline-block; padding: 14px 28px; font-size: 16px; font-weight: bold; background-color: ${brandColor};  color: #fff !important; border-radius: 6px; text-decoration: none; margin-top: 20px; }
      .footer { font-size: 13px; color: #888888; text-align: center; padding: 20px; }
    </style></head><body>
      <div class="container">
        <div class="header">SecureAuth</div>
        <div class="content">
          <h1>Reset Your Password</h1>
          <p>We received a request to reset your password. Click the button below to create a new one.</p>
          <a href="${link}" class="button">Reset Password</a>
          <p>If you didn’t request a reset, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          <p>Need help? Reply to this email or reach out to our support team anytime.</p>
        </div>
      </div>
    </body></html>
  `,
});
