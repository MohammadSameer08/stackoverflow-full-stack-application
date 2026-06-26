# API Routes & Endpoints

## API Overview

**Base URL**: `http://localhost:3000/api`  
**Framework**: Next.js 14 API Routes  
**Location**: `/src/app/api`

---

## Endpoints

### 1. POST `/api/answer`
**Purpose**: Create a new answer to a question  
**Authentication**: Required (logged-in user)

**Request Body:**
```typescript
{
  questionId: string,             // ID of question being answered
  content: string,                // Answer text (markdown)
  attachmentId?: string           // Optional file attachment
}
```

**Request Example:**
```bash
POST /api/answer
Content-Type: application/json

{
  "questionId": "6a3e2a7a000520381c1d",
  "content": "Express.js is a minimal web framework...",
  "attachmentId": ""
}
```

**Response:**
```json
{
  "$id": "answer_123",
  "content": "Express.js is a minimal web framework...",
  "questionId": "6a3e2a7a000520381c1d",
  "authorId": "6a3d72bc002950b2dee9",
  "$createdAt": "2026-06-26T08:15:00.000+00:00"
}
```

**Error Responses:**
```json
// 401 - Not authenticated
{ "error": "User not authenticated" }

// 400 - Missing fields
{ "error": "Missing required fields" }

// 500 - Server error
{ "error": "Failed to create answer" }
```

**Implementation File**: `/src/app/api/answer/route.ts`

**Code Flow:**
```typescript
export async function POST(req: Request) {
  try {
    const { questionId, content, attachmentId } = await req.json()
    
    // Get current user from session
    const session = sessions.get<{}>
    
    // Validate user is logged in
    if (!session) {
      return Response.json({ error: "Not authenticated" }, { status: 401 })
    }
    
    // Create answer document
    const answer = await databases.createDocument(
      db,
      answerCollection,
      ID.unique(),
      {
        content,
        questionId,
        authorId: session.userId,
        attachmentId: attachmentId || ""
      }
    )
    
    return Response.json(answer)
  } catch (error) {
    return Response.json({ error: "Failed" }, { status: 500 })
  }
}
```

---

### 2. POST `/api/vote`
**Purpose**: Create or update a vote (upvote/downvote)  
**Authentication**: Required

**Request Body:**
```typescript
{
  type: "question" | "answer",    // What is being voted
  typeId: string,                 // ID of question or answer
  voteStatus: "upvoted" | "downvoted"  // Vote direction
}
```

**Request Example:**
```bash
POST /api/vote
Content-Type: application/json

{
  "type": "question",
  "typeId": "6a3e2a7a000520381c1d",
  "voteStatus": "upvoted"
}
```

**Response:**
```json
{
  "$id": "vote_789",
  "type": "question",
  "typeId": "6a3e2a7a000520381c1d",
  "userId": "6a3d72bc002950b2dee9",
  "voteStatus": "upvoted",
  "$createdAt": "2026-06-26T08:20:00.000+00:00"
}
```

**Logic:**
- If user already voted on this item:
  - If same vote direction → Remove vote (toggle off)
  - If different direction → Update vote (change direction)
- If new vote → Create new vote document

**Implementation File**: `/src/app/api/vote/route.ts`

---

## Client-Side API Calls

### Making Requests

**Example: Create Answer**
```typescript
// In client component
async function submitAnswer(questionId: string, content: string) {
  const response = await fetch('/api/answer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      questionId,
      content,
      attachmentId: ''
    })
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error)
  }
  
  return response.json()
}
```

**Example: Vote on Question**
```typescript
async function voteQuestion(questionId: string, voteType: 'upvoted' | 'downvoted') {
  const response = await fetch('/api/vote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'question',
      typeId: questionId,
      voteStatus: voteType
    })
  })
  
  return response.json()
}
```

---

## Server-Side Data Fetching

### Fetching Questions
**File**: `/src/app/questions/page.tsx`

