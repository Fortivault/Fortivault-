export const WelcomeEmailTemplate = ({
  firstName,
  caseId,
  dashboardLink,
}: {
  firstName: string
  caseId: string
  dashboardLink: string
}) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to Fortivault</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f3f4f6; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
    
    <!-- Header with logo -->
    <div style="background: #ffffff; padding: 25px; text-align: center; border-bottom: 3px solid #1e40af;">
      <img src="https://i.ibb.co/ZR1YwGjZ/Adobe-Express-file.png" alt="Fortivault Logo" style="max-height: 100px; margin-bottom: 10px;">
    </div>

    <!-- Body -->
    <div style="padding: 30px; background: #f8fafc;">
      <h2 style="color: #1e40af; margin-top: 0;">Welcome, ${firstName}!</h2>
      <p>Thank you for submitting your fraud report. We're here to help you recover your funds and navigate this challenging situation.</p>

      <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
        <h3 style="margin-top: 0; color: #10b981;">Your Case Details</h3>
        <p><strong>Case Reference:</strong> ${caseId}</p>
        <p><strong>Status:</strong> Under Review</p>
        <p><strong>Assigned Agent:</strong> Will be assigned within 2-4 hours</p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${dashboardLink}" style="background: #1e40af; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
          Access Your Dashboard
        </a>
      </div>

      <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
        <h4 style="margin-top: 0; color: #92400e;">Important Security Notice</h4>
        <p style="margin-bottom: 0; font-size: 14px;">This dashboard link is unique to your case and will expire once your report is closed. Please keep it secure and do not share it with anyone.</p>
      </div>

      <h3 style="color: #1e40af;">What Happens Next?</h3>
      <ul>
        <li>A Recovery Agent will be assigned to your case within 2-4 hours</li>
        <li>You'll receive a notification when your agent is ready to assist</li>
        <li>Use the secure chat system in your dashboard to communicate</li>
        <li>Track your case progress and recovery status in real-time</li>
      </ul>

      <p style="margin-top: 30px;">If you have any immediate questions, please contact our support team at <a href="mailto:fortivault@aol.com" style="color:#1e40af; text-decoration:none;">support@fortivault</a>.</p>


    <!-- Footer -->
    <div style="background: #f9fafb; padding: 20px; font-size: 12px; color: #6b7280; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="margin: 4px 0;">&copy; ${new Date().getFullYear()} Fortivault. All rights reserved.</p>
      <p style="margin: 4px 0;">Fortivault, Inc. | Confidential & Secure Communication</p>
      <p style="margin: 4px 0;">
        <a href="mailto:Fortivault@aol.com" style="color:#1e40af; text-decoration:none;">support@fortivault</a> | 
        <a href="mailto:Fortivault@aol.com" style="color:#1e40af; text-decoration:none;">inquiries@fortivault</a>
      </p>
      <a href="https://www.instagram.com/fortivault1?igsh=Yjl0NDF0ZnRzd2Jr" target="_blank" style="display:inline-block; margin-top:10px;">
        <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" style="width:24px; height:24px;">
      </a>
      <div style="margin-top:10px;">
        <img src="https://i.ibb.co/ZR1YwGjZ/Adobe-Express-file.png" alt="Fortivault Mini Logo" style="max-height: 25px;">
      </div>
    </div>
  </div>
</body>
</html>
`

export const OTPEmailTemplate = ({
  firstName,
  otpCode,
}: {
  firstName: string
  otpCode: string
}) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Email Verification - Fortivault</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f3f4f6; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
    
    <!-- Header with logo -->
    <div style="background: #ffffff; padding: 25px; text-align: center; border-bottom: 3px solid #1e40af;">
      <img src="https://i.ibb.co/ZR1YwGjZ/Adobe-Express-file.png" alt="Fortivault Logo" style="max-height: 100px; margin-bottom: 10px;">
    </div>

    <!-- Body -->
    <div style="padding: 30px; background: #f8fafc; text-align: left;">
      <h2 style="color: #1e40af; margin: 0 0 10px;">Hello ${firstName},</h2>
      <p style="margin: 0 0 16px;">Please use the following verification code to complete your fraud report submission:</p>

      <!-- Centered OTP block only -->
      <div style="text-align: center; margin: 20px 0;">
        <div style="background: #ffffff; padding: 20px; border-radius: 8px; border: 2px solid #1e40af; display: inline-block;">
          <h1 style="font-family: monospace; font-size: 36px; letter-spacing: 8px; margin: 0; color: #1e40af;">${otpCode}</h1>
        </div>
      </div>

      <p style="color: #6b7280; font-size: 14px; margin: 0 0 16px;">This code will expire in 10 minutes for security purposes.</p>

      <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 20px; text-align: left; border-left: 4px solid #f59e0b;">
        <p style="margin: 0; font-size: 14px; color: #92400e;">
          <strong>Security Notice:</strong> If you didn't request this verification, please ignore this email.
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #f9fafb; padding: 20px; font-size: 12px; color: #6b7280; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="margin: 4px 0;">&copy; ${new Date().getFullYear()} Fortivault. All rights reserved.</p>
      <p style="margin: 4px 0;">Fortivault, Inc. | Confidential & Secure Communication</p>
      <p style="margin: 4px 0;">
        <a href="mailto:Fortivault@aol.com" style="color:#1e40af; text-decoration:none;">support@fortivault</a> | 
        <a href="mailto:Fortivault@aol.com" style="color:#1e40af; text-decoration:none;">inquiries@fortivault.>
        </a>
      </p>
      <a href="https://www.instagram.com/fortivault1?igsh=Yjl0NDF0ZnRzd2Jr" target="_blank" style="display:inline-block; margin-top:10px;">
        <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" style="width:24px; height:24px;">
      </a>
      <div style="margin-top:10px;">
        <img src="https://i.ibb.co/ZR1YwGjZ/Adobe-Express-file.png" alt="Fortivault Mini Logo" style="max-height: 25px;">
      </div>
    </div>

  </div>
</body>
</html>`
