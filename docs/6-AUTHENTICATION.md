# Authentication & User System

## Authentication Overview

**Authentication Method**: Appwrite Auth (Email/Password)  
**Session Storage**: Browser localStorage via Zustand persist  
**State Management**: Zustand store with hydration  
**JWT**: Generated for API authentication

---

## Auth Store (`/src/store/Auth.ts`)

### Store Interface
```typescript
interface IAuthStore {
  // State
  session: Models.Session | null
  jwt: string | null
  user: Models.User<UserPrefs> | null
  hydrated: boolean
  
  // Methods
  setHydrated(): void
  verfiySession(): Promise<void>
  login(email: string, password: string): Promise<Result>
  createAccount(name: string, email: string, password: string): Promise<Result>
  logout(): Promise<void>
}

interface UserPrefs {
  reputation: number
}
```

### Store Configuration
```typescript
export const useAuthStore = create<IAuthStore>()(
  persist(
    immer((set) => ({
      // Initial state
      session: null,
      jwt: null,
      user: null,
      hydrated: false,
      
      // Middleware
    })),
    {
      name: "auth-store",  // localStorage key
      version: 1
    }
  )
)
```

---

## Authentication Flow

### 1. Register (Create Account)

**Step-by-step process:**

```typescript
async createAccount(name: string, email: string, password: string) {
  try {
    // 1. Create new user account in Appwrite
    const response = await account.create(
      ID.unique(),    // Generate unique ID
      email,
      password,
      name
    )
    
    // 2. Initialize user preferences (reputation starts at 0)
    // (Handled automatically by Appwrite)
    
    // 3. Auto-login after registration
    await account.createEmailPasswordSession(email, password)
    
    // 4. Get session and user data
    const session = await account.getSession('current')
    const user = await account.get<UserPrefs>()
    
    // 5. Create JWT for API calls
    const jwt = await account.createJWT()
    
    // 6. Update Zustand store
    set({ session, user, jwt })
    
    return { success: true }
  } catch (error) {
    return { success: false, error }
  }
}
```

**UI Flow:**
```
1. User fills registration form
2. Submit to login page handler
3. Call useAuthStore().createAccount()
4. If success → Redirect to /questions
5. If error → Show error message
```

**Component** (`/src/app/(auth)/register/page.tsx`):
```typescript
export default function RegisterPage() {
  const router = useRouter()
  const { createAccount } = useAuthStore()
  const [isPending, setIsPending] = useState(false)
  
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault()
    setIsPending(true)
    
    const result = await createAccount(name, email, password)
    
    if (result.success) {
      router.push("/questions")
    } else {
      alert(result.error?.message)
    }
    
    setIsPending(false)
  }
  
  return <form onSubmit={handleRegister}>...</form>
}
```

---

### 2. Login

**Step-by-step process:**

```typescript
async login(email: string, password: string) {
  try {
    // 1. Create email/password session
    const session = await account.createEmailPasswordSession(email, password)
    
    // 2. Get user data from Appwrite
    const user = await account.get<UserPrefs>()
    
    // 3. Generate JWT for authenticated requests
    const jwt = await account.createJWT()
    
    // 4. Update store
    set({ session, user, jwt })
    
    return { success: true }
  } catch (error) {
    // Handle invalid credentials
    return { success: false, error }
  }
}
```

**Error Handling:**
```typescript
// Invalid credentials
{ 
  code: 401,
  message: "Invalid credentials"
}

// User not found
{ 
  code: 404,
  message: "User with the requested ID could not be found"
}
```

---

### 3. Session Verification (On App Load)

**Purpose**: Check if user is still logged in after page refresh

```typescript
async verfiySession() {
  try {
    // 1. Check if session exists
    const session = await account.getSession('current')
    
    // 2. Get current user info
    const user = await account.get<UserPrefs>()
    
    // 3. Update store with verified data
    set({ session, user, hydrated: true })
  } catch (error) {
    // No valid session - user not logged in
    set({ 
      session: null, 
      user: null, 
      hydrated: true 
    })
  }
}
```

**Initialization** (`/src/app/layout.tsx`):
```typescript
'use client'

export default function RootLayout() {
  useEffect(() => {
    // Verify session on app load
    useAuthStore.getState().verfiySession()
  }, [])
  
  return <div>{children}</div>
}
```

---

### 4. Logout

```typescript
async logout() {
  try {
    // 1. Delete session from Appwrite
    await account.deleteSession('current')
    
    // 2. Clear store
    set({ 
      session: null, 
      jwt: null, 
      user: null 
    })
    
    // 3. Redirect to login
    router.push("/login")
  } catch (error) {
    console.error(error)
  }
}
```

---

## Hydration Safety

### Problem: SSR Mismatch
When Next.js server renders, it doesn't have hydration flag set → store looks "empty" initially.