```typescript
const questions = await databases.listDocuments(
  db,
  questionCollection,
  [
    Query.orderDesc("$createdAt"),
    Query.offset((pageNum - 1) * 25),
    Query.limit(25),
    // Optional filters:
    searchParams.tag && Query.equal("tags", searchParams.tag),
    searchParams.search && Query.or([
      Query.search("title", searchParams.search),
      Query.search("content", searchParams.search)
    ])
  ]
)
```

### Fetching Question Details
**File**: `/src/app/questions/[quesId]/[quesName]/page.tsx`

```typescript
const question = await databases.getDocument(
  db,
  questionCollection,
  quesId
)

const answers = await databases.listDocuments(
  db,
  answerCollection,
  [Query.equal("questionId", quesId)]
)

const comments = await databases.listDocuments(
  db,
  commentCollection,
  [
    Query.equal("typeId", quesId),
    Query.equal("type", "question")
  ]
)
```

### Fetching User Profile
**File**: `/src/app/users/[userId]/[userSlug]/page.tsx`

```typescript
const user = await users.get<UserPrefs>(userId)

const userQuestions = await databases.listDocuments(
  db,
  questionCollection,
  [Query.equal("authorId", userId)]
)

const userAnswers = await databases.listDocuments(
  db,
  answerCollection,
  [Query.equal("authorId", userId)]
)
```

---

## Authentication Flow

### Login API
**File**: `/src/store/Auth.ts`

```typescript
async login(email: string, password: string) {
  try {
    // Create session via Appwrite
    const session = await account.createEmailPasswordSession(email, password)
    
    // Get current user
    const user = await account.get<UserPrefs>()
    
    // Generate JWT for API calls
    const jwt = await account.createJWT()
    
    // Update store
    set({ session, user, jwt })
    
    return { success: true }
  } catch (error) {
    return { success: false, error }
  }
}
```

### Register API
```typescript
async createAccount(name: string, email: string, password: string) {
  try {
    // Create new user account
    const response = await account.create(ID.unique(), email, password, name)
    
    // Auto login after registration
    await account.createEmailPasswordSession(email, password)
    
    return { success: true }
  } catch (error) {
    return { success: false, error }
  }
}
```

### Session Verification
```typescript
async verfiySession() {
  try {
    const session = await account.getSession('current')
    const user = await account.get<UserPrefs>()
    
    set({ session, user, hydrated: true })
  } catch (error) {
    set({ session: null, user: null, hydrated: true })
  }
}
```

---

## Error Handling

### Server-Side Errors
```typescript
try {
  await databases.createDocument(...)
} catch (error) {
  if (error instanceof AppwriteException) {
    if (error.code === 404) {
      return Response.json({ error: "Not found" }, { status: 404 })
    }
    if (error.code === 401) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }
  }
  
  return Response.json({ error: "Server error" }, { status: 500 })
}
```

### Client-Side Error Handling
```typescript
try {
  await fetch('/api/answer', { method: 'POST', body: ... })
} catch (error: any) {
  window.alert(error?.message || "Something went wrong")
}
```

---

## Rate Limiting & Security

### CORS
By default, Next.js API routes are only accessible from same origin.

### Authentication
- All mutation endpoints require user session
- Session validated via Appwrite middleware
- JWT tokens included in requests

### Validation
- Request body validation on server
- Type checking via TypeScript
- Appwrite permission checks

---

## Testing API Endpoints

### Using cURL
```bash
# Create answer
curl -X POST http://localhost:3000/api/answer \
  -H "Content-Type: application/json" \
  -d '{
    "questionId": "6a3e2a7a000520381c1d",
    "content": "Test answer"
  }'

# Create vote
curl -X POST http://localhost:3000/api/vote \
  -H "Content-Type: application/json" \
  -d '{
    "type": "question",
    "typeId": "6a3e2a7a000520381c1d",
    "voteStatus": "upvoted"
  }'
```

### Using Postman
1. Open Postman
2. Create new POST request
3. URL: `http://localhost:3000/api/answer`
4. Body: `{ "questionId": "...", "content": "..." }`
5. Send request

---

📌 **Next**: Read `5-COMPONENTS.md` for component documentation
