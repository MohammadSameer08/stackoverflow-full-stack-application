# Database Schema & Collections

## Database Overview

**Database Name**: `main-stackflow`  
**Database Type**: NoSQL (Appwrite)  
**Connection**: Server-side via Appwrite SDK

---

## Collections & Document Structure

### 1. Questions Collection
**Collection ID**: `questions`  
**Purpose**: Store all Q&A questions

**Document Schema:**
```typescript
{
  $id: string,                    // Unique document ID
  $createdAt: string,             // ISO timestamp
  $updatedAt: string,             // ISO timestamp
  $permissions: string[],         // Access control
  $databaseId: string,            // "main-stackflow"
  $collectionId: string,          // "questions"
  
  // Custom fields
  title: string,                  // Question title
  content: string,                // Question description (markdown)
  tags: string,                   // Tags (comma-separated or array)
  authorId: string,               // User ID of question creator
  attachmentId: string,           // File attachment ID (optional)
  
  // Added during fetch (not stored in DB)
  totalAnswers: number,           // Count of answers
  totalVotes: number,             // Count of votes
  author: {
    $id: string,
    name: string,
    reputation: number
  }
}
```

**Example Document:**
```json
{
  "$id": "6a3e2a7a000520381c1d",
  "title": "What is Express.js?",
  "content": "# Express.js\n\nExpress is a Node.js web framework...",
  "tags": "express,node,javascript",
  "authorId": "6a3d72bc002950b2dee9",
  "attachmentId": "",
  "$createdAt": "2026-06-26T07:30:01.508+00:00"
}
```

**Indexes Recommended**:
- `authorId` - For user's questions
- `$createdAt` - For sorting by date
- `tags` - For filtering by tags

---

### 2. Answers Collection
**Collection ID**: `answers`  
**Purpose**: Store answers to questions

**Document Schema:**
```typescript
{
  $id: string,
  $createdAt: string,
  $updatedAt: string,
  
  content: string,                // Answer text (markdown)
  questionId: string,             // FK to question
  authorId: string,               // User ID of answerer
  attachmentId: string,           // File attachment (optional)
  
  // Added during fetch
  totalVotes: number,
  upvotesDocuments: {
    total: number,
    documents: Vote[]
  },
  downvotesDocuments: {
    total: number,
    documents: Vote[]
  },
  author: {
    $id: string,
    name: string,
    reputation: number
  },
  comments: Comment[]             // Related comments
}
```

**Example Document:**
```json
{
  "$id": "6a3d8cd1002ef9272d52",
  "content": "Express.js is a minimal web framework for Node.js...",
  "questionId": "6a3e2a7a000520381c1d",
  "authorId": "6a3d72bc002950b2dee9",
  "$createdAt": "2026-06-25T20:17:21.664+00:00"
}
```

**Relationships**:
- Many answers per question (1:many with questions)
- One author per answer (many:1 with users)
- Many votes per answer (1:many with votes)
- Many comments per answer (1:many with comments)

---

### 3. Comments Collection
**Collection ID**: `comments`  
**Purpose**: Store comments on questions/answers

**Document Schema:**
```typescript
{
  $id: string,
  $createdAt: string,
  $updatedAt: string,
  
  content: string,                // Comment text
  type: "question" | "answer",    // What is being commented
  typeId: string,                 // ID of question or answer
  authorId: string,               // User ID of commenter
  
  // Added during fetch
  author: {
    $id: string,
    name: string,
    reputation: number
  }
}
```

**Example Document:**
```json
{
  "$id": "comment_123",
  "content": "Great explanation!",
  "type": "answer",
  "typeId": "6a3d8cd1002ef9272d52",
  "authorId": "6a3d72bc002950b2dee9",
  "$createdAt": "2026-06-26T08:00:00.000+00:00"
}
```

**Query Examples**:
```typescript
// Get all comments on a question
Query.equal("type", "question"),
Query.equal("typeId", questionId)

// Get all comments on an answer
Query.equal("type", "answer"),
Query.equal("typeId", answerId)
```

---

### 4. Votes Collection
**Collection ID**: `votes`  
**Purpose**: Store upvotes/downvotes on questions/answers

**Document Schema:**
```typescript
{
  $id: string,
  $createdAt: string,
  $updatedAt: string,
  
  type: "question" | "answer",    // What is being voted
  typeId: string,                 // ID of question or answer
  voteStatus: "upvoted" | "downvoted",  // Vote type
  userId: string,                 // User who voted
}
```

**Example Document:**
```json
{
  "$id": "vote_456",
  "type": "question",
  "typeId": "6a3e2a7a000520381c1d",
  "voteStatus": "upvoted",
  "userId": "6a3d72bc002950b2dee9",
  "$createdAt": "2026-06-26T07:45:00.000+00:00"
}
```

