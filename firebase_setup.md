# Firebase Setup Guide for First Baptist Church Fenton Website

This guide provides step-by-step instructions to configure Firebase Authentication and Firestore Database for the church website.

## Prerequisites

- Firebase project already created: `first-baptist-church-fenton`
- Environment variables configured in `.env.local`
- Firebase SDK already integrated in the codebase

## Step 1: Enable Firebase Authentication

### 1.1 Access Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **first-baptist-church-fenton**

### 1.2 Enable Email/Password Authentication
1. In the left sidebar, click **Authentication**
2. Click the **Get started** button (if this is your first time)
3. Go to the **Sign-in method** tab
4. Find **Email/Password** in the list
5. Click on **Email/Password**
6. Toggle **Enable** to ON
7. Leave **Email link (passwordless sign-in)** disabled for now
8. Click **Save**

### 1.3 Configure Authorized Domains
1. Still in **Authentication** → **Sign-in method**
2. Scroll down to **Authorized domains**
3. You should see `localhost` already listed
4. If not, click **Add domain** and add:
   - `localhost`
   - `firstbaptistchurchfenton.vercel.app` (for production)
5. Click **Done**

## Step 2: Enable Firestore Database

### 2.1 Create Firestore Database
1. In the left sidebar, click **Firestore Database**
2. Click **Create database**
3. Choose **Start in production mode** (we'll configure rules next)
4. Select a location (recommended: `us-central1`)
5. Click **Done**

### 2.2 Configure Security Rules
1. In Firestore Database, click the **Rules** tab
2. Replace the default rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      // Admins can read all user documents
      allow read: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Public content - everyone can read, authenticated users can write
    match /events/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Blog posts - everyone can read, authenticated users can write
    match /blog/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Prayer requests - authenticated users only
    match /prayers/{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Admin-only collections
    match /admin/{document=**} {
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Analytics and logs - admin only
    match /analytics/{document=**} {
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

3. Click **Publish**

## Step 3: Create Initial Admin User

### 3.1 Update Admin Email in Environment
1. Open `.env.local`
2. Set the `ADMIN_EMAIL` to your actual admin email:
   ```
   ADMIN_EMAIL=your-admin-email@example.com
   ```

### 3.2 Register First Admin User
1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:9002/register`
3. Register using the email address you set as `ADMIN_EMAIL`
4. This user will automatically get admin privileges

## Step 4: Test Firebase Integration

### 4.1 Test Authentication
1. Try registering a new user at `/register`
2. Try logging in at `/login`
3. Check the browser console for any errors
4. Verify users appear in Firebase Console → Authentication → Users

### 4.2 Test Firestore
1. Check Firebase Console → Firestore Database → Data
2. You should see a `users` collection with your registered users
3. No 400 errors should appear in the browser console

## Step 5: Optional Configurations

### 5.1 Email Verification (Optional)
1. In Authentication → Templates
2. Customize email verification templates
3. Enable email verification in your app code if desired

### 5.2 Password Reset (Optional)
1. In Authentication → Templates
2. Customize password reset email template
3. The reset functionality is already implemented in the codebase

### 5.3 Additional Sign-in Methods (Optional)
You can enable additional providers:
- Google
- Facebook
- Twitter
- GitHub

## Troubleshooting

### Common Issues

**Error: `auth/configuration-not-found`**
- Solution: Make sure Email/Password is enabled in Authentication → Sign-in method

**Firestore 400 errors**
- Solution: Check that Firestore is created and security rules are published

**Permission denied errors**
- Solution: Verify security rules allow the operation you're trying to perform

**Admin user not working**
- Solution: Ensure `ADMIN_EMAIL` in `.env.local` matches the registered user's email exactly

### Verification Steps

1. **Authentication enabled**: Firebase Console → Authentication should show "Email/Password" as enabled
2. **Firestore created**: Firebase Console → Firestore Database should show your database
3. **Rules published**: Firestore → Rules should show your custom rules
4. **Environment variables**: All Firebase config variables in `.env.local` should be set

## Production Deployment

When deploying to production:

1. Add your production domain to Authorized Domains in Firebase Console
2. Update `.env.local` URLs to production URLs:
   ```
   GOOGLE_REDIRECT_URI=https://your-domain.com/api/calendar/callback
   NEXTAUTH_URL=https://your-domain.com
   ```
3. Set up environment variables in your hosting platform (Vercel, etc.)

## Security Best Practices

1. **Never commit** Firebase private keys or sensitive config to version control
2. **Use different projects** for development and production
3. **Regularly review** Firestore security rules
4. **Monitor authentication** activity in Firebase Console
5. **Enable app check** for additional security (optional)

## Support

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

---

**Last Updated**: July 2025
**Project**: First Baptist Church Fenton Website
**Firebase Project**: first-baptist-church-fenton