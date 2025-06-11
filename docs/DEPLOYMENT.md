# Deployment Guide

This guide covers how to deploy the First Baptist Church of Fenton website to various hosting platforms.

## 🚀 Quick Deploy Options

### Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications and is recommended for this project.

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect it's a Next.js project

3. **Configure Environment Variables**
   - In Vercel dashboard, go to Project Settings > Environment Variables
   - Add all variables from your `.env.local` file
   - Make sure to set `NEXTAUTH_URL` to your production domain

4. **Update OAuth Redirect URI**
   - Go to Google Cloud Console > Credentials
   - Edit your OAuth 2.0 client
   - Add production redirect URI: `https://your-domain.vercel.app/api/calendar/callback`

### Netlify

1. **Build Configuration**
   Create `netlify.toml` in your project root:
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **Deploy**
   - Push to GitHub
   - Connect repository in Netlify dashboard
   - Configure environment variables
   - Deploy

### Other Platforms

The application can be deployed to any platform that supports Node.js:
- **AWS Amplify**
- **Railway**
- **Render**
- **DigitalOcean App Platform**
- **Heroku** (with buildpack)

## 🔧 Production Configuration

### Environment Variables for Production

Update these variables for production deployment:

```bash
# Update this to your production domain
NEXTAUTH_URL=https://your-church-website.com

# Update OAuth redirect URI
GOOGLE_REDIRECT_URI=https://your-church-website.com/api/calendar/callback

# Keep all other environment variables the same
```

### Google Cloud Console Updates

1. **OAuth 2.0 Configuration**
   - Add production domain to authorized origins
   - Add production callback URL to authorized redirect URIs

2. **Calendar API Quotas**
   - Monitor API usage in Google Cloud Console
   - Consider increasing quotas if needed for high traffic

### Performance Optimizations

1. **Image Optimization**
   - Next.js automatically optimizes images
   - Consider using a CDN for large image assets

2. **Caching**
   - Calendar events are cached for performance
   - Consider implementing Redis for larger deployments

3. **Database**
   - Currently using localStorage for RSVPs
   - Consider implementing a database for user data persistence in production

## 📊 Monitoring and Analytics

### Error Monitoring

Add error monitoring with services like:
- **Sentry**: Real-time error tracking
- **LogRocket**: Session replay and logging
- **Vercel Analytics**: Built-in for Vercel deployments

### Performance Monitoring

- **Vercel Web Analytics**: Page views and performance
- **Google Analytics**: Detailed user analytics
- **Core Web Vitals**: Monitor loading performance

### Example Sentry Setup

1. **Install Sentry**
   ```bash
   npm install @sentry/nextjs
   ```

2. **Configure Sentry**
   Create `sentry.client.config.js`:
   ```javascript
   import * as Sentry from "@sentry/nextjs";

   Sentry.init({
     dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
     tracesSampleRate: 1.0,
   });
   ```

## 🔒 Security Considerations

### Environment Variables

- Never commit `.env.local` or `.env` files
- Use platform-specific environment variable management
- Rotate API keys regularly

### HTTPS

- Ensure HTTPS is enabled (automatic with Vercel/Netlify)
- Update OAuth configurations to use HTTPS URLs only

### CORS

- Google Calendar API automatically handles CORS
- No additional configuration needed for calendar integration

### Data Privacy

- RSVPs are currently stored in localStorage
- Consider privacy policy for data collection
- Implement GDPR compliance if serving EU users

## 🚨 Troubleshooting

### Common Deployment Issues

1. **Build Failures**
   ```bash
   # Check for TypeScript errors
   npm run typecheck
   
   # Check for linting errors
   npm run lint
   ```

2. **Calendar API Issues**
   - Verify environment variables are set correctly
   - Check Google Cloud Console quotas
   - Ensure service account has proper permissions

3. **OAuth Redirect Issues**
   - Verify redirect URI matches exactly (including https/http)
   - Check that domain is added to authorized origins

### Debug Mode

Enable debug logging in production:
```bash
# Add to environment variables
DEBUG=calendar:*
```

## 📱 Mobile Considerations

The website is fully responsive, but consider:
- Testing on actual mobile devices
- Progressive Web App (PWA) features
- Push notifications for event reminders

## 🔄 Continuous Deployment

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📈 Scaling

As your church grows, consider:

1. **Database Migration**
   - Move from localStorage to proper database
   - Implement user authentication
   - Add admin dashboard

2. **CDN for Assets**
   - Use Cloudinary for image optimization
   - Implement video streaming for sermons

3. **Caching Strategy**
   - Redis for session storage
   - Cache calendar events more aggressively
   - Implement service worker for offline support

## 🆘 Support

If you encounter deployment issues:
1. Check the platform-specific documentation
2. Review error logs in your deployment platform
3. Verify all environment variables are set correctly
4. Test the build locally before deploying

---

**Need help?** Create an issue in the GitHub repository with your deployment logs and configuration details. 