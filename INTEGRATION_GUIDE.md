# Frontend-Backend Integration Guide

## Setup

### 1. Configure API URL

Create `.env.local` in the root directory:

```
VITE_API_URL=http://localhost:3000/api
```

Or use `.env.backend` which is already configured.

### 2. Use API Services

Import from `src/services/api.ts`:

```typescript
import {
  authAPI,
  profileAPI,
  interactionAPI,
  matchAPI,
  messageAPI,
  uploadAPI,
} from '@/services/api';
```

## Authentication Flow

### Register

```typescript
const response = await authAPI.register({
  email: 'user@example.com',
  password: 'password123',
  name: 'John Doe',
  age: 25,
  gender: 'male',
});

const { user, session } = response;
localStorage.setItem('auth_token', session.access_token);
localStorage.setItem('refresh_token', session.refresh_token);
```

### Login

```typescript
const response = await authAPI.login('user@example.com', 'password123');

const { user, session } = response;
localStorage.setItem('auth_token', session.access_token);
localStorage.setItem('refresh_token', session.refresh_token);
```

### Get Token

```typescript
const getToken = () => localStorage.getItem('auth_token');
```

## Profile Management

### Get Own Profile

```typescript
const token = localStorage.getItem('auth_token');
const profile = await profileAPI.getMe(token);

console.log(profile);
// {
//   id: 'uuid',
//   name: 'John Doe',
//   age: 25,
//   bio: 'My bio',
//   profile_details: { ... },
//   profile_photos: [ ... ]
// }
```

### Get Other Profile

```typescript
const profile = await profileAPI.getProfile(userId);
```

### Update Profile

```typescript
const token = localStorage.getItem('auth_token');

await profileAPI.updateProfile({
  name: 'Updated Name',
  age: 26,
  bio: 'New bio',
  gender: 'male',
  province: 'Luanda',
}, token);
```

### Update Profile Details

```typescript
await profileAPI.updateDetails({
  occupation: 'Software Engineer',
  company: 'Tech Company',
  smoking: 'Não',
  drinking: 'Socialmente',
  exercise: 'Ativo',
  interests: ['programação', 'viagens', 'música'],
  languages: ['português', 'inglês'],
  children: 'Talvez',
  life_desires: ['família', 'carreira'],
}, token);
```

### Get Explore Feed

```typescript
const profiles = await profileAPI.getExploreFeeds(token, 10, 0);

// profiles is array of profile objects
```

## Interactions

### Like/Pass/Comment

```typescript
// Like
await interactionAPI.create({
  target_user_id: 'uuid',
  interaction_type: 'like',
}, token);

// Pass
await interactionAPI.create({
  target_user_id: 'uuid',
  interaction_type: 'pass',
}, token);

// Comment (anonymous)
await interactionAPI.create({
  target_user_id: 'uuid',
  interaction_type: 'comment',
  comment_text: 'You seem interesting!',
}, token);

// Favorite
await interactionAPI.create({
  target_user_id: 'uuid',
  interaction_type: 'favorite',
}, token);

// Archive
await interactionAPI.create({
  target_user_id: 'uuid',
  interaction_type: 'archive',
}, token);
```

### Get Stats

```typescript
const stats = await interactionAPI.getStats(token);

console.log(stats);
// { likes: 5, matches: 2, comments: 3 }
```

## Matches

### Get All Matches

```typescript
const matches = await matchAPI.getAll(token);

// matches is array of:
// {
//   id: 'uuid',
//   user_id_1: 'uuid',
//   user_id_2: 'uuid',
//   matched_at: 'timestamp',
//   otherUser: {
//     id: 'uuid',
//     name: 'Jane Doe',
//     age: 24,
//     avatar_url: 'https://...',
//     bio: 'My bio'
//   }
// }
```

## Messaging

### Send Message

```typescript
const message = await messageAPI.send(matchId, 'Hello!', token);

console.log(message);
// {
//   id: 'uuid',
//   match_id: 'uuid',
//   sender_id: 'uuid',
//   content: 'Hello!',
//   read_at: null,
//   created_at: 'timestamp'
// }
```

### Get Messages

```typescript
const messages = await messageAPI.getMessages(matchId, token, 50, 0);

// messages is array ordered chronologically
```

### Mark as Read

```typescript
await messageAPI.markAsRead(messageId, token);
```

## File Upload

### Upload Avatar

```typescript
const file = document.querySelector('input[type="file"]').files[0];

const result = await uploadAPI.uploadAvatar(file, token);

console.log(result);
// { url: 'https://...', fileName: 'uuid/avatar-...jpg' }
```

### Upload Profile Photos

