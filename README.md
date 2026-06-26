# StackOverflow Appwrite 🚀

A full-stack Q&A platform inspired by Stack Overflow, built with **Next.js 14**, **React 18**, **TypeScript**, **Tailwind CSS**, and **Appwrite**.

![Next.js](https://img.shields.io/badge/Next.js-14.2.4-black?logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-06B6D4?logo=tailwindcss)
![Appwrite](https://img.shields.io/badge/Appwrite-Backend-EA5906?logo=appwrite)

---

## 📚 Documentation

**For comprehensive documentation, see the [docs/](./docs/) folder:**

| Document | Purpose |
|----------|---------|
| **[docs/README.md](./docs/README.md)** | 📋 Documentation index & quick start |
| **[docs/1-PROJECT-OVERVIEW.md](./docs/1-PROJECT-OVERVIEW.md)** | 📖 Project features & structure |
| **[docs/2-TECH-STACK.md](./docs/2-TECH-STACK.md)** | 🛠️ Technology breakdown & usage |
| **[docs/3-DATABASE-SCHEMA.md](./docs/3-DATABASE-SCHEMA.md)** | 🗄️ Database structure & queries |
| **[docs/4-API-ROUTES.md](./docs/4-API-ROUTES.md)** | 🔌 API endpoints & authentication |
| **[docs/5-COMPONENTS.md](./docs/5-COMPONENTS.md)** | 🎨 Component documentation |
| **[docs/6-AUTHENTICATION.md](./docs/6-AUTHENTICATION.md)** | 🔐 Auth system & user management |
| **[docs/7-SETUP-GUIDE.md](./docs/7-SETUP-GUIDE.md)** | ⚙️ Setup, deployment & troubleshooting |

**→ [Read full documentation](./docs/README.md)**

---

## ✨ Features

✅ **User Authentication** - Email/password signup & login  
✅ **Questions & Answers** - Full Q&A workflow with rich text support  
✅ **Voting System** - Upvote/downvote questions and answers  
✅ **Comments** - Comment on questions and answers  
✅ **Markdown Support** - Rich text editor with live preview  
✅ **Search & Filter** - Search questions by title/content and filter by tags  
✅ **User Profiles** - View user activity, reputation, and contributions  
✅ **Reputation System** - Users earn reputation through activity  
✅ **File Attachments** - Upload files with questions and answers  
✅ **Responsive Design** - Mobile-friendly interface  
✅ **Dark Mode** - Beautiful dark theme by default  
✅ **Animated UI** - Smooth animations with Magic UI components  

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14.2.4** - React framework with SSR & App Router
- **React 18** - UI library
- **TypeScript 5** - Type-safe JavaScript
- **Tailwind CSS 3** - Utility-first styling
- **Zustand** - State management
- **@uiw/react-md-editor** - Markdown editor

### Backend
- **Appwrite** - Backend-as-a-Service (BaaS)
- **Appwrite Database** - NoSQL database
- **Appwrite Storage** - File storage
- **Appwrite Auth** - User authentication

### UI Components
- **Magic UI** - Animated components
- **Tabler Icons** - Icon library
- **Canvas Confetti** - Celebration animations

---

## 🚀 Quick Start

### Prerequisites
- [Node.js 18+](https://nodejs.org/)
- [Appwrite Account](https://cloud.appwrite.io)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd stackoverflow-appwrite
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
# Create .env.local
cp .env.example .env.local
```

4. **Configure `.env.local`**
```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_API_KEY=your_api_key
```

5. **Setup Appwrite Database**
- Follow [docs/7-SETUP-GUIDE.md](./docs/7-SETUP-GUIDE.md#step-5-setup-appwrite-database)

6. **Start the development server**
```bash
npm run dev
```

Visit **http://localhost:3000** to see your app!

---

## 📖 Project Structure

```
stackoverflow-appwrite/
├── src/
│   ├── app/                 # Next.js pages & routes
│   │   ├── (auth)/         # Auth pages
│   │   ├── api/            # API endpoints
│   │   ├── questions/      # Questions pages
│   │   ├── users/          # User profiles
│   │   └── layout.tsx      # Root layout
│   ├── components/          # Reusable components
│   │   ├── ui/             # Basic UI components
│   │   ├── magicui/        # Animated components
│   │   └── *.tsx           # Feature components
│   ├── models/
│   │   ├── server/         # Server-side Appwrite config
│   │   └── client/         # Client-side Appwrite config
│   ├── store/              # Zustand state management
│   ├── utils/              # Helper functions
│   └── lib/                # Library functions
├── docs/                    # 📚 Complete documentation
├── public/                  # Static assets
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.mjs
└── README.md
```

---

## 🗄️ Database Collections

| Collection | Purpose | Fields |
|-----------|---------|--------|
| **questions** | Q&A questions | title, content, tags, authorId, attachmentId |
| **answers** | Answers to questions | content, questionId, authorId, attachmentId |
| **comments** | Comments on Q&A | content, type, typeId, authorId |
| **votes** | Upvote/downvote | type, typeId, voteStatus, userId |

See [docs/3-DATABASE-SCHEMA.md](./docs/3-DATABASE-SCHEMA.md) for complete schema details.

---

## 🔌 API Routes

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/answer` | Create a new answer |
| POST | `/api/vote` | Vote on question/answer |

See [docs/4-API-ROUTES.md](./docs/4-API-ROUTES.md) for complete API documentation.

---

## 🎨 Key Components

- **QuestionCard** - Display single question
- **QuestionForm** - Create/edit questions
- **Answers** - Answer list and submission
- **Comments** - Comment management
- **VoteButtons** - Voting interface
- **RelativeTime** - Hydration-safe date display
- **Pagination** - Page navigation

See [docs/5-COMPONENTS.md](./docs/5-COMPONENTS.md) for component details.

---

## 🔐 Authentication

- **Email/Password** signup and login
- **Session management** via Appwrite
- **Zustand store** with localStorage persistence
- **Hydration-safe** auth state

See [docs/6-AUTHENTICATION.md](./docs/6-AUTHENTICATION.md) for auth details.

---

## 🚢 Deployment

### Quick Deploy to Vercel (Recommended)

```bash
# Push to GitHub
git push origin main

# Connect to Vercel
# → Import repository
# → Add environment variables
# → Deploy!
```

See [docs/7-SETUP-GUIDE.md#deployment](./docs/7-SETUP-GUIDE.md#deployment) for:
- ✅ Vercel deployment
- ✅ Netlify deployment
- ✅ Manual VPS deployment
- ✅ Production checklist

---

## 📋 Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Type check
npm run type-check

# Lint code
npm run lint
```

---

## 🐛 Troubleshooting

Common issues and solutions:
- **Connection to Appwrite failed** → Check endpoint & API key in `.env.local`
- **Database queries not working** → Verify collection IDs match `/src/models/name.ts`
- **Build errors** → Run `rm -rf .next && npm run build`
- **User not authenticated** → Ensure session is created

See [docs/7-SETUP-GUIDE.md#troubleshooting](./docs/7-SETUP-GUIDE.md#troubleshooting) for detailed troubleshooting.

---

## 📚 Learning Resources

- **[Next.js Documentation](https://nextjs.org/docs)** - Next.js guide
- **[Appwrite Documentation](https://appwrite.io/docs)** - Appwrite guide
- **[Tailwind CSS Documentation](https://tailwindcss.com/docs)** - Styling guide
- **[React Documentation](https://react.dev)** - React guide
- **[Zustand Documentation](https://github.com/pmndrs/zustand)** - State management

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

MIT License - feel free to use this project!

---

## 🙋 Support & Questions

- 📚 Check [docs/](./docs/) for comprehensive documentation
- 🔍 Search [Stack Overflow](https://stackoverflow.com)
- 💬 Check [Appwrite Discussions](https://github.com/appwrite/appwrite/discussions)
- 🐛 Create a GitHub issue

---

## 👨‍💻 Built With

- Created for educational purposes
- Inspired by Stack Overflow
- Built with modern web technologies

---

**Last Updated**: 2026-06-26  
**Version**: 1.0.0  
**Status**: ✅ Production Ready

For detailed information, **[read the complete documentation →](./docs/README.md)**
