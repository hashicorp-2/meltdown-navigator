# 📱 View QR Code in Terminal

## 🔍 How to See QR Code

The QR code should appear in your terminal when Expo starts. If you don't see it:

---

## ✅ Method 1: Check Terminal Output

Look in the terminal where you ran `npx expo start --lan` for:
- A large QR code made of characters
- Text saying "Scan this QR code"
- A URL like `exp://192.168.x.x:8081`

---

## ✅ Method 2: Restart Expo to See QR Code

```bash
cd apps/mobile
npx expo start --lan
```

**Wait 10-15 seconds** - the QR code appears after Metro Bundler starts.

---

## ✅ Method 3: Use Tunnel Mode (Better QR Code)

```bash
cd apps/mobile
npm install -g @expo/ngrok
npx expo start --tunnel
```

Tunnel mode creates a public URL and usually shows a clearer QR code.

---

## ✅ Method 4: Get URL from Terminal

Even without QR code, you can get the URL:

Look for a line like:
```
Metro waiting on exp://10.0.0.144:8081
```

Then enter that URL manually in Expo Go (if the option exists) or use Safari.

---

## 🌐 Alternative: Use Safari (No QR Code Needed)

**Easiest solution - no QR code required:**

1. **Open Safari** on iPhone
2. **Go to:** `http://10.0.0.144:8081`
3. **Done!**

---

## 📋 What Terminal Should Show

When Expo starts successfully, you should see:
```
Starting Metro Bundler
...
[QR Code appears here]
...
Metro waiting on exp://10.0.0.144:8081
```

---

**The QR code should appear in your terminal. If not, use Safari browser instead!** 📱

