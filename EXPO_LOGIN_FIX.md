# 🔧 Fix Expo Login Error

## ❌ Error: `AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value`

This usually means the password isn't being read correctly.

---

## ✅ Solutions

### Option 1: Type Password Manually (Recommended)

**Don't copy-paste the password - type it manually:**

```bash
cd /Users/ogowemr/meltdown-navigator/apps/mobile
npx expo login
```

**When prompted:**
- Email: `lhashi89@gmail.com` (you can copy this)
- Password: **Type it manually** (don't copy-paste)

**Special characters in passwords can cause issues when copy-pasted!**

---

### Option 2: Login via Web Browser

1. **Go to:** https://expo.dev/login
2. **Login with:**
   - Email: `lhashi89@gmail.com`
   - Password: `Hashimhanif!`
3. **After logging in, go to:** https://expo.dev/accounts/[your-username]/settings/access-tokens
4. **Create an access token**
5. **Then use it:**
   ```bash
   export EXPO_TOKEN=your-token-here
   npx expo publish
   ```

---

### Option 3: Reset Password

If login still fails:

1. **Go to:** https://expo.dev/forgot-password
2. **Enter:** `lhashi89@gmail.com`
3. **Reset password**
4. **Try login again**

---

### Option 4: Use Expo CLI with Different Method

```bash
cd /Users/ogowemr/meltdown-navigator/apps/mobile
npx expo login --username lhashi89@gmail.com
```

Then enter password when prompted.

---

## 🎯 Quick Fix

**Most likely issue:** Special character `!` in password

**Try:**
1. Type password manually (don't copy-paste)
2. Make sure no extra spaces
3. If it still fails, try resetting password

---

**Try typing the password manually first - that usually fixes it!** 🔑

