# 📱 Expo Go URL Format

## 🔌 Port Being Used

**Port: 8081**

---

## 📋 URL Format

The format is: `exp://IP_ADDRESS:PORT`

---

## 🌐 For Same WiFi Network (Recommended)

Use your **local IP address** (the one on your WiFi network):

```
exp://10.0.0.144:8081
```

**This is the one to use** when your iPhone and Mac are on the same WiFi.

---

## 🌍 For Public IP (Advanced)

If you want to use your public IP (68.151.217.20):

```
exp://68.151.217.20:8081
```

**⚠️ Important:** This only works if:
- Port forwarding is configured on your router
- Firewall allows connections on port 8081
- You're accessing from outside your local network

**For local network access, use the local IP (10.0.0.144) instead!**

---

## ✅ Recommended: Use Local IP

Since you're on the same WiFi network, use:

```
exp://10.0.0.144:8081
```

---

## 📱 How to Enter in Expo Go

1. Open **Expo Go** app
2. Tap **"Enter URL manually"**
3. Paste: `exp://10.0.0.144:8081`
4. Tap **"Connect"**

---

## 🔍 Find Your Local IP

If you need to find your local IP again:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

---

**Use: exp://10.0.0.144:8081 for same WiFi network access!** 📱

