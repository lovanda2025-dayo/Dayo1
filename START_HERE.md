# 🚀 Flame Match - Start Here

Welcome! Your dating platform backend is ready. Here's what to do:

## ⚡ Quick Start (2 minutes)

### 1. Install Backend
```bash
cd server
npm install
cd ..
```

### 2. Start Backend
```bash
# Terminal 1
cd server
npm run dev
```

### 3. Start Frontend
```bash
# Terminal 2
npm run dev
```

### 4. Done!
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api

## 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Quick overview (5 min read)
- **[BACKEND_SETUP.md](./BACKEND_SETUP.md)** - Complete backend guide
- **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** - How to use API in frontend
- **[BACKEND_COMPLETE_SUMMARY.md](./BACKEND_COMPLETE_SUMMARY.md)** - Full technical details
- **[server/README.md](./server/README.md)** - API reference

## 🎯 What You Have

✅ **Complete Backend**
- 21 REST API endpoints
- User authentication
- Profile management
- Matching system
- Real-time messaging
- File uploads

✅ **Secure Database**
- Supabase PostgreSQL
- Row-Level Security (RLS)
- 6 optimized tables
- 15+ performance indexes

✅ **Frontend API Client**
- Pre-built in `src/services/api.ts`
- All endpoints ready
- Error handling included

## 🔥 Test It Now

### Option 1: Browser
1. Go to http://localhost:5173
2. Register a new account
3. Fill out profile
4. Start exploring!

### Option 2: API (curl)
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "age": 25
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# Get your token from response and use it:
curl -X GET http://localhost:3000/api/profiles/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🛠️ Development

### Backend Commands
```bash
cd server

npm run dev          # Start with auto-reload
npm run build        # Compile TypeScript
npm run start        # Run compiled version
npm run type-check   # Check types
```

### Frontend Commands
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 📋 Next Tasks

1. ✅ Start both servers
2. ✅ Test registration/login
3. ✅ Create profile with photos
4. ✅ Test liking another user
5. ✅ Test messaging
6. ✅ Build additional features
7. ✅ Deploy to production

## 🔐 Security Checklist

✅ JWT authentication
✅ Row-Level Security (RLS)
✅ CORS configured
✅ Rate limiting enabled
✅ Input validation
✅ File upload validation
✅ Error handling

## 🚀 Deployment

When ready for production:

### Backend
```bash
cd server
npm run build
npm start
```

Deploy to: Vercel, Railway, Render, Heroku, DigitalOcean

### Frontend
```bash
npm run build
```

Deploy to: Vercel, Netlify, GitHub Pages

Update `VITE_API_URL` environment variable to your production API.

## 📞 Troubleshooting

### Backend won't start?
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
npm run dev
```

### CORS error?
1. Check `FRONTEND_URL` in `server/.env`
2. Restart backend
3. Hard refresh frontend (Ctrl+Shift+R)

### Database error?
1. Verify Supabase credentials in `server/.env`
2. Check project is active at supabase.co

### File upload fails?
1. File must be JPEG, PNG, or WebP
2. Must be under 5MB
3. Check Supabase Storage is enabled

## 📊 Project Structure

```
project/
├── server/           # Backend (Node.js/Express)
│   ├── src/         # TypeScript source
│   ├── dist/        # Compiled JavaScript
│   └── package.json
├── src/             # Frontend (React)
│   ├── components/
│   └── services/api.ts   # Backend API client
├── .env             # Supabase config
├── .env.backend     # Backend API URL
└── docs/            # This documentation
```

## 🎓 Learn More

1. Read **QUICKSTART.md** for overview
2. Check **INTEGRATION_GUIDE.md** for API examples
3. Review **server/README.md** for complete API docs
4. See **BACKEND_COMPLETE_SUMMARY.md** for technical details

## 💡 Tips

- Use Postman or Insomnia to test API endpoints
- Check browser DevTools Network tab for API calls
- Use Supabase dashboard to monitor database
- Enable TypeScript for better development experience
- Save tokens to localStorage after login

## 🎉 You're All Set!

Your dating platform is ready to go. Customize it with your own branding and features!

Need help? Check the documentation or review the code comments.

**Happy coding! 🚀**

---

**Last updated:** January 2025
**Flame Match v1.0.0**
