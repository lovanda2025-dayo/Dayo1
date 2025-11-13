# Flame Match - Quick Start Guide

Modern dating platform with React frontend + Node.js/Express backend, powered by Supabase.

## Directory Structure

```
project/
├── src/                      # Frontend (React/TypeScript)
│   ├── services/
│   │   └── api.ts           # API client for backend
│   ├── components/          # React components
│   └── ...
├── server/                  # Backend (Node.js/Express/TypeScript)
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Auth, error handling, caching
│   │   ├── index.ts        # Server entry point
│   │   └── ...
│   └── package.json
├── .env                     # Supabase credentials (pre-configured)
├── .env.backend            # Backend API URL
├── BACKEND_SETUP.md        # Backend documentation
├── INTEGRATION_GUIDE.md    # Frontend-Backend integration
└── QUICKSTART.md           # This file
```

## 1. Install Dependencies

### Backend
```bash
cd server
npm install
cd ..
```

### Frontend
```bash
npm install
```

## 2. Start Development

### Option A: Run Both (requires concurrently)

```bash
npm run dev
```

### Option B: Run Separately

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## 3. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api
- Backend Health: http://localhost:3000/health

## 4. Test the System

### Register New User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe",
    "age": 25,
    "gender": "male"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

Save the `access_token` from response for testing other endpoints.

### Get Profile

```bash
curl -X GET http://localhost:3000/api/profiles/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Backend Features

### Authentication (`/api/auth`)
- ✅ Register with email/password
- ✅ Login
- ✅ Logout
- ✅ Token refresh
- ✅ Token verification

### Profiles (`/api/profiles`)
- ✅ Get own profile with photos & details
- ✅ Get public profile
- ✅ Update profile
- ✅ Update profile details
- ✅ Explore feed (paginated)

### Interactions (`/api/interactions`)
- ✅ Like/Pass/Favorite/Archive/Comment
- ✅ Get user interactions
- ✅ Get interaction statistics

### Matches (`/api/matches`)
- ✅ Get all matches
- ✅ Get specific match
- ✅ Automatic match on mutual like

### Messages (`/api/messages`)
- ✅ Send message to matched user
- ✅ Get message history (paginated)
- ✅ Mark message as read

### File Upload (`/api/upload`)
- ✅ Upload avatar
- ✅ Upload multiple profile photos
- ✅ Delete photos

## Database

All tables are protected by Row-Level Security (RLS):

- **profiles** - User basic info
- **profile_details** - Extended info (interests, lifestyle, etc.)
- **profile_photos** - Photo gallery
- **interactions** - Like, pass, comment, favorite, archive
- **matches** - Mutual likes
- **messages** - Chat history

## Security

- ✅ JWT authentication via Supabase
- ✅ Row-Level Security on database
- ✅ Rate limiting (100 req/15min)
- ✅ Helmet.js security headers
- ✅ CORS protection
- ✅ Input validation
- ✅ Secure file upload

## Frontend Integration

The frontend has API service pre-configured in `src/services/api.ts`:

```typescript
import { authAPI, profileAPI, matchAPI, messageAPI } from '@/services/api';

// Example: Login
const { session } = await authAPI.login(email, password);

// Example: Get profile
const profile = await profileAPI.getMe(session.access_token);

// Example: Get matches
const matches = await matchAPI.getAll(session.access_token);
```

See `INTEGRATION_GUIDE.md` for detailed examples.

## Environment Variables

### Frontend (`.env.backend`)
```
VITE_API_URL=http://localhost:3000/api
```

### Backend (`.env`)
```
SUPABASE_URL=<your-supabase-url>
SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
FRONTEND_URL=http://localhost:5173
```

Pre-configured with your Supabase credentials.

## Deployment

### Frontend
```bash
npm run build
npm run preview
```

Deploy to:
- Vercel
- Netlify
- GitHub Pages
- Any static host

### Backend
```bash
cd server
npm run build
npm start
```

Deploy to:
- Vercel (serverless)
- Railway
- Render
- Heroku
- DigitalOcean

## Performance Features

- ✅ Compression (gzip)
- ✅ Database indexing
- ✅ Pagination on feeds
- ✅ HTTP caching headers
- ✅ Rate limiting
- ✅ Connection pooling (Supabase)
- ✅ Efficient queries (selected columns)

## PWA Ready

Backend supports PWA features:
- Cache-friendly headers
- Compression for smaller payloads
- Stateless architecture
- JSON API format

## Common Tasks

### Update Frontend API URL

Edit `.env.backend` or create `.env.local`:
```
VITE_API_URL=http://localhost:3000/api
```

Then restart frontend.

### Reset Password

1. Use Supabase dashboard
2. Or implement password reset endpoint

### Bulk User Import

Use Supabase SQL editor:
```sql
INSERT INTO profiles (id, email, name, age, gender)
VALUES (gen_random_uuid(), 'user@example.com', 'John', 25, 'male');
```

### Monitor Backend

```bash
# Health check
curl http://localhost:3000/health

# Logs (in development)
# Check terminal running: npm run dev
```

## Troubleshooting

### Backend not starting
```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill the process
lsof -ti:3000 | xargs kill -9
```

### CORS error
1. Check `FRONTEND_URL` in server `.env`
2. Restart backend
3. Hard refresh frontend (Ctrl+Shift+R)

### Database connection error
1. Verify Supabase credentials in `.env`
2. Check internet connection
3. Verify Supabase project is active

### File upload fails
1. Check file size < 5MB
2. Verify format: JPEG, PNG, or WebP
3. Check storage buckets in Supabase

## Next Steps

1. ✅ Install dependencies
2. ✅ Start backend: `cd server && npm run dev`
3. ✅ Start frontend: `npm run dev`
4. ✅ Test registration/login
5. ✅ Test profile creation
6. ✅ Test interactions (like, pass)
7. ✅ Test matching
8. ✅ Test messaging

## Documentation

- `BACKEND_SETUP.md` - Complete backend guide
- `INTEGRATION_GUIDE.md` - Frontend-backend integration
- `server/README.md` - Backend API reference
- `server/IMPLEMENTATION.md` - Implementation details

## Support

For issues:
1. Check the console/terminal for errors
2. Review relevant documentation
3. Check Supabase dashboard status
4. Verify environment variables
5. Check network tab in browser DevTools

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + TypeScript + Vite |
| Backend | Node.js + Express + TypeScript |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (JWT) |
| Storage | Supabase Storage |
| Styling | Glassmorphism design |

---

**Ready to go!** Start developing your dating platform. 🚀
