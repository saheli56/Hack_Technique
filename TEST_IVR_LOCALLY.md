# Test IVR Locally Without Making Real Calls

## Problem
- Can't call US number from India without ISD plan
- Twilio trial needs verified numbers

## Solution: Test IVR Endpoints Directly

### Method 1: Use curl to Test Webhooks

Start your backend server, then test endpoints:

```bash
# Test incoming call webhook
curl -X POST http://localhost:3001/api/ivr/incoming \
  -d "CallSid=TEST123" \
  -d "From=+919876543210" \
  -d "To=+17656272931"

# Test language selection (press 1 for Hindi)
curl -X POST "http://localhost:3001/api/ivr/language-selection" \
  -d "CallSid=TEST123" \
  -d "Digits=1"

# Test main menu (press 1 for job search)
curl -X POST "http://localhost:3001/api/ivr/main-menu?lang=hi" \
  -d "CallSid=TEST123" \
  -d "Digits=1"

# Test city selection (press 1 for Mumbai)
curl -X POST "http://localhost:3001/api/ivr/city-selection?lang=hi" \
  -d "CallSid=TEST123" \
  -d "Digits=1"

# Test job search (press 1 for Construction)
curl -X POST "http://localhost:3001/api/ivr/job-search?lang=hi&city=Mumbai" \
  -d "CallSid=TEST123" \
  -d "Digits=1"
```

You'll get **TwiML XML responses** showing what voice prompts would be played!

### Method 2: Use Postman/Thunder Client

Import these requests to test IVR flow visually.

### Method 3: Record a Demo Video

Since you can't make live calls during hackathon:

1. **Show the code** - IVR endpoints in server.js
2. **Show curl tests** - Demonstrate TwiML responses
3. **Show Twilio console** - Configured webhook
4. **Explain the flow** - "If we call this number, here's what happens..."
5. **Show database logs** - IVRCall collection tracking

### Method 4: Use Twilio Test Tool

1. Go to: https://www.twilio.com/console/voice/twiml/test
2. Paste your ngrok webhook URL
3. Click "Test" to simulate call
4. See/hear the IVR responses

## For Hackathon Presentation

**What to show judges:**

✅ **Working Backend:**
```bash
node server.js
# Show: "Server running on port 3001"
```

✅ **IVR Code:**
- Open server.js and show IVR endpoints
- Explain multi-language support
- Show job search integration

✅ **Test with curl:**
```bash
curl -X POST http://localhost:3001/api/ivr/incoming -d "CallSid=DEMO"
```
Show the TwiML response with Hindi prompts

✅ **Show Analytics:**
```bash
curl http://localhost:3001/api/ivr/analytics
```
Show call statistics

✅ **Explain:**
> "This IVR system works with ANY phone - even basic keypad phones. 
> While we can't demo live calls due to ISD restrictions, 
> the code is production-ready and fully integrated with Twilio's platform.
> Here's the TwiML response that would be converted to voice..."

## Alternative: Get ISD Access

If you really want to test with real calls:

### Jio ISD Activation
- SMS "ACTIVATE ISD" to 199
- Or call 1800-XXX-XXXX
- Charges: ~₹3-5/minute to US

### Or Use Airtel/VI
- Usually easier ISD activation
- Similar rates

### Or Use Google Voice
- Free US number
- Can call your Twilio number for free
- Requires VPN to access from India

---

**For hackathon demo, testing endpoints locally is actually BETTER** - shows technical understanding without connectivity issues! 🚀
