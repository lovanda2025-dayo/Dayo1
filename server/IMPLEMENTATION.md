# Backend Implementation Details

## Architecture

The backend follows a modular Express.js architecture with clear separation of concerns:

### File Structure

```
server/
├── src/
│   ├── index.ts              # Main server entry point
│   ├── config.ts             # Configuration management
│   ├── supabase.ts          # Supabase client setup
│   ├── types/
│   │   └── index.ts         # TypeScript type definitions
│   ├── middleware/
│   │   ├── auth.ts          # Authentication middleware
│   │   ├── errorHandler.ts  # Global error handling
│   │   └── cache.ts         # Cache control middleware
│   └── routes/
│       ├── auth.ts          # Authentication endpoints
│       ├── profiles.ts      # Profile management
│       ├── interactions.ts  # Like, pass, comment, etc.
│       ├── matches.ts       # Match management
│       ├── messages.ts      # Chat functionality
│       └── upload.ts        # File upload handling
├── dist/                    # Compiled JavaScript
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
└── .env                    # Environment variables
```

## Key Features

### 1. Authentication Flow

```
User Registration
  ↓
Supabase Auth (JWT)
  ↓
Profile Created in DB
  ↓
Session Token Returned

User Login
  ↓
Supabase Auth Verification
  ↓
Session Token Returned
  ↓
Token stored in frontend (localStorage)
```

### 2. Authorization

- JWT tokens via Bearer header
- Row-Level Security (RLS) on database level
- Middleware verification on each protected route

### 3. Matching System

```
User A likes User B
  ↓
Check if User B already liked User A
  ├─ YES → Create Match (mutual like)
  └─ NO  → Store interaction

User B likes User A
  ↓
Check for existing interaction from User A
  ├─ YES → Create Match
  └─ NO  → Store interaction
```

### 4. Messaging

- Messages only sent between matched users
- Automatic read status tracking
- Message history with pagination
- Related to matches (cannot message without match)

### 5. File Upload

```
Client Upload
  ↓
Multer handles in-memory storage
  ↓
Upload to Supabase Storage
  ↓
Generate public URL
  ↓
Save URL in database
  ↓
Return URL to client
```

## Database Design

### Relationships

```
profiles (1) ──→ (many) profile_details
            ──→ (many) profile_photos
            ──→ (many) interactions
            ──→ (many) matches

matches (1) ──→ (many) messages

interactions tracks:
- user_id → who performed action
- target_user_id → who received action
- interaction_type → like, pass, comment, etc.
```

### Security Features

1. **Row-Level Security (RLS)**
   - Users can only see their own profiles
   - Users can only see other profiles for discovery
   - Users can only interact with their own data

2. **Constraints**
   - No self-interactions (user can't like themselves)
   - Unique constraints on matches
   - Foreign key constraints on all relationships

3. **Indexes**
   - Fast lookups on frequently queried columns
   - Optimized sorting and filtering

## API Response Format

### Success Response
```json
{
  "data": { },
  "status": 200
}
```

### Error Response
```json
{
  "error": "Error message",
  "status": 400
}
```

## Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| PORT | Server port | 3000 |
| NODE_ENV | Environment mode | development |
| SUPABASE_URL | Supabase project URL | https://... |
| SUPABASE_ANON_KEY | Public API key | eyJ... |
| SUPABASE_SERVICE_ROLE_KEY | Admin key | eyJ... |
| FRONTEND_URL | CORS origin | http://localhost:5173 |
| MAX_FILE_SIZE | Max upload size | 5242880 |
| ALLOWED_FILE_TYPES | Allowed MIME types | image/jpeg,... |

## Performance Optimizations

### Query Optimization
- Select specific columns instead of *
- Use pagination on large result sets
- Index frequently queried columns
- Batch operations when possible

### Caching Strategy
- HTTP cache headers for static data
- Database query results cached at API level
- Client-side caching for profile photos

### Middleware Optimization
- Compression (gzip) for responses
- Rate limiting to prevent abuse
- Early error handling
- Helmet for security headers

## Error Handling

All endpoints use try-catch with AppError class:

```typescript
throw new AppError(statusCode, message);
```

Caught by global error handler and returned as JSON.

## Testing

### Manual Testing with curl

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"user@example.com",
    "password":"password123",
    "name":"John Doe",
    "age":25
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"user@example.com",
    "password":"password123"
  }'

# Get profile (with token)
curl -X GET http://localhost:3000/api/profiles/me \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create like interaction
curl -X POST http://localhost:3000/api/interactions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "target_user_id":"uuid-here",
    "interaction_type":"like"
  }'
```

## Deployment Checklist

- [ ] All environment variables set
- [ ] Database migrations applied
- [ ] Storage buckets created
- [ ] RLS policies enabled
- [ ] CORS properly configured
- [ ] Rate limiting appropriate
- [ ] Error logging configured
- [ ] Health check working
- [ ] Database backups enabled
- [ ] SSL/TLS configured

## Common Issues & Solutions

### CORS Error
- Check FRONTEND_URL matches your domain
- Restart server after .env changes

### Database Connection Error
- Verify Supabase credentials
- Check network connectivity
- Ensure project is active

### File Upload Fails
- Check file size < 5MB
- Verify file type is JPEG/PNG/WebP
- Ensure storage buckets exist

### Token Expired
- Implement refresh token flow
- Store refresh token securely
- Auto-refresh before expiry

## Future Enhancements

- [ ] WebSocket for real-time chat
- [ ] Push notifications
- [ ] Video call integration
- [ ] Advanced matching algorithm
- [ ] User verification (ID, video)
- [ ] Reporting and moderation tools
- [ ] Analytics dashboard
- [ ] Admin panel
- [ ] Multi-language support
- [ ] Subscription management
