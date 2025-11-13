# 🔒 Fix "Connection is Not Private" Error

## ⚠️ Problem: Safari Shows "Connection is Not Private"

This happens because:
1. Safari is trying to use HTTPS but the server uses HTTP
2. The connection is taking too long (3+ minutes)
3. The server might not be responding properly

---

## ✅ Solution 1: Accept the Warning (Safe for Local Network)

**This is safe because you're on your local network:**

1. **Scroll down** on the warning page
2. **Tap "Show Details"** or "Advanced"
3. **Tap "Visit this website"** or "Proceed to..."
4. **The page should load**

**This is safe** - it's just Safari being cautious about non-HTTPS connections on local networks.

---

## ✅ Solution 2: Use HTTP Explicitly

**Make sure you're using HTTP (not HTTPS):**

**Correct URL:**
```
http://10.0.0.144:8081
```

**Wrong (don't use):**
```
https://10.0.0.144:8081
```

---

## ✅ Solution 3: Clear Safari Cache

1. **Settings** → **Safari**
2. **Clear History and Website Data**
3. **Try again**

---

## ✅ Solution 4: Check Server is Running

**The 3-minute loading suggests the server might not be responding.**

**Check if server is running:**
```bash
cd apps/mobile
npx expo start --web
```

**Wait for:**
- "Web Bundled" message
- "Ready" message
- Then try the URL again

---

## ✅ Solution 5: Use Different Port or Restart

**Restart the server:**
```bash
# Stop existing
lsof -ti :8081 | xargs kill

# Start fresh
cd apps/mobile
npx expo start --web
```

**Wait 15-20 seconds** for it to fully start, then try again.

---

## 🔧 If Still Not Working

**Try these in order:**

1. **Accept the warning** (scroll down, tap "Proceed")
2. **Make sure using HTTP** (not HTTPS)
3. **Restart Expo server** (see commands above)
4. **Wait for "Web Bundled"** before trying URL
5. **Try on computer first** - `http://localhost:8081` to verify it works

---

## 📋 Quick Fix Steps

1. **Restart Expo:**
   ```bash
   cd apps/mobile
   npx expo start --web
   ```

2. **Wait 15-20 seconds** for "Web Bundled"

3. **On iPhone Safari:**
   - Go to: `http://10.0.0.144:8081`
   - If warning appears, scroll down and tap "Proceed"
   - Page should load

---

**The "not private" warning is normal for local HTTP connections - just proceed through it!** 🔓

