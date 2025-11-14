# Twilio Setup Guide

## Who Needs Twilio?

**Only YOU (the app owner/developer) need a Twilio account.**

App users do NOT need:
- ❌ Twilio account
- ❌ API keys
- ❌ Phone number
- ❌ Any setup

They just need to:
- ✅ Add phone numbers to their support circle contacts
- ✅ Click "Send Alert" when they need help

---

## How It Works

```
User's Phone/App
    ↓
    [Clicks "Send Alert"]
    ↓
Backend API (YOUR server)
    ↓
    [Uses YOUR Twilio credentials]
    ↓
Twilio Service
    ↓
Caregiver's Phone
    [Receives SMS from YOUR Twilio number]
```

---

## Setup Steps (For You)

### 1. Create Twilio Account
1. Go to https://www.twilio.com/
2. Sign up for a free trial account
3. Verify your phone number

### 2. Get a Phone Number
1. In Twilio Console → Phone Numbers → Buy a Number
2. Choose a number (US numbers are cheapest)
3. Note the phone number (e.g., `+1234567890`)

### 3. Get API Credentials
1. In Twilio Console → Account → API Keys & Tokens
2. Copy your:
   - **Account SID** (starts with `AC...`)
   - **Auth Token** (click to reveal)

### 4. Configure Backend

Add to `backend/.env`:

```bash
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

### 5. Test It

```bash
cd backend
npm run dev
```

Then test the alert endpoint or use the web app.

---

## Cost Structure

### Twilio Pricing (as of 2024)
- **SMS (US)**: ~$0.0075 per message
- **MMS (US)**: ~$0.02 per message
- **Free Trial**: $15.50 credit (good for ~2,000 SMS)

### For Your App
- **You pay**: Twilio usage costs
- **Users pay**: Your subscription/service fee (which includes SMS costs)
- **Typical model**: Include SMS costs in monthly subscription

### Example Costs
- 100 users, 10 alerts/month each = 1,000 SMS/month
- Cost: ~$7.50/month
- You can charge $10-20/month subscription to cover this + profit

---

## Security Notes

✅ **DO**:
- Keep Twilio credentials in `.env` (never commit to git)
- Use environment variables in production
- Monitor Twilio usage for abuse
- Set up rate limiting on alert endpoint

❌ **DON'T**:
- Share Twilio credentials with users
- Commit `.env` files to git
- Expose Twilio credentials in frontend code

---

## Production Checklist

- [ ] Twilio account created
- [ ] Phone number purchased
- [ ] Credentials added to `backend/.env`
- [ ] Tested SMS sending
- [ ] Tested MMS sending (if using)
- [ ] Set up usage monitoring
- [ ] Configured rate limiting
- [ ] Added error handling for Twilio failures
- [ ] Set up billing alerts in Twilio

---

## Troubleshooting

### "Twilio is not configured"
- Check that all 3 environment variables are set
- Restart backend server after adding variables

### "Invalid phone number format"
- Phone numbers must be in E.164 format: `+1234567890`
- Include country code (e.g., `+1` for US)

### Messages not sending
- Check Twilio console for error logs
- Verify phone number is correct format
- Check Twilio account balance
- Ensure phone number is verified (for trial accounts)

---

## Alternative: User's Own Twilio (Not Recommended)

If you wanted users to use their own Twilio:
- ❌ Complex setup for users
- ❌ Security concerns (storing user credentials)
- ❌ Poor user experience
- ❌ Harder to support

**Recommendation**: Use your own Twilio account and include costs in subscription.