### Solution: Check `hydrated` Flag
```typescript
const { user, hydrated } = useAuthStore()

// Wait for client-side rehydration
if (!hydrated) {
  return null  // Don't render until store is ready
}

// Now safe to check user
if (user) {
  return <UserMenu />
} else {
  return <LoginButton />
}
```

---

## User Preferences (Reputation)

### Structure
```typescript
interface UserPrefs {
  reputation: number  // Total reputation score
}
```

### Accessing Reputation
```typescript
// Server-side
const user = await users.get<UserPrefs>(userId)
console.log(user.prefs.reputation)  // e.g. 150

// Client-side
const { user } = useAuthStore()
console.log(user?.prefs.reputation)  // e.g. 150
```

### Updating Reputation
```typescript
// When user gets an upvote on their answer
const user = await users.get<UserPrefs>(userId)
const newReputation = user.prefs.reputation + 10

await users.updatePrefs(userId, {
  reputation: newReputation
})
```

---

## Protected Routes

### Route Protection Patterns

**Option 1: Client-side check**
```typescript
'use client'

export default function ProtectedPage() {
  const router = useRouter()
  const { user, hydrated } = useAuthStore()
  
  useEffect(() => {
    if (hydrated && !user) {
      router.push("/login")
    }
  }, [hydrated, user])
  
  if (!hydrated) return <Loading />
  if (!user) return null
  
  return <PageContent />
}
```

**Option 2: Server-side check (better)**
```typescript
// Server component
import { account } from "@/models/client/config"
import { redirect } from "next/navigation"

export default async function ProtectedPage() {
  try {
    const session = await account.getSession('current')
    if (!session) {
      redirect("/login")
    }
  } catch (error) {
    redirect("/login")
  }
  
  return <PageContent />
}
```

---

## Security Considerations

### 1. Password Security
- ✅ Passwords hashed by Appwrite
- ✅ HTTPS required for production
- ✅ No passwords stored in localStorage

### 2. Session Security
- ✅ Session ID stored in secure cookie
- ✅ CSRF tokens used by Appwrite
- ✅ Automatic session expiration

### 3. API Key Security
- ✅ API keys in `.env.local` (not committed)
- ✅ Server-side API key for privileged operations
- ✅ Client-side only uses sessions

### 4. JWT Tokens
- ✅ Generated per session
- ✅ Used for API authentication
- ✅ Includes user ID and permissions

---

## Auth Pages

### Login Page
**Route**: `/login`  
**File**: `/src/app/(auth)/login/page.tsx`

**Form Fields:**
- Email
- Password

**Flow:**
1. User enters credentials
2. Click "Login"
3. Call `useAuthStore().login(email, password)`
4. If success → Redirect to `/questions`
5. If error → Show error message

---

### Register Page
**Route**: `/register`  
**File**: `/src/app/(auth)/register/page.tsx`

**Form Fields:**
- Name
- Email
- Password
- Confirm Password

**Flow:**
1. User fills form
2. Validate passwords match
3. Call `useAuthStore().createAccount(...)`
4. If success → Auto login and redirect to `/questions`
5. If error → Show error message

---

## User Profile Management

### View Own Profile
**Route**: `/users/:userId/:userName`  
**Features:**
- ✅ View user info (name, reputation)
- ✅ View user's questions
- ✅ View user's answers
- ✅ View user's votes
- ✅ View user's profile joined date

**Component** (`/src/app/users/[userId]/[userSlug]/page.tsx`):
```typescript
export default async function UserProfile({ 
  params: { userId, userSlug } 
}) {
  // Fetch user
  const user = await users.get<UserPrefs>(userId)
  
  // Fetch user's activity
  const questions = await databases.listDocuments(
    db,
    questionCollection,
    [Query.equal("authorId", userId)]
  )
  
  const answers = await databases.listDocuments(
    db,
    answerCollection,
    [Query.equal("authorId", userId)]
  )
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>Reputation: {user.prefs.reputation}</p>
      <QuestionsTab questions={questions.documents} />
      <AnswersTab answers={answers.documents} />
    </div>
  )
}
```

---

## Reputation System

### How Reputation is Earned
| Action | Points | Type |
|--------|--------|------|
| Question upvoted | +5 | Question author |
| Question accepted | +25 | Answer author |
| Answer upvoted | +10 | Answer author |
| Answer accepted | +15 | Answer author |
| Edit approved | +2 | Editor |

### Reputation Mechanics
```typescript
// When question gets upvoted
const authorId = question.authorId
const author = await users.get<UserPrefs>(authorId)
await users.updatePrefs(authorId, {
  reputation: author.prefs.reputation + 5
})
```

### Viewing Reputation
- **User Profile**: Shows total reputation score
- **Question Card**: Shows author's reputation
- **Answer List**: Shows answerer's reputation
- **Comment**: Shows commenter's reputation

---

📌 **Next**: Read `7-SETUP-GUIDE.md` for installation & deployment
