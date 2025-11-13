# 📱 Mobile App Access Link

## 🌐 Direct Link

**Open this in your browser:**

```
http://localhost:8081
```

---

## 🔗 Full URL

If localhost doesn't work, try:

```
http://127.0.0.1:8081
```

---

## 📱 For Phone (Expo Go)

If you want to use it on your phone:

1. **Start Expo server:**
   ```bash
   cd apps/mobile
   npx expo start --lan
   ```

2. **Scan QR code** with Expo Go app

3. **Or enter URL manually:**
   - Open Expo Go
   - Tap "Enter URL manually"
   - Enter: `exp://YOUR_IP:8081` (IP shown in terminal)

---

## ✅ Verify It's Running

Check if the server is running:
```bash
lsof -i :8081
```

If nothing shows, start it:
```bash
cd apps/mobile
npm run web
```

---

## 🚀 Quick Start Command

```bash
cd apps/mobile
npm run web
```

Then open: **http://localhost:8081**

---

**The mobile app link is: http://localhost:8081** 📱

