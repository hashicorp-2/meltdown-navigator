# ✅ Correct Command to Run

## 🚀 How to Start Mobile App

**You don't need to type "run" - just run the command directly!**

---

## 📋 Step-by-Step

### Step 1: Navigate to mobile folder
```bash
cd apps/mobile
```

### Step 2: Start Expo (choose one)

**Option A: LAN Mode (for QR code on same WiFi)**
```bash
npx expo start --lan
```

**Option B: Web Version (no QR code needed)**
```bash
npm run web
```

**Option C: Regular Start (will show options)**
```bash
npm run start
```

---

## ⚠️ Common Mistakes

❌ **Wrong:** `run npx expo start --lan`  
✅ **Correct:** `npx expo start --lan`

❌ **Wrong:** `runnpx expo start --lan`  
✅ **Correct:** `npx expo start --lan`

---

## 📱 What You'll See

After running `npx expo start --lan`:

1. **Metro Bundler starts**
2. **QR code appears** in terminal
3. **URL shown** like `exp://192.168.x.x:8081`
4. **Scan QR code** with Expo Go app

---

## 🌐 Or Use Web Version (Easier)

```bash
cd apps/mobile
npm run web
```

Then open: **http://localhost:8081**

---

## ✅ Quick Copy-Paste

**For QR code:**
```bash
cd apps/mobile && npx expo start --lan
```

**For web browser:**
```bash
cd apps/mobile && npm run web
```

---

**Just copy and paste the command - no "run" needed!** 🚀

