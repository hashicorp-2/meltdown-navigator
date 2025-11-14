# 📱 Publish Mobile App with EAS Update

## ✅ You're Logged In!

Now you need to configure EAS and publish.

---

## Step 1: Initialize EAS Project

**Run in terminal:**
```bash
cd /Users/ogowemr/meltdown-navigator/apps/mobile
eas init
```

**When prompted:**
- "Would you like to automatically create an EAS project?" → **Yes** (or `y`)
- "Project name:" → Press Enter (uses `mobile`)

---

## Step 2: Publish Update

**After EAS is configured, run:**
```bash
eas update --branch main --message "Initial publish"
```

**Or simpler:**
```bash
eas update
```

---

## Step 3: Get Your Link

**After publishing, you'll see:**
- Update URL
- QR Code
- Link like: `https://expo.dev/@lhashi89/mobile`

---

## 🎯 Quick Commands

```bash
cd /Users/ogowemr/meltdown-navigator/apps/mobile
eas init
eas update
```

---

## 📋 What Happens

1. `eas init` - Creates EAS project configuration
2. `eas update` - Publishes your app
3. You get shareable link!

---

**Run `eas init` first, then `eas update`!** 🚀