**Query Examples**:
```typescript
// Get upvotes on a question
Query.equal("type", "question"),
Query.equal("typeId", questionId),
Query.equal("voteStatus", "upvoted")

// Get downvotes on an answer
Query.equal("type", "answer"),
Query.equal("typeId", answerId),
Query.equal("voteStatus", "downvoted")

// Count all votes on an item
Query.equal("type", "question"),
Query.equal("typeId", questionId)
```

---

### 5. Users Collection (Appwrite Built-in)
**Purpose**: Store user accounts & authentication  
**Managed By**: Appwrite Account/Users service (not in database)

**Document Schema:**
```typescript
{
  $id: string,                    // User ID
  name: string,                   // Display name
  email: string,                  // Email address
  emailVerification: boolean,
  phone: string,
  phoneVerification: boolean,
  
  prefs: {                        // Custom preferences
    reputation: number            // User reputation score
  },
  
  $createdAt: string,
  $updatedAt: string
}
```

**Example Document:**
```json
{
  "$id": "6a3d72bc002950b2dee9",
  "name": "John Doe",
  "email": "john@example.com",
  "prefs": {
    "reputation": 150
  },
  "$createdAt": "2026-06-20T10:00:00.000+00:00"
}
```

**How to Access**:
```typescript
// Server-side
const user = await users.get<UserPrefs>(userId)
console.log(user.prefs.reputation)

// Client-side (via Auth store)
const { user } = useAuthStore()
console.log(user?.prefs.reputation)
```

---

## Data Relationships (Entity Relationship Diagram)

```
┌─────────────┐
│   Users     │
│  (Built-in) │
└──────┬──────┘
       │
       │ creates
       ▼
┌─────────────────────┐
│   Questions         │
│ (questions)         │
├─────────────────────┤
│ ✓ title             │
│ ✓ content           │
│ ✓ tags              │
│ ✓ authorId (FK)     │◄─────┐
│ ✓ attachmentId      │      │
└──────┬──────────────┘      │
       │                     │
       │ has many            │ many to one
       ▼                     │
┌──────────────────────┐     │
│   Answers            │     │
│ (answers)            │     │
├──────────────────────┤     │
│ ✓ content            │     │
│ ✓ questionId (FK)    │─────┘
│ ✓ authorId (FK)      │
│ ✓ attachmentId       │
└──────┬───────────────┘
       │
       │ has many
       ▼
   ┌─────────────────────────┐
   │ Comments                │
   │ (comments)              │
   ├─────────────────────────┤
   │ ✓ content               │
   │ ✓ type (question/answer)│
   │ ✓ typeId (FK)           │
   │ ✓ authorId (FK)         │
   └─────────────────────────┘
   
   Also:
   ┌──────────────────┐
   │ Votes            │
   │ (votes)          │
   ├──────────────────┤
   │ ✓ type           │
   │ ✓ typeId (FK)    │
   │ ✓ userId (FK)    │
   │ ✓ voteStatus     │
   └──────────────────┘
```

---

## Common Queries

### Fetch Questions with Details
```typescript
const questions = await databases.listDocuments(db, questionCollection, [
  Query.orderDesc("$createdAt"),
  Query.limit(25),
  Query.offset(0)
])

// Enrich with author, answers, votes
questions.documents.map(async (q) => {
  const author = await users.get<UserPrefs>(q.authorId)
  const answers = await databases.listDocuments(db, answerCollection, [
    Query.equal("questionId", q.$id)
  ])
  const votes = await databases.listDocuments(db, voteCollection, [
    Query.equal("typeId", q.$id),
    Query.equal("type", "question")
  ])
  
  return {
    ...q,
    author: { $id: author.$id, name: author.name, reputation: author.prefs.reputation },
    totalAnswers: answers.total,
    totalVotes: votes.total
  }
})
```

### Search Questions
```typescript
Query.or([
  Query.search("title", searchTerm),
  Query.search("content", searchTerm)
])
```

### Filter by Tags
```typescript
Query.equal("tags", "javascript")
```

### Get User's Questions
```typescript
Query.equal("authorId", userId),
Query.orderDesc("$createdAt")
```

---

## Storage (Appwrite Storage)

**Bucket ID**: `question-attachment`  
**Purpose**: Store file uploads (PDFs, images, etc.)

**Usage**:
```typescript
// Upload
const response = await storage.createFile(
  questionAttachmentBucket,
  ID.unique(),
  file
)

// Get download URL
const fileUrl = storage.getFileDownload(
  questionAttachmentBucket,
  fileId
)
```

---

📌 **Next**: Read `4-API-ROUTES.md` for API endpoints
