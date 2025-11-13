# Backend Setup Guide - Flame Match

## Overview

The backend is located in the `server/` directory and provides a complete REST API for the Flame Match dating platform.

## Quick Start

### 1. Install Backend Dependencies

```bash
cd server
npm install
```

### 2. Environment Setup

The `.env` file is already configured with Supabase credentials. It's ready to use for development.

### 3. Start Development Server

```bash
npm run dev
```

The backend will run on `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

## API Base URL

Update your frontend `.env` to connect to the backend:

```
VITE_API_URL=http://localhost:3000/api
```

## Key Endpoints

### Authentication
```
POST   /api/auth/register       - Register new user
POST   /api/auth/login          - Login with email/password
POST   /api/auth/logout         - Logout user
POST   /api/auth/refresh        - Refresh access token
POST   /api/auth/verify         - Verify token validity
```

### User Profiles
```
GET    /api/profiles/me         - Get own profile
GET    /api/profiles/:userId    - Get user profile
PUT    /api/profiles/me         - Update profile
PUT    /api/profiles/me/details - Update profile details
GET    /api/profiles/explore/feed - Get exploration feed
```

### Interactions (Like, Pass, Comment, etc.)
```
POST   /api/interactions        - Create interaction
GET    /api/interactions/user/:userId - Get user interactions
GET    /api/interactions/stats  - Get stats (likes, matches, comments)
```

### Matches
```
GET    /api/matches             - Get all matches
GET    /api/matches/:matchId    - Get specific match
```

### Messages
```
POST   /api/messages/:matchId   - Send message
GET    /api/messages/:matchId   - Get messages from match
PATCH  /api/messages/:messageId/read - Mark message as read
```

### File Upload
```
POST   /api/upload/avatar       - Upload profile avatar
POST   /api/upload/profile-photos - Upload multiple photos
DELETE /api/upload/profile-photos/:photoId - Delete photo
```

## Database Schema

The database is automatically set up with:

- **profiles** - User basic information
- **profile_details** - Extended profile info (interests, lifestyle, etc.)
- **profile_photos** - Photo gallery for each user
- **interactions** - User actions (likes, passes, comments)
- **matches** - Mutual likes between users
- **messages** - Chat messages between matched users

All tables have:
- Row-Level Security (RLS) enabled
- Proper indexes for performance
- Foreign key constraints for data integrity

## Frontend Integration

### 1. Add API URL to Frontend .env

```
VITE_API_URL=http://localhost:3000/api
```

### 2. Create API Service

Example in frontend:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
}

export async function getProfile(token: string) {
  const response = await fetch(`${API_URL}/profiles/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
}
```

### 3. Store Auth Token

Save the JWT token from login response:

```typescript
const { session } = await login(email, password);
localStorage.setItem('auth_token', session.access_token);
localStorage.setItem('refresh_token', session.refresh_token);
```

### 4. Include Token in Requests

Always include the authorization header:

```typescript
const token = localStorage.getItem('auth_token');
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
};
```

## File Upload

### Upload Avatar

```typescript
const formData = new FormData();
formData.append('file', avatarFile);

const response = await fetch(`${API_URL}/upload/avatar`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
  body: formData,
});

const { url } = await response.json();
```

### Upload Profile Photos

```typescript
const formData = new FormData();
photos.forEach(photo => {
  formData.append('files', photo);
});

const response = await fetch(`${API_URL}/upload/profile-photos`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
  body: formData,
});

const uploadedPhotos = await response.json();
```

## Security

### CORS
- Frontend must be running on configured URL (default: http://localhost:5173)
- Credentials are allowed

### Rate Limiting
- 100 requests per 15 minutes per IP
- Disabled in development mode

### Database
- All data is protected by Row-Level Security (RLS)
- Users can only access their own data
- Interactions are logged and verified

### File Upload
- Only JPEG, PNG, WebP allowed
- Max file size: 5MB
- Files stored securely in Supabase Storage

## Deployment

### Environment Variables (Production)

```
PORT=3000
NODE_ENV=production
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
FRONTEND_URL=https://yourdomain.com
```

### Recommended Platforms

- **Vercel** - Best for Next.js, but works with Express
- **Railway** - Simple deployment with environment variables
- **Render** - Good free tier and auto-deploy from GitHub
- **Heroku** - Classic option with good documentation
- **DigitalOcean** - Self-hosted with full control

### Health Check

```
GET http://localhost:3000/health
```

Returns:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## Development Tips

### Debugging

Enable verbose logging:

```typescript
// In config.ts
if (config.nodeEnv === 'development') {
  console.log('Request:', req.method, req.path);
}
```

### Database Queries

Test queries in Supabase dashboard:
1. Go to https://supabase.co
2. Select your project
3. Open SQL Editor
4. Run queries directly

### Testing API

Use REST client tools:
- **Insomnia** - GUI client
- **Postman** - Popular and feature-rich
- **Thunder Client** - VS Code extension
- **curl** - Command line tool

Example:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000 (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Database Connection Error

1. Check `.env` file has correct Supabase URL and keys
2. Verify Supabase project is active
3. Check network connectivity

### CORS Error

1. Update `FRONTEND_URL` in `.env` to match your frontend URL
2. Restart backend server

### File Upload Fails

1. Check file size is under 5MB
2. Verify file format is JPEG, PNG, or WebP
3. Ensure Supabase Storage buckets exist

## Next Steps

1. Start frontend: `npm run dev` (from root)
2. Start backend: `npm run dev` (from server directory)
3. Login with test account
4. Test API endpoints using browser DevTools or Postman

## Support

For issues:
1. Check logs in console
2. Review API response status and error message
3. Verify database RLS policies in Supabase dashboard
4. Check network tab in browser DevTools
