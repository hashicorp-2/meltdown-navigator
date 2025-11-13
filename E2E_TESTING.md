# End-to-End Testing Guide

This guide provides comprehensive testing procedures to verify the entire Meltdown Navigator application works correctly from end to end.

## Prerequisites

Before running E2E tests, ensure:

1. ✅ Backend is running on `http://localhost:4000`
2. ✅ MongoDB is running (if testing profile features)
3. ✅ `ANTHROPIC_API_KEY` is set in `backend/.env`
4. ✅ Web frontend is running on `http://localhost:3000`
5. ✅ All dependencies are installed

## Test Scenarios

### Scenario 1: Complete User Journey (With Profile)

**Objective:** Verify a new user can create a profile and use it for personalized translations.

#### Steps:

1. **Start Fresh**
   ```bash
   # Clear any existing data (optional)
   # If using MongoDB, you can drop the database or clear collections
   ```

2. **Open Web App**
   - Navigate to `http://localhost:3000`
   - Should see home page or redirect to onboarding

3. **Complete Onboarding**
   - Navigate to `/onboarding`
   - **Step 1:** Enter preferred name (e.g., "Alex")
   - **Step 2:** Add support circle contacts (optional):
     - Name: "Sam"
     - Relationship: "Partner"
     - Contact Method: "Text Message"
   - **Step 3:** Select communication tone (e.g., "Soft")
   - **Step 4:** Review crisis signals (can skip)
   - **Step 5:** Review and submit
   - ✅ **Expected:** Profile created, redirected to translator

4. **Verify Profile Created**
   - Check browser localStorage for `meltdown_profileId`
   - Check backend logs for profile creation
   - ✅ **Expected:** Profile ID stored, backend logs show creation

5. **Use Translator with Profile**
   - On translator page (`/`), enter:
     - Stress level: 4
     - Raw message: "I'm feeling really overwhelmed right now"
     - Select triggers: "Overwhelmed", "Sensory overload"
   - Click "Translate to visual plan"
   - ✅ **Expected:** 
     - Loading state shows
     - Communication plan appears
     - Plan includes personalized elements (if profile data affects output)
     - Steps are displayed with icons
     - Copy button works

6. **Verify Personalization**
   - Check if translation mentions profile name or preferences
   - ✅ **Expected:** Translation should be tailored to profile (may vary based on AI response)

#### Verification Checklist:

- [ ] Profile created successfully
- [ ] Profile ID stored in localStorage
- [ ] Redirected to translator after onboarding
- [ ] Translator loads profileId from localStorage
- [ ] Translation request includes profileId
- [ ] Translation response is personalized
- [ ] Visual step cards display correctly
- [ ] Copy-to-clipboard works
- [ ] Selected triggers are displayed

---

### Scenario 2: Translator Without Profile

**Objective:** Verify translator works without a profile (fallback mode).

#### Steps:

1. **Clear Profile Data**
   - Open browser DevTools
   - Clear localStorage: `localStorage.clear()`
   - Or use incognito/private window

2. **Use Translator**
   - Navigate to `http://localhost:3000` (translator page)
   - Enter:
     - Stress level: 3
     - Raw message: "I need help calming down"
   - Click "Translate to visual plan"
   - ✅ **Expected:** 
     - Translation works without profile
     - Generic (non-personalized) response
     - All UI elements display correctly

#### Verification Checklist:

- [ ] Translator works without profile
- [ ] No errors in console
- [ ] Communication plan displays
- [ ] Steps are shown correctly

---

### Scenario 3: Profile Management

**Objective:** Verify profile CRUD operations work correctly.

#### Steps:

1. **Create Profile via API**
   ```bash
   curl -X POST http://localhost:4000/api/profiles \
     -H "Content-Type: application/json" \
     -d '{
       "userId": "test-user-123",
       "preferredName": "Test User",
       "supportCircle": [
         {
           "name": "Friend",
           "relationship": "Best Friend",
           "contactMethod": "sms"
         }
       ],
       "communicationGuidelines": {
         "tone": "soft",
         "doPhrases": ["I feel"],
         "avoidPhrases": ["You always"]
       }
     }'
   ```
   - ✅ **Expected:** Returns profile with `_id`

2. **Get Profile**
   ```bash
   curl http://localhost:4000/api/profiles/test-user-123
   ```
   - ✅ **Expected:** Returns created profile

3. **Check Profile Exists**
   ```bash
   curl http://localhost:4000/api/profiles/test-user-123/exists
   ```
   - ✅ **Expected:** `{"exists": true}`

4. **Update Profile**
   ```bash
   curl -X PUT http://localhost:4000/api/profiles/test-user-123 \
     -H "Content-Type: application/json" \
     -d '{
       "preferredName": "Updated Name"
     }'
   ```
   - ✅ **Expected:** Returns updated profile

5. **Delete Profile**
   ```bash
   curl -X DELETE http://localhost:4000/api/profiles/test-user-123
   ```
   - ✅ **Expected:** 204 No Content

6. **Verify Deleted**
   ```bash
   curl http://localhost:4000/api/profiles/test-user-123/exists
   ```
   - ✅ **Expected:** `{"exists": false}`

#### Verification Checklist:

- [ ] Profile creation works
- [ ] Profile retrieval works
- [ ] Profile update works
- [ ] Profile deletion works
- [ ] Exists check works

---

### Scenario 4: Error Handling

**Objective:** Verify error handling works correctly.

#### Steps:

