# Firebase Setup Instructions

## Current Issue
The Firebase project is experiencing permission errors because Firestore security rules are not properly configured.

## Quick Fix (Development Only)
To quickly resolve the permission errors for development:

1. **Open Firebase Console**: Go to https://console.firebase.google.com/
2. **Select your project**: first-baptist-church-fenton
3. **Navigate to Firestore Database**
4. **Go to Rules tab**
5. **Temporarily use test mode rules** (WARNING: This allows all access):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## Proper Setup (Recommended)
For production-ready security:

1. **Install Firebase CLI** (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Initialize Firebase in this project** (if not already done):
   ```bash
   firebase init
   ```
   - Select Firestore, Functions, Hosting, and Storage
   - Use existing project: first-baptist-church-fenton

4. **Deploy the security rules**:
   ```bash
   firebase deploy --only firestore:rules
   firebase deploy --only storage
   ```

## Files Created
- `firestore.rules` - Security rules for Firestore database
- `storage.rules` - Security rules for Firebase Storage  
- `firebase.json` - Firebase project configuration
- `firestore.indexes.json` - Database indexes for query optimization

## Environment Variables Required
Make sure these are set in your Firebase project:
- Authentication providers enabled (Email/Password)
- Admin email configured: `marcdejesusdev@gmail.com`

## Next Steps
1. Deploy the rules using Firebase CLI
2. Restart your development server
3. Test that the permission errors are resolved