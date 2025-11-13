# 📱 How to See QR Code

## ⚠️ QR Code Appears in Terminal Window

The QR code shows in the **terminal window** where you run the command, not in log files.

---

## ✅ To See QR Code:

**Run this command directly in your terminal:**

```bash
cd apps/mobile
npx expo start --lan
```

**Wait 10-15 seconds** - the QR code appears after:
- Metro Bundler starts
- "Waiting on http://localhost:8081" appears
- Then the QR code shows below

---

## 📋 What You'll See:

```
Starting Metro Bundler
...
[Large QR code made of characters appears here]
...
Metro waiting on exp://10.0.0.144:8081
```

---

## 🌐 If QR Code Doesn't Appear:

**Use the URL directly:**

**For Safari (Easiest):**
```
http://10.0.0.144:8081
```

**For Expo Go (if you can enter URL):**
```
exp://10.0.0.144:8081
```

---

## 💡 Tip:

The QR code is a visual representation of the URL. You can use the URL directly instead!

---

**Run the command in your terminal to see the QR code!** 📱
