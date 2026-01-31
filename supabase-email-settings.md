# Supabase Email Confirmation Settings

## Required Dashboard Settings

### 1. Authentication → Providers → Email

Navigate to: **Authentication → Providers → Email**

| Setting | Value | Description |
|---------|-------|-------------|
| Enable Email provider | ON | Must be enabled |
| Confirm email | ON | **IMPORTANT: Enable this for email verification** |
| Secure email change | ON | Recommended |
| Double confirm email changes | Optional | Extra security |

### 2. Authentication → URL Configuration

Navigate to: **Authentication → URL Configuration**

| Setting | Value |
|---------|-------|
| Site URL | `https://your-domain.com` (production) or `http://localhost:3000` (development) |
| Redirect URLs | Add: `https://your-domain.com/auth/callback` and `http://localhost:3000/auth/callback` |

### 3. Authentication → Email Templates

Navigate to: **Authentication → Email Templates**

Customize the **Confirm signup** template:

**Subject:** `Confirm your MyGoals AI account`

**Body (HTML):**
```html
<h2>Welcome to MyGoals AI!</h2>

<p>Thanks for signing up. Please confirm your email address by clicking the button below:</p>

<p>
  <a href="{{ .ConfirmationURL }}"
     style="display: inline-block; background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
    Confirm Email Address
  </a>
</p>

<p>Or copy and paste this link in your browser:</p>
<p>{{ .ConfirmationURL }}</p>

<p>This link will expire in 24 hours.</p>

<p>If you didn't create an account, you can safely ignore this email.</p>

<p>– The MyGoals AI Team</p>
```

### 4. SMTP Settings (For Production)

Navigate to: **Project Settings → Auth → SMTP Settings**

For production, configure a custom SMTP provider:

| Setting | Example (SendGrid) |
|---------|-------------------|
| Sender email | `noreply@yourdomain.com` |
| Sender name | `MyGoals AI` |
| Host | `smtp.sendgrid.net` |
| Port | `587` |
| Username | `apikey` |
| Password | Your SendGrid API key |

**Recommended SMTP Providers:**
- SendGrid (free tier: 100 emails/day)
- Postmark
- Mailgun
- AWS SES

> **Note:** Supabase's built-in email (default) has rate limits and may go to spam. For production, always use a custom SMTP provider.

---

## Verification Checklist

- [ ] Email provider enabled in Authentication → Providers
- [ ] "Confirm email" is **ON**
- [ ] Site URL is correctly set
- [ ] Redirect URLs include `/auth/callback`
- [ ] Email template is customized (optional but recommended)
- [ ] SMTP configured for production (required for reliable delivery)

---

## Testing Email Confirmation

1. Sign up with a new email
2. Check inbox (and spam folder)
3. Click the confirmation link
4. Should redirect to `/dashboard` after confirmation

### Common Issues

| Issue | Solution |
|-------|----------|
| Email not received | Check spam folder; verify SMTP settings |
| "Invalid confirmation link" | Link expired (24h) or already used; resend confirmation |
| Redirects to wrong URL | Check Redirect URLs in dashboard |
| Email goes to spam | Configure custom SMTP with verified domain |

---

## Rate Limits

**Supabase Built-in Email:**
- 4 emails per hour per user
- Limited to development/testing

**Custom SMTP:**
- Depends on your provider's limits
- Recommended for production
