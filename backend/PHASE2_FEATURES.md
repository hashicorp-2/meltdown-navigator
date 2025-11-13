# Phase 2 Features Documentation

## Overview

Phase 2 adds two major features to the Meltdown Navigator platform:
1. **Twilio Integration** - SMS crisis alerts
2. **Communication Mediator** - AI-powered message mediation

## Twilio Integration

### Setup

Add the following environment variables to your `.env` file:

```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890  # Your Twilio phone number (E.164 format)
```

### API Endpoint

**POST `/api/crisis-alert`**

Sends a crisis alert via SMS to a support circle member.

#### Request Body

```json
{
  "to": "+1234567890",  // Required: Recipient phone number (E.164 format)
  "message": "I'm having a hard time right now and could use some support.",  // Required
  "userName": "Alex",  // Optional: Name of the person in crisis
  "stressLevel": 4,  // Optional: Stress level (1-5)
  "actionNeeded": "Please call when you have a moment"  // Optional: Specific action needed
}
```

#### Response

```json
{
  "success": true,
  "messageSid": "SM1234567890abcdef",
  "message": "Crisis alert sent successfully"
}
```

#### Error Responses

- `400` - Invalid request (missing required fields, invalid phone number format)
- `503` - Twilio not configured (missing environment variables)

### Usage Example

```typescript
import { sendCrisisAlert } from '@/lib/api';

// Simple alert
await sendCrisisAlert({
  to: '+1234567890',
  message: 'I need support right now',
});

// Formatted alert with context
await sendCrisisAlert({
  to: '+1234567890',
  message: 'I\'m struggling with anxiety',
  userName: 'Alex',
  stressLevel: 4,
  actionNeeded: 'Please call when available',
});
```

### Features

- **Phone Number Validation**: Validates E.164 format (e.g., +1234567890)
- **Formatted Messages**: Automatically formats messages with user context when provided
- **Graceful Degradation**: Service continues to work even if Twilio is not configured
- **Error Handling**: Clear error messages for configuration and validation issues

## Communication Mediator

### Overview

The Communication Mediator uses AI to analyze and rephrase messages to improve communication, reduce conflict, and facilitate better understanding between parties. It applies principles of nonviolent communication (NVC) and de-escalation techniques.

### API Endpoint

**POST `/api/mediate`**

Analyzes a message and provides a rephrased version with sentiment analysis and suggestions.

#### Request Body

```json
{
  "rawMessage": "You never listen to me! You always ignore what I say!",  // Required
  "senderContext": "Person experiencing frustration in a family relationship",  // Required
  "recipientContext": "Family member who may feel defensive",  // Required
  "conversationHistory": [  // Optional: Previous messages in the conversation
    "Earlier: I tried to talk about this yesterday",
    "Earlier: You said you were too busy"
  ],
  "communicationGoal": "Express need for understanding and connection",  // Optional
  "profileId": "507f1f77bcf86cd799439011"  // Optional: User profile ID for personalization
}
```

#### Response

```json
{
  "sentimentAnalysis": {
    "detectedEmotion": "frustration",
    "escalationLevel": 7,
    "underlyingNeed": "feeling heard and understood"
  },
  "rephrasedMessage": "I feel frustrated when I don't feel heard. I'd really appreciate it if we could find a time to talk when you're able to give me your full attention.",
  "keyChanges": [
    "Replaced 'You never' with 'I feel' statements",
    "Transformed blame into vulnerability",
    "Changed demand into a request"
  ],
  "toneShift": "From accusatory to vulnerable and collaborative",
  "timingSuggestion": "Wait until both parties are calm and have time to engage fully",
  "alternativePhrasings": [
    "I'm feeling unheard and would love to connect when you have a moment.",
    "I notice I'm getting frustrated. Can we find a good time to talk?"
  ],
  "metadata": {
    "model": "claude-3-5-sonnet-latest",
    "latencyMs": 1234
  }
}
```

### Features

- **Sentiment Analysis**: Detects underlying emotions and escalation levels
- **Personalization**: Uses user profile to tailor communication style
- **Multiple Options**: Provides alternative phrasings for different approaches
- **Timing Suggestions**: Recommends when to send messages for best outcomes
- **Context Awareness**: Considers conversation history and relationship dynamics

### Usage Example

```typescript
import { mediateMessage } from '@/lib/api';

const result = await mediateMessage({
  rawMessage: "You never listen to me!",
  senderContext: "Person feeling frustrated",
  recipientContext: "Family member",
  conversationHistory: ["Previous message 1", "Previous message 2"],
  communicationGoal: "Express need for understanding",
  profileId: "507f1f77bcf86cd799439011",  // Optional
});

console.log(result.rephrasedMessage);
console.log(result.alternativePhrasings);
```

## Integration with Existing Features

### Profile Personalization

Both features can use the user's `AiProfile` for personalization:

- **Communication Mediator**: Uses `communicationGuidelines` (tone, do/avoid phrases) to tailor rephrasing
- **Crisis Alerts**: Can use `supportCircle` to automatically send alerts to configured contacts

### Error Handling

All endpoints follow consistent error handling patterns:

- **400 Bad Request**: Validation errors (Zod schema validation)
- **404 Not Found**: Resource not found (e.g., profile not found)
- **500 Internal Server Error**: Unexpected server errors
- **503 Service Unavailable**: External service not configured (e.g., Twilio)

## Testing

### Twilio Testing

For development/testing, you can use Twilio's test credentials or a test phone number. The service will log warnings if Twilio is not configured but won't crash the application.

### Mediator Testing

The mediator service works independently of Twilio and can be tested with any valid request payload. It requires `ANTHROPIC_API_KEY` to be set.

## Security Considerations

1. **Phone Number Privacy**: Phone numbers are validated but not stored
2. **Message Content**: Messages are sent directly to Twilio and not logged in detail
3. **Rate Limiting**: Consider adding rate limiting for production use
4. **Authentication**: Add authentication middleware before production deployment

## Future Enhancements

- **Webhook Support**: Receive Twilio delivery status updates
- **Message Templates**: Pre-defined message templates for common scenarios
- **Batch Alerts**: Send alerts to multiple support circle members
- **Mediator History**: Store mediation history for learning and improvement
- **Real-time Mediation**: WebSocket support for real-time message mediation