1. **Invalid Translator Request**
   ```bash
   curl -X POST http://localhost:4000/api/translator \
     -H "Content-Type: application/json" \
     -d '{
       "rawMessage": "",
       "stressLevel": 6
     }'
   ```
   - ✅ **Expected:** 400 Bad Request with validation errors

2. **Missing API Key**
   - Temporarily remove `ANTHROPIC_API_KEY` from backend `.env`
   - Restart backend
   - Try translation
   - ✅ **Expected:** 500 error with clear message
   - Restore API key

3. **Invalid Profile ID**
   - In translator, manually set invalid profileId in localStorage
   - Try translation
   - ✅ **Expected:** Translation works without profile (graceful fallback)

4. **Backend Offline**
   - Stop backend server
   - Try translation in web app
   - ✅ **Expected:** Error message shown, demo plan may appear

#### Verification Checklist:

- [ ] Validation errors display correctly
- [ ] Missing API key handled gracefully
- [ ] Invalid profile ID handled gracefully
- [ ] Backend offline handled gracefully
- [ ] User-friendly error messages

---

### Scenario 5: Mobile App Flow

**Objective:** Verify mobile app works end-to-end.

#### Steps:

1. **Start Mobile App**
   - Run `npm run start --workspace @meltdown/mobile`
   - Open on device/simulator

2. **Home Screen**
   - ✅ **Expected:** Shows welcome message
   - ✅ **Expected:** "Set Up Your Profile" button visible

3. **Onboarding Flow**
   - Tap "Set Up Your Profile"
   - Complete all 5 steps
   - ✅ **Expected:** Profile created, redirected to translator

4. **Translator Screen**
   - Set stress level
   - Enter message
   - Tap "Translate to visual plan"
   - ✅ **Expected:** Plan displays correctly

5. **Profile Integration**
   - Verify profileId is stored in AsyncStorage
   - Verify translation uses profile
   - ✅ **Expected:** Personalized translation

#### Verification Checklist:

- [ ] Home screen loads
- [ ] Onboarding flow works
- [ ] Profile created successfully
- [ ] Translator works
- [ ] Profile integration works
- [ ] Navigation between screens works

---

## Automated Testing Scripts

### Quick Health Check

```bash
#!/bin/bash
# quick-test.sh

echo "Testing Backend Health..."
curl -s http://localhost:4000/api/health | grep -q "ok" && echo "✅ Backend healthy" || echo "❌ Backend not responding"

echo "Testing Profile Creation..."
PROFILE_RESPONSE=$(curl -s -X POST http://localhost:4000/api/profiles \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-'$(date +%s)'",
    "preferredName": "Test User"
  }')

if echo "$PROFILE_RESPONSE" | grep -q "_id"; then
  echo "✅ Profile creation works"
  PROFILE_ID=$(echo "$PROFILE_RESPONSE" | grep -o '"_id":"[^"]*"' | cut -d'"' -f4)
  echo "Profile ID: $PROFILE_ID"
else
  echo "❌ Profile creation failed"
fi

echo "Testing Translator..."
TRANSLATOR_RESPONSE=$(curl -s -X POST http://localhost:4000/api/translator \
  -H "Content-Type: application/json" \
  -d '{
    "rawMessage": "Test message",
    "stressLevel": 3
  }')

if echo "$TRANSLATOR_RESPONSE" | grep -q "steps"; then
  echo "✅ Translator works"
else
  echo "❌ Translator failed"
fi
```

### Run All Tests

```bash
chmod +x quick-test.sh
./quick-test.sh
```

## Manual Testing Checklist

### Backend API

- [ ] Health endpoint responds
- [ ] Translator endpoint works
- [ ] Profile CRUD operations work
- [ ] Error handling works
- [ ] Validation works

### Web Frontend

- [ ] Home page loads
- [ ] Onboarding flow works
- [ ] Translator page works
- [ ] Profile integration works
- [ ] Copy-to-clipboard works
- [ ] Trigger badges work
- [ ] Visual step cards display
- [ ] Error messages display
- [ ] Loading states work

### Mobile App

- [ ] App launches
- [ ] Home screen loads
- [ ] Onboarding works
- [ ] Translator works
- [ ] Profile integration works
- [ ] Navigation works
- [ ] AsyncStorage works

### Integration

- [ ] Profile created in web → usable in mobile
- [ ] Profile created in mobile → usable in web
- [ ] Translations consistent across platforms
- [ ] Error handling consistent

## Performance Testing

### Response Times

- Translator API: Should respond in < 5 seconds
- Profile API: Should respond in < 500ms
- Frontend load: Should load in < 2 seconds

### Load Testing

```bash
# Test translator endpoint with multiple requests
for i in {1..10}; do
  curl -X POST http://localhost:4000/api/translator \
    -H "Content-Type: application/json" \
    -d '{"rawMessage": "Test '$i'", "stressLevel": 3}' &
done
wait
```

## Security Testing

- [ ] API keys not exposed in frontend
- [ ] Input validation prevents injection
- [ ] CORS configured correctly
- [ ] Error messages don't leak sensitive info

## Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast sufficient
- [ ] Focus indicators visible

## Browser Compatibility

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Android)

## Reporting Issues

When reporting test failures, include:

1. Test scenario name
2. Steps to reproduce
3. Expected behavior
4. Actual behavior
5. Browser/device info
6. Console errors (if any)
7. Network requests (if relevant)

## Continuous Testing

For CI/CD, consider:

1. Automated API tests (Jest/Supertest)
2. E2E tests (Playwright/Cypress)
3. Visual regression tests
4. Performance monitoring

---

**Last Updated:** $(date)
**Tested By:** [Your Name]
**Status:** ✅ All scenarios passing / ⚠️ Issues found