```typescript
const files = Array.from(document.querySelector('input[type="file"]').files);

const photos = await uploadAPI.uploadPhotos(files, token);

// photos is array:
// [
//   { id: 'uuid', photo_url: 'https://...', order: 0 },
//   { id: 'uuid', photo_url: 'https://...', order: 1 }
// ]
```

### Delete Photo

```typescript
await uploadAPI.deletePhoto(photoId, token);
```

## Error Handling

All API calls throw errors. Wrap in try-catch:

```typescript
try {
  const profile = await profileAPI.getMe(token);
} catch (error) {
  console.error(error.message);
  // Handle error: invalid token, network error, etc.
}
```

## Token Management

### Refresh Token

```typescript
const refreshToken = localStorage.getItem('refresh_token');

try {
  const response = await authAPI.refresh(refreshToken);
  localStorage.setItem('auth_token', response.session.access_token);
} catch (error) {
  // Redirect to login
}
```

### Auto-Refresh

Implement token refresh before expiry:

```typescript
const checkTokenExpiry = () => {
  const token = localStorage.getItem('auth_token');
  if (!token) return;

  const decoded = JSON.parse(atob(token.split('.')[1]));
  const expiryTime = decoded.exp * 1000;
  const now = Date.now();
  const timeUntilExpiry = expiryTime - now;

  // Refresh if expires in 5 minutes
  if (timeUntilExpiry < 5 * 60 * 1000) {
    refreshToken();
  }
};

// Call periodically or on route change
setInterval(checkTokenExpiry, 60000);
```

## Component Examples

### Login Component

```typescript
async function handleLogin(email: string, password: string) {
  try {
    const response = await authAPI.login(email, password);

    localStorage.setItem('auth_token', response.session.access_token);
    localStorage.setItem('refresh_token', response.session.refresh_token);

    // Redirect to main app
    navigate('/explore');
  } catch (error) {
    alert(`Login failed: ${error.message}`);
  }
}
```

### Profile View Component

```typescript
function ProfileView() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('auth_token');

  useEffect(() => {
    (async () => {
      try {
        const data = await profileAPI.getMe(token);
        setProfile(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>No profile found</div>;

  return (
    <div>
      <h1>{profile.name}, {profile.age}</h1>
      <p>{profile.bio}</p>
      {/* ... */}
    </div>
  );
}
```

### Like Interaction

```typescript
async function handleLike(targetUserId: string) {
  const token = localStorage.getItem('auth_token');

  try {
    const result = await interactionAPI.create({
      target_user_id: targetUserId,
      interaction_type: 'like',
    }, token);

    if (result.matched) {
      alert('You matched!');
      // Redirect to match
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}
```

### Chat Component

```typescript
function ChatScreen({ matchId }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('auth_token');

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 3000); // Poll for new messages
    return () => clearInterval(interval);
  }, [matchId]);

  async function loadMessages() {
    try {
      const msgs = await messageAPI.getMessages(matchId, token);
      setMessages(msgs);
    } catch (error) {
      console.error(error);
    }
  }

  async function sendMessage() {
    if (!message.trim()) return;

    try {
      await messageAPI.send(matchId, message, token);
      setMessage('');
      await loadMessages();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  }

  return (
    <div>
      {messages.map(msg => (
        <div key={msg.id}>
          <p>{msg.content}</p>
          <small>{new Date(msg.created_at).toLocaleString()}</small>
        </div>
      ))}
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
```

## Running Both Frontend and Backend

### Option 1: Separate Terminals

Terminal 1 - Backend:
```bash
cd server
npm run dev
```

Terminal 2 - Frontend:
```bash
npm run dev
```

### Option 2: Concurrent (if concurrently installed)

```bash
npm run dev
```

This runs both frontend and backend together if `concurrently` is installed.

## Production Deployment

When deploying to production:

1. Update `VITE_API_URL` to production backend URL
2. Ensure CORS is configured for production domain
3. Use HTTPS for both frontend and backend
4. Set `NODE_ENV=production` on backend
5. Enable rate limiting on backend

```
VITE_API_URL=https://api.yourdomain.com/api
```

## Troubleshooting

### CORS Error

```
Access to XMLHttpRequest at 'http://localhost:3000' from origin 'http://localhost:5173' has been blocked by CORS policy
```

Solution:
1. Check backend `.env` has correct `FRONTEND_URL`
2. Restart backend server
3. Check frontend `VITE_API_URL` is correct

### Token Invalid

```
Error: Invalid token
```

Solution:
1. Refresh the token
2. Logout and login again
3. Check token expiry time

### Network Error

```
Error: Failed to fetch
```

Solution:
1. Verify backend is running (`http://localhost:3000/health`)
2. Check network connectivity
3. Verify API URL is correct
