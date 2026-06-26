# StackOverflow Appwrite - Project Overview

## Project Summary
A full-stack Q&A platform (similar to Stack Overflow) built with modern web technologies. Users can ask questions, provide answers, comment, vote, and build reputation.

## Key Features
✅ **User Authentication** - Sign up, login, user profiles  
✅ **Question Management** - Create, edit, delete questions with rich text support  
✅ **Answer System** - Answer questions with voting on answers  
✅ **Comments** - Add comments to questions and answers  
✅ **Voting System** - Upvote/downvote questions and answers  
✅ **Reputation System** - Users earn reputation based on activity  
✅ **Search & Filter** - Search questions by title/content, filter by tags  
✅ **User Profiles** - View user activity, answers, votes, questions  
✅ **Responsive Design** - Works on desktop and mobile  
✅ **Dark Mode** - Beautiful dark theme with Tailwind CSS  

## Live Demo
- **Frontend**: `http://localhost:3000`
- **Database Console**: `https://cloud.appwrite.io`

## Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Authentication pages (login, register)
│   │   ├── api/               # API routes (answer, vote endpoints)
│   │   ├── components/        # App-level components
│   │   ├── questions/         # Questions pages and routes
│   │   ├── users/             # User profile pages
│   │   └── layout.tsx         # Root layout
│   ├── components/            # Reusable components
│   │   ├── ui/                # UI components (input, label)
│   │   ├── magicui/           # Magic UI animations
│   │   └── *.tsx              # Feature components
│   ├── models/
│   │   ├── server/            # Server-side Appwrite config
│   │   └── client/            # Client-side Appwrite config
│   ├── store/                 # Zustand state management
│   ├── utils/                 # Utility functions
│   └── lib/                   # Library functions
├── docs/                      # Documentation (this folder)
├── public/                    # Static assets
├── package.json              # Dependencies
├── tailwind.config.ts        # Tailwind CSS config
├── tsconfig.json             # TypeScript config
└── next.config.mjs           # Next.js config
```

## Database Collections

| Collection | Purpose | Fields |
|-----------|---------|--------|
| **questions** | Store Q&A questions | title, content, tags, authorId, attachmentId |
| **answers** | Store answers to questions | content, questionId, authorId, attachmentId |
| **comments** | Store comments on Q&A | content, type (question/answer), typeId, authorId |
| **votes** | Store up/down votes | type, typeId, voteStatus, userId |
| **users** | Appwrite built-in users | email, name, preferences (reputation) |

## User Roles & Permissions
- **Anonymous** - Can view questions, search
- **Authenticated** - Can create questions/answers, comment, vote, edit own content
- **Question Owner** - Can edit/delete own questions
- **Answer Owner** - Can delete own answers

## Tech Stack Used
- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Appwrite (BaaS)
- **Styling**: Tailwind CSS, Magic UI components
- **State Management**: Zustand
- **Rich Text Editor**: @uiw/react-md-editor
- **Icons**: Tabler Icons
- **Storage**: Appwrite Storage (for attachments)
- **Database**: Appwrite Database (NoSQL)

## Deployment
- **Frontend Hosting**: Vercel (recommended for Next.js)
- **Backend**: Appwrite Cloud or Self-hosted
- **Environment Variables**: `.env.local` file

---

📌 **Next**: Read `2-TECH-STACK.md` for detailed technology breakdown
