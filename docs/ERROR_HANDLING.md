# Error Handling Documentation

This church website includes comprehensive error handling to ensure a good user experience even when things go wrong.

## 📋 Error Pages Overview

| File | Purpose | When It's Used |
|------|---------|----------------|
| `src/app/not-found.tsx` | 404 - Page Not Found | When a user visits a non-existent URL |
| `src/app/error.tsx` | General Error Boundary | Server errors, component failures, API issues |
| `src/app/global-error.tsx` | Root Layout Errors | Critical application errors, root layout failures |
| `src/app/loading.tsx` | Loading State | While pages/components are loading |
| `src/app/events/error.tsx` | Events-Specific Errors | Calendar/event-related failures |

## 🎯 Features

### 404 Page (`not-found.tsx`)
- **Church-branded design** with warm colors
- **Quick navigation** to main sections (Events, Sermons, Ministries, Contact)
- **Go back button** using browser history
- **Contact support** link for assistance

### General Error Page (`error.tsx`)
- **Automatic error logging** for debugging
- **Try again button** to attempt recovery
- **Development mode** shows detailed error information
- **Contact options** for user support
- **Error tracking ID** for support purposes

### Global Error Page (`global-error.tsx`)
- **Minimal dependencies** (inline styles for reliability)
- **Complete HTML document** (bypasses layout issues)
- **Critical error handling** when the entire app fails
- **Church contact information** for urgent support

### Events Error Page (`events/error.tsx`)
- **Calendar-specific messaging** about service disruptions
- **Alternative access methods** (direct Google Calendar link)
- **Service times fallback** information
- **Event-specific recovery options**

### Loading Page (`loading.tsx`)
- **Consistent branding** with church theme
- **Animated indicators** for better UX
- **Professional appearance** during load times

## 🛠️ Technical Implementation

### Error Boundaries
```typescript
// Pages automatically include error boundaries
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Error handling logic
}
```

### Client Components
- Error pages that need interactivity use `'use client'` directive
- Back buttons and retry functionality work properly
- Browser history navigation supported

### Development vs Production
- **Development**: Shows detailed error messages and stack traces
- **Production**: Shows user-friendly messages only
- **Error IDs**: Generated for tracking in production

## 🎨 Design Principles

1. **Consistent Branding**: All error pages match the church's visual identity
2. **Helpful Actions**: Clear next steps for users
3. **Contact Options**: Easy ways to get help
4. **Graceful Degradation**: Fallback information when services fail
5. **Professional Appearance**: Maintains trust even during errors

## 🔄 Error Recovery

### Automatic Recovery
- **Retry buttons** attempt to reload failed components
- **Navigation options** help users find working pages
- **Fallback content** provides essential information

### User Actions
- **Go Home**: Return to the main page
- **Go Back**: Use browser history
- **Contact Support**: Multiple ways to get help
- **Direct Links**: Alternative access to important content

## 📊 Error Tracking

### Logging
```typescript
useEffect(() => {
  // Log errors for monitoring
  console.error('Application error:', error);
}, [error]);
```

### Error IDs
- Unique identifiers for each error instance
- Helpful for support team to track issues
- Displayed to users in production

## 🚨 Testing Error Pages

### Development Testing
1. Create intentional errors in components
2. Visit non-existent URLs
3. Simulate network failures
4. Test recovery actions

### Production Monitoring
- Monitor error rates and patterns
- Track user recovery actions
- Analyze support contact frequency

## 📞 Support Integration

All error pages include:
- **Church contact information**
- **Email links** for support requests
- **Phone numbers** for urgent issues
- **Error context** for support team

## 🔧 Customization

To customize error pages:

1. **Update contact information** in error page components
2. **Modify church branding** (colors, fonts, logos)
3. **Add monitoring services** (Sentry, LogRocket, etc.)
4. **Customize error messages** for your church's voice
5. **Add specific recovery options** for your services

This comprehensive error handling system ensures that your church website maintains a professional appearance and helpful user experience even when technical issues occur. 