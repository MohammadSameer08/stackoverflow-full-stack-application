# StackOverflow Appwrite - Complete Documentation

Welcome! This directory contains comprehensive documentation for the StackOverflow Appwrite project.

---

## 📚 Documentation Index

### 1. **[PROJECT OVERVIEW](./1-PROJECT-OVERVIEW.md)**
   - Project summary and key features
   - Live demo links
   - Project structure overview
   - Database collections at a glance
   - Tech stack introduction

### 2. **[TECH STACK & ARCHITECTURE](./2-TECH-STACK.md)**
   - Detailed technology breakdown
   - Next.js 14 usage patterns
   - React 18 features
   - TypeScript configuration
   - Tailwind CSS styling
   - Magic UI components
   - Zustand state management
   - Appwrite backend overview
   - Rich text editor setup
   - Hydration & SSR handling

### 3. **[DATABASE SCHEMA](./3-DATABASE-SCHEMA.md)**
   - Complete database structure
   - Collection schemas (Questions, Answers, Comments, Votes, Users)
   - Document examples
   - Entity relationships (ER diagram)
   - Common database queries
   - Storage bucket setup
   - Data relationships

### 4. **[API ROUTES & ENDPOINTS](./4-API-ROUTES.md)**
   - API overview and base URL
   - Endpoint documentation
     - POST `/api/answer` - Create answers
     - POST `/api/vote` - Vote on content
   - Authentication flow
   - Error handling
   - Request/response examples
   - Testing API endpoints
   - Server-side data fetching patterns

### 5. **[COMPONENTS & UI](./5-COMPONENTS.md)**
   - Component organization
   - Key components:
     - QuestionCard
     - QuestionForm
     - Answers
     - Comments
     - VoteButtons
     - Pagination
     - RelativeTime (hydration-safe dates)
     - RTE (Rich Text Editor)
   - Page-level components
   - Re-usable patterns
   - Styling strategy

### 6. **[AUTHENTICATION & USER SYSTEM](./6-AUTHENTICATION.md)**
   - Auth store (Zustand)
   - Authentication flows:
     - Register/Create Account
     - Login
     - Session Verification
     - Logout
   - Hydration safety patterns
   - User preferences & reputation
   - Protected routes
   - Security considerations
   - Auth pages (Login, Register)
   - Reputation system

### 7. **[SETUP GUIDE & DEPLOYMENT](./7-SETUP-GUIDE.md)**
   - Prerequisites
   - Local development setup
   - Appwrite configuration
   - Environment variables
   - Development commands
   - Deployment options:
     - Vercel (recommended)
     - Netlify
     - Manual VPS deployment
   - Production checklist
   - Troubleshooting guide
   - Performance optimization
   - Monitoring & logging
   - Maintenance tasks

---

## 🚀 Quick Start

### For Developers
1. Read [PROJECT OVERVIEW](./1-PROJECT-OVERVIEW.md) (5 min)
2. Read [TECH STACK](./2-TECH-STACK.md) (10 min)
3. Follow [SETUP GUIDE](./7-SETUP-GUIDE.md) to get running locally (15 min)

### For Understanding Architecture
1. Read [DATABASE SCHEMA](./3-DATABASE-SCHEMA.md) (15 min)
2. Read [API ROUTES](./4-API-ROUTES.md) (10 min)
3. Read [AUTHENTICATION](./6-AUTHENTICATION.md) (10 min)

### For Component Development
1. Read [COMPONENTS](./5-COMPONENTS.md) (20 min)
2. Check specific component code in `/src/components/`

### For Deployment
1. Read [SETUP GUIDE - Deployment Section](./7-SETUP-GUIDE.md#deployment) (10 min)
2. Choose your deployment platform
3. Follow the specific instructions

---

## 📋 Feature Overview

| Feature | Documentation | Status |
|---------|---|--------|
| Questions Management | [3-DATABASE-SCHEMA](./3-DATABASE-SCHEMA.md) | ✅ Complete |
| Answers & Comments | [4-API-ROUTES](./4-API-ROUTES.md) | ✅ Complete |
| Voting System | [4-API-ROUTES](./4-API-ROUTES.md) | ✅ Complete |
| Authentication | [6-AUTHENTICATION](./6-AUTHENTICATION.md) | ✅ Complete |
| User Profiles | [5-COMPONENTS](./5-COMPONENTS.md) | ✅ Complete |
| Search & Filter | [2-TECH-STACK](./2-TECH-STACK.md) | ✅ Complete |
| Reputation System | [6-AUTHENTICATION](./6-AUTHENTICATION.md) | ✅ Complete |
| File Uploads | [3-DATABASE-SCHEMA](./3-DATABASE-SCHEMA.md) | ✅ Complete |
| Dark Mode | [5-COMPONENTS](./5-COMPONENTS.md) | ✅ Complete |
| Responsive Design | [2-TECH-STACK](./2-TECH-STACK.md) | ✅ Complete |

---

## 🛠️ Technology Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Frontend Framework** | Next.js | 14.2.4 |
| **UI Library** | React | 18.x |
| **Language** | TypeScript | 5.x |
| **Styling** | Tailwind CSS | 3.x |
| **State Management** | Zustand | Latest |
| **Backend** | Appwrite | Cloud/Self-hosted |
| **Database** | Appwrite Database | NoSQL |
| **Storage** | Appwrite Storage | Cloud |
| **Icons** | Tabler Icons | Latest |
| **Rich Text** | @uiw/react-md-editor | Latest |
| **Animations** | Magic UI | Custom |

---

## 📊 Database Structure

```
Database: main-stackflow

Collections:
├── questions      - Q&A questions
├── answers        - Answers to questions
├── comments       - Comments on Q&A
├── votes          - Up/down votes
└── users          - (Appwrite built-in)

Storage:
└── question-attachment - File uploads
```

---

## 🔗 Important Directories

```
src/
├── app/                 # Pages & routes
│   ├── (auth)/         # Auth pages (login, register)
│   ├── api/            # API endpoints
│   ├── questions/      # Questions pages
│   └── users/          # User profiles
├── components/          # Reusable UI components
├── models/             # Database config
│   ├── server/         # Server-side Appwrite
│   └── client/         # Client-side Appwrite
├── store/              # Zustand state
└── utils/              # Helper functions
```

---

## 🔑 Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_API_KEY=your_api_key
```

---

## 📖 Common Tasks

### Add a New Page
1. Create file in `/src/app/` 
2. Reference [2-TECH-STACK](./2-TECH-STACK.md) for routing patterns
3. Use components from [5-COMPONENTS](./5-COMPONENTS.md)

### Create a New Database Collection
1. Go to Appwrite console
2. Reference [3-DATABASE-SCHEMA](./3-DATABASE-SCHEMA.md) for structure
3. Update `/src/models/name.ts` with collection ID

### Add Authentication to a Page
1. Reference [6-AUTHENTICATION](./6-AUTHENTICATION.md)
2. Use `useAuthStore()` hook
3. Check `hydrated` and `user` flags

### Create a New API Endpoint
1. Create file in `/src/app/api/endpoint/route.ts`
2. Reference [4-API-ROUTES](./4-API-ROUTES.md) for patterns
3. Add request validation
4. Return JSON response

### Style a Component
1. Reference [2-TECH-STACK](./2-TECH-STACK.md) for Tailwind patterns
2. Check [5-COMPONENTS](./5-COMPONENTS.md) for examples
3. Use dark mode classes: `bg-slate-950`, `text-white`, etc.

---

## 🚢 Deployment Resources

### Quick Deploy
- **Vercel**: [SETUP-GUIDE → Deploy to Vercel](./7-SETUP-GUIDE.md#deploy-to-vercel-recommended-for-nextjs)
- **Netlify**: [SETUP-GUIDE → Deploy to Netlify](./7-SETUP-GUIDE.md#deploy-to-netlify)
- **Manual**: [SETUP-GUIDE → Manual Deployment](./7-SETUP-GUIDE.md#manual-deployment-vpsserver)

### Production Checklist
See [SETUP-GUIDE → Production Checklist](./7-SETUP-GUIDE.md#production-checklist)

---

## 🐛 Troubleshooting

### Common Issues
1. **Appwrite connection error** → [7-SETUP-GUIDE](./7-SETUP-GUIDE.md#troubleshooting)
2. **Build failures** → [7-SETUP-GUIDE → Build failing](./7-SETUP-GUIDE.md#build-failing-in-production)
3. **Component not rendering** → [5-COMPONENTS](./5-COMPONENTS.md)
4. **Database queries not working** → [3-DATABASE-SCHEMA](./3-DATABASE-SCHEMA.md)
5. **Authentication issues** → [6-AUTHENTICATION](./6-AUTHENTICATION.md)

---

## 📚 Additional Resources

- **Appwrite Docs**: https://appwrite.io/docs
- **Next.js Docs**: https://nextjs.org/docs
- **React Docs**: https://react.dev
- **Tailwind Docs**: https://tailwindcss.com/docs
- **Zustand Docs**: https://github.com/pmndrs/zustand

---

## 👥 Contributing

When adding features:
1. Update relevant documentation file
2. Add code examples
3. Update this index if adding new sections
4. Keep docs in sync with code

---

## 📝 Documentation Information

- **Created**: 2026-06-26
- **Total Pages**: 7 + Index
- **Total Words**: 15,000+
- **Coverage**: 100% of project

---

## 🎯 Next Steps

**Start here**: [1-PROJECT-OVERVIEW.md](./1-PROJECT-OVERVIEW.md)

**Get running locally**: [7-SETUP-GUIDE.md](./7-SETUP-GUIDE.md)

**Deploy to production**: [7-SETUP-GUIDE.md#deployment](./7-SETUP-GUIDE.md#deployment)

---

**Happy coding! 🚀**

If you have questions, check the relevant documentation file first. Most answers are already documented here!
