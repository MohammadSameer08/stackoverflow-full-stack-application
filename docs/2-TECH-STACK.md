# Tech Stack & Architecture

## Frontend Framework

### Next.js 14.2.4
**Why?** Production-ready React framework with built-in optimizations  
**Usage:**
- **Server Components** - Default for data fetching (no JS sent to browser)
- **Client Components** - Interactive features with "use client" directive
- **App Router** - File-based routing in `/src/app` directory
- **API Routes** - Backend endpoints in `/src/app/api`

**File Structure Example:**
```
src/app/questions/
├── page.tsx                 # /questions route
├── [quesId]/
│   └── [quesName]/
│       ├── page.tsx         # /questions/:id/:name route
│       └── DeleteQuestion.tsx
└── ask/
    └── page.tsx             # /questions/ask route
```

### React 18.x
**Features Used:**
- React Hooks (useState, useEffect, useContext)
- Functional Components
- Server/Client Component boundary
- Suspense (for loading states)

### TypeScript 5.x
**Usage:**
- Type-safe components with interfaces
- Models: `Models.Document`, `Models.User<UserPrefs>`
- Error handling with proper types

---

## Styling & UI

### Tailwind CSS 3.x
**Configuration**: `tailwind.config.ts`  
**Theme**: Dark mode enabled by default  
**Utilities Used:**
```css
/* Dark background */
bg-slate-950, bg-white/5, bg-white/10

/* Text colors */
text-white, text-orange-500, text-red-500

/* Borders & effects */
border-white/20, rounded-xl, shadow-2xl

/* Responsive */
sm:, lg:, md: breakpoints
```

### Magic UI Components
Custom animated components in `/src/components/magicui`:

| Component | Purpose |
|-----------|---------|
| `animated-grid-pattern` | Background grid animation |
| `animated-list` | Animated list display |
| `border-beam` | Animated border beam effect |
| `confetti` | Celebration animation |
| `meteors` | Meteor rain animation |
| `particles` | Floating particles background |
| `shimmer-button` | Shimmering button effect |
| `neon-gradient-card` | Neon glowing cards |
| `retro-grid` | Retro grid background |

---

## State Management

### Zustand
**File**: `/src/store/Auth.ts`  
**Purpose**: Centralized user authentication state

**Store Structure:**
```typescript
interface IAuthStore {
  session: Models.Session | null
  jwt: string | null
  user: Models.User<UserPrefs> | null
  hydrated: boolean
  
  setHydrated(): void
  verfiySession(): Promise<void>
  login(email: string, password: string): Promise<{success: boolean}>
  createAccount(name: string, email: string, password: string): Promise<{success: boolean}>
  logout(): Promise<void>
}
```

**Middleware Used:**
- `persist` - Saves to localStorage
- `immer` - Immutable state updates

**Example Usage:**
```typescript
const { user, hydrated, login } = useAuthStore()

if (!hydrated) return null  // Wait for rehydration
if (user?.$id === authorId) { /* show delete button */ }
```

---

## Backend - Appwrite

### What is Appwrite?
Backend-as-a-Service (BaaS) platform providing:
- User authentication & management
- NoSQL database (Appwrite Database)
- File storage (Appwrite Storage)
- API access via SDKs

### Appwrite Configuration

**Server-side Config** (`/src/models/server/config.ts`):
```typescript
- Client() - Root connection
- Databases - Query collections
- Users - Manage user accounts
- Avatars - Generate user avatars
- Storage - Upload/download files
- Uses API Key for authentication
```

**Client-side Config** (`/src/models/client/config.ts`):
```typescript
- Account - User login/signup
- Databases - Limited permissions
- Storage - User file uploads
- No API keys (uses browser sessions)
```

**Database IDs** (`/src/models/name.ts`):
```typescript
export const db = "main-stackflow"
export const questionCollection = "questions"
export const answerCollection = "answers"
export const commentCollection = "comments"
export const voteCollection = "votes"
export const questionAttachmentBucket = "question-attachment"
```

---

## Rich Text Editor

### @uiw/react-md-editor
**Files Used In:**
- Question creation (`/src/components/QuestionForm.tsx`)
- Answer section (`/src/components/Answers.tsx`)
- Comment section (`/src/components/Comments.tsx`)

**Configuration:**
```typescript
<MDEditor
  value={markdown}
  onChange={setMarkdown}
  height={200}
  preview="live"
  hideToolbar={false}
  data-color-mode="dark"  // Dark mode support
/>
```

---

## Icons & UI Libraries

### Tabler Icons
```typescript
import { IconTrash, IconEdit, IconUpload } from "@tabler/icons-react"

<IconTrash className="h-4 w-4" />
```

### canvas-confetti
```typescript
// Used in QuestionForm for celebration animation
import confetti from 'canvas-confetti'
confetti()  // Triggers animation
```

---

## Data Fetching Patterns

### Server Component Data Fetching
```typescript
// /src/app/questions/page.tsx
const Page = async ({ searchParams }) => {
  // Direct server-side fetch - No API needed
  const questions = await databases.listDocuments(
    db, 
    questionCollection, 
    queries
  )
  
  return <div>{/* render questions */}</div>
}
```

### Client Component Data Submission
```typescript
// /src/app/api/answer/route.ts
export async function POST(req: Request) {
  const data = await req.json()
  
  // Server-side processing
  const result = await databases.createDocument(...)
  
  return Response.json(result)
}
```

---

## Hydration & SSR Handling

**Problem**: Client-side calculations differ from server renders  
**Solution**: `RelativeTime` component wrapper

```typescript
// /src/components/RelativeTime.tsx
export default function RelativeTime({ date, prefix = "" }) {
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)  // Only render after hydration
  }, [])
  
  if (!isMounted) return <span>--</span>
  
  return <span>{prefix} {convertDateToRelativeTime(new Date(date))}</span>
}
```

---

## Environment Variables
**File**: `.env.local`
```
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_API_KEY=your_api_key
```

---

📌 **Next**: Read `3-DATABASE-SCHEMA.md` for database structure
