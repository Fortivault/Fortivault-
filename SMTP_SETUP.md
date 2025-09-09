# SMTP Configuration Guide

## Local Development

1. Copy `.env.example` to `.env.local`
2. Update the environment variables with your actual values
3. The SMTP configuration is already set up for GMX mail service

## Production Deployment (Vercel)

Add these environment variables to your Vercel project settings:

### SMTP Configuration
- `SMTP_HOST`: `mail.gmx.com`
- `SMTP_PORT`: `587`
- `SMTP_USER`: `services.fortivault@gmx.us`
- `SMTP_PASS`: `LDDSDFI2EY7MATGBQZRR`
- `SMTP_FROM`: `services.fortivault@gmx.us`
- `EMAIL_FROM`: `Fortivault Security`

### Application Configuration
- `NEXT_PUBLIC_APP_URL`: Your production domain (e.g., `https://yourapp.vercel.app`)

## Email Service Features

The email service (`lib/email-service.tsx`) supports:
- ✅ OTP verification emails
- ✅ Welcome emails with dashboard links
- ✅ Generic email sending
- ✅ HTML email templates with Fortivault branding
- ✅ Automatic text fallback for HTML emails

## Security Notes

- SMTP credentials are configured for GMX mail service
- Uses STARTTLS encryption (port 587)
- Environment variables are properly secured in `.gitignore`
- Never commit `.env.local` or actual credentials to version control

## Testing Email Functionality

After configuration, test the email service by:
1. Submitting a fraud report to trigger OTP email
2. Completing email verification to receive welcome email
3. Check email delivery and formatting
