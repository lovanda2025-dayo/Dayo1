# Flame Match - Backend API

Modern dating platform backend built with Node.js, Express, TypeScript, and Supabase. PWA-ready with intelligent caching and optimized performance.

## Features

- **Authentication** - JWT-based auth with Supabase
- **User Profiles** - Complete profile management with details
- **Matching System** - Mutual like-based matching
- **Real-time Chat** - Message history and read status
- **Photo Management** - Profile photo uploads to Supabase Storage
- **Interactions** - Like, pass, favorite, archive, comment
- **Security** - Row-Level Security (RLS), CORS, rate limiting, helmet.js
- **Performance** - Compression, indexing, efficient queries
- **PWA Ready** - Caching headers, compression, HTTP/2 compatible

## Tech Stack

- **Runtime**: Node.js with ES modules
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **Security**: Helmet.js, CORS, Rate Limiting

## Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

```
PORT=3000
NODE_ENV=development

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

FRONTEND_URL=http://localhost:5173

MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Database Setup

The database schema is already created via migrations. All tables include:
- Row-Level Security (RLS) enabled
- Proper indexes for performance
- Foreign key constraints for data integrity

## Development

```bash
npm run dev
```

The server runs on `http://localhost:3000` with hot reload.

## Build

```bash
npm run build
```

Compiles TypeScript to JavaScript in the `dist/` directory.

## Production

```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/verify` - Verify token validity

### Profiles
- `GET /api/profiles/me` - Get current user profile
- `GET /api/profiles/:userId` - Get user profile
- `PUT /api/profiles/me` - Update profile
- `PUT /api/profiles/me/details` - Update profile details
- `GET /api/profiles/explore/feed` - Get profiles feed

### Interactions
- `POST /api/interactions` - Create interaction (like, pass, comment, etc.)
- `GET /api/interactions/user/:userId` - Get user interactions
- `GET /api/interactions/stats` - Get interaction statistics

### Matches
- `GET /api/matches` - Get all user matches
- `GET /api/matches/:matchId` - Get specific match

### Messages
- `POST /api/messages/:matchId` - Send message
- `GET /api/messages/:matchId` - Get match messages
- `PATCH /api/messages/:messageId/read` - Mark message as read

### Upload
- `POST /api/upload/avatar` - Upload profile avatar
- `POST /api/upload/profile-photos` - Upload profile photos (multiple)
- `DELETE /api/upload/profile-photos/:photoId` - Delete profile photo

## Security Features

### Authentication
- JWT tokens via Supabase Auth
- Token refresh mechanism
- Session-based validation

### Database
- Row-Level Security (RLS) on all tables
- Users can only access their own data
- Policies enforce data ownership
- Foreign key constraints prevent data integrity issues

### API Security
- Helmet.js for security headers
- CORS protection
- Rate limiting (100 requests per 15 minutes)
- Input validation and error handling
- HTTPS in production

### File Upload
- File type validation (JPEG, PNG, WebP)
- File size limits (5MB)
- Secure storage in Supabase Storage
- URL generation for public access

## Database Schema

### profiles
User profile basic information with authentication link.

### profile_details
Extended profile information (interests, lifestyle, preferences).

### profile_photos
User photo gallery for dating profiles.

### interactions
User actions (likes, passes, comments, favorites, archives).

### matches
Mutual likes creating matches between users.

### messages
Chat messages between matched users.

All tables are protected by RLS and include proper indexes for query optimization.

## Performance Optimization

- **Compression**: gzip compression on responses
- **Caching**: Strategic HTTP caching headers
- **Database Indexes**: On frequently queried columns
- **Query Optimization**: SELECT specific columns when possible
- **Rate Limiting**: Prevent abuse and DDoS
- **Connection Pooling**: Supabase handles connection pooling
- **Pagination**: Feed endpoints support limit/offset

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "status": 400
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not found
- `500` - Internal server error

## Deployment

### Environment Variables for Production
- Set `NODE_ENV=production`
- Ensure `FRONTEND_URL` matches your production domain
- Use strong secret keys from Supabase
- Enable rate limiting with appropriate limits

### Recommended Hosting
- Vercel (with Node.js runtime)
- Heroku
- Railway
- DigitalOcean
- AWS EC2 / Elastic Beanstalk

## Frontend Integration

The frontend should use the API with:

```typescript
const API_BASE = process.env.VITE_API_URL || 'http://localhost:3000/api';

// Example: Login
const response = await fetch(`${API_BASE}/auth/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email, password }),
});

const { user, session } = await response.json();

// Example: Get profile
const response = await fetch(`${API_BASE}/profiles/me`, {
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
  },
});

const profile = await response.json();
```

## PWA Optimization

The backend supports PWA features:
- Service worker compatible endpoints
- Compression for smaller payloads
- Cache-friendly headers
- Stateless architecture for offline support
- JSON API format for efficient caching

## License

MIT
