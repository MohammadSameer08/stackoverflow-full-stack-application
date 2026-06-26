# Components & UI Architecture

## Component Organization

```
src/components/
├── ui/                          # Basic UI components
│   ├── input.tsx               # Styled input field
│   ├── label.tsx               # Styled label
│   ├── background-beams.tsx    # Animated background
│   ├── floating-navbar.tsx     # Floating navigation
│   ├── tracing-beam.tsx        # Vertical beam effect
│   └── wobble-card.tsx         # Wobbling card animation
│
├── magicui/                    # Animated components
│   ├── animated-grid-pattern.tsx
│   ├── animated-list.tsx
│   ├── border-beam.tsx
│   ├── confetti.tsx
│   ├── particles.tsx
│   ├── shimmer-button.tsx
│   └── ...more
│
├── Answers.tsx                 # Answer list & display
├── Comments.tsx                # Comment list & input
├── Pagination.tsx              # Page navigation
├── QuestionCard.tsx            # Single question card
├── QuestionForm.tsx            # Question creation form
├── RTE.tsx                     # Rich text editor wrapper
├── VoteButtons.tsx             # Vote up/down buttons
├── RelativeTime.tsx            # Hydration-safe date display
└── VoteItem.tsx                # Vote display component

src/app/components/             # Page-level components
├── Footer.tsx
├── Header.tsx
├── HeroSection.tsx
├── LatestQuestions.tsx
└── TopContributers.tsx
```

---

## Key Components

### 1. QuestionCard.tsx
**Type**: Client Component  
**Props**: `{ ques: Models.Document }`  
**Purpose**: Display single question in list view

**Features**:
- ✅ Shows title, tags, author, votes, answers
- ✅ Animated border beam effect
- ✅ Link to full question page
- ✅ Author reputation display
- ✅ Relative time display (hydration-safe)

**Usage**:
```typescript
import QuestionCard from "@/components/QuestionCard"

export default function QuestionsList() {
  return (
    <div>
      {questions.map(ques => (
        <QuestionCard key={ques.$id} ques={ques} />
      ))}
    </div>
  )
}
```

**Styling**:
```css
- Dark border: border-white/20
- Hover effect: bg-white/10
- Orange links: text-orange-500
- Card padding: p-4
- Rounded corners: rounded-xl
```

---

### 2. QuestionForm.tsx
**Type**: Client Component  
**Purpose**: Create and edit questions

**Props**:
```typescript
{
  action: (data: FormData) => Promise<any>  // Server action
  isPending?: boolean                        // Loading state
  editId?: string                           // For editing
}
```

**Features**:
- ✅ Title input with dark styling
- ✅ Rich text editor for content
- ✅ Tag input (comma-separated)
- ✅ File attachment upload
- ✅ Submit button with confetti animation
- ✅ Validation

**Form Fields**:
```typescript
title: string          // Question title
description: string    // Question content (markdown)
tags: string          // Comma-separated tags
attachmentId: string  // File upload
```

**Example Usage**:
```typescript
import QuestionForm from "@/components/QuestionForm"

export default function AskQuestion() {
  const handleSubmit = async (data: FormData) => {
    // Handle form submission
  }
  
  return <QuestionForm action={handleSubmit} />
}
```

---

### 3. Answers.tsx
**Type**: Client Component  
**Purpose**: Display all answers and answer submission

**Props**:
```typescript
{
  questionId: string,    // Which question
  answers: Answer[]      // List of answers
}
```

**Features**:
- ✅ List all answers
- ✅ Vote buttons per answer
- ✅ Comments on answers
- ✅ Answer submission form
- ✅ Sort by newest/oldest

**Structure**:
```
┌─ Answers Component
├─ Submit Answer Form
│  └─ QuestionForm component
├─ Answer Item
│  ├─ Author info
│  ├─ Vote buttons
│  ├─ Answer content
│  └─ Comments
├─ Answer Item
└─ Answer Item
```

---

### 4. Comments.tsx
**Type**: Client Component  
**Purpose**: Display and manage comments

**Props**:
```typescript
{
  comments: Comment[]
  type: "question" | "answer"
  typeId: string        // Question or answer ID
}
```

**Features**:
- ✅ List all comments
- ✅ Add new comment
- ✅ Author info per comment
- ✅ Relative timestamps
- ✅ Delete own comments

**Example**:
```typescript
<Comments 
  comments={question.comments}
  type="question"
  typeId={questionId}
/>
```

---

### 5. VoteButtons.tsx
**Type**: Client Component  
**Purpose**: Upvote/downvote interface

**Props**:
```typescript
{
  type: "question" | "answer"
  typeId: string
  upvotes: number
  downvotes: number
}
```

**Features**:
- ✅ Upvote/downvote buttons
- ✅ Vote count display
- ✅ Toggle voting (click to remove)
- ✅ Auth check (require login to vote)

**Example**:
```typescript
<VoteButtons 
  type="question"
  typeId={questionId}
  upvotes={10}
  downvotes={2}
/>
```

**Vote Submission**:
```typescript
const handleVote = async (direction: 'upvoted' | 'downvoted') => {
  await fetch('/api/vote', {
    method: 'POST',
    body: JSON.stringify({
      type,
      typeId,
      voteStatus: direction
    })
  })
}
```

---

### 6. Pagination.tsx
**Type**: Server Component  
**Purpose**: Navigate between pages

**Props**:
```typescript
{
  total: number    // Total documents
  limit: number    // Items per page
}
```

**Features**:
- ✅ Previous/next buttons
- ✅ Page numbers
- ✅ Current page highlight
- ✅ Responsive design

**Example**:
```typescript
<Pagination total={questions.total} limit={25} />
```

---

### 7. RelativeTime.tsx
**Type**: Client Component  
**Purpose**: Hydration-safe date/time display

**Props**:
```typescript
{
  date: string      // ISO timestamp
  prefix?: string   // Text before time
}
```

**Problem Solved**:
Server renders one time, client renders different time → Hydration mismatch error

**Solution**:
```typescript
export default function RelativeTime({ date, prefix = "" }) {
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)  // Only render after hydration
  }, [])
  
  if (!isMounted) return <span>--</span>
  
  return (
    <span>
      {prefix} {convertDateToRelativeTime(new Date(date))}
    </span>
  )
}
```

**Usage**:
```typescript
<RelativeTime date={question.$createdAt} prefix="Asked" />
```

---

### 8. RTE.tsx (Rich Text Editor)
**Type**: Wrapper Component  
**Purpose**: Markdown editor with preview

**Features**:
- ✅ Live markdown preview
- ✅ Formatting toolbar
- ✅ Dark mode support
- ✅ Image upload support

**Library**: `@uiw/react-md-editor`

**Usage**:
```typescript
import MarkdownEditor from "@/components/RTE"

<MarkdownEditor 
  value={markdown}
  onChange={setMarkdown}
/>
```

---

## Page-Level Components

### Header.tsx
**Location**: `/src/app/components/Header.tsx`  
**Purpose**: Navigation bar

**Features**:
- ✅ Logo/home link
- ✅ Search box
- ✅ Auth buttons (login/profile)
- ✅ Responsive design

---

### Footer.tsx
**Location**: `/src/app/components/Footer.tsx`  
**Purpose**: Footer content

**Features**:
- ✅ Links section
- ✅ Copyright notice
- ✅ Animated background

---

### HeroSection.tsx
**Location**: `/src/app/components/HeroSection.tsx`  
**Purpose**: Landing page hero

**Features**:
- ✅ Welcome message
- ✅ Call-to-action buttons
- ✅ Animated background
- ✅ Parallax effects

---

### LatestQuestions.tsx
**Location**: `/src/app/components/LatestQuestions.tsx`  
**Purpose**: Show latest questions on homepage

**Type**: Server Component  
**Features**:
- ✅ Fetches 5 latest questions
- ✅ Displays as question cards
- ✅ Link to all questions

---

### TopContributers.tsx
**Location**: `/src/app/components/TopContributers.tsx`  
**Purpose**: Display top users by reputation

**Type**: Server Component (async)  
**Features**:
- ✅ Fetches top 10 users
- ✅ Shows user info with avatar
- ✅ Displays reputation score
- ✅ Animated list

---

## Component Props Patterns

### Form Components
```typescript
interface FormProps {
  action: (data: FormData) => Promise<any>
  isPending?: boolean
  defaultValues?: any
}
```

### List Components
```typescript
interface ListProps<T> {
  items: T[]
  onDelete?: (id: string) => Promise<void>
  onEdit?: (id: string, data: T) => Promise<void>
}
```

### Vote Components
```typescript
interface VoteProps {
  type: "question" | "answer"
  typeId: string
  initialVotes?: number
  onVote?: (voteType: string) => Promise<void>
}
```

---

## Styling Strategy

### Tailwind Classes Used
```css
/* Colors */
bg-slate-950, bg-white/5, bg-orange-500
text-white, text-orange-500, text-red-500

/* Sizing */
h-10, w-full, p-4, px-3, py-2
rounded-xl, rounded-lg, rounded-full

/* Spacing */
mb-4, mt-2, gap-3, space-y-4

/* Effects */
shadow-2xl, duration-200, hover:, focus:
border-white/20, border-orange-500
```

### Dark Mode Support
```typescript
// RTE dark mode
<MDEditor data-color-mode="dark" />

// Input styling
className="bg-slate-950 text-white border-slate-700"
```

---

## Re-usable Patterns

### Server → Client Data Passing
```typescript
// Server component fetches data
const data = await fetchData()

// Client component renders
return <ClientComponent data={data} />
```

### Auth Check Pattern
```typescript
const { user, hydrated } = useAuthStore()

if (!hydrated) return null  // Wait for rehydration
if (!user) return <LoginPrompt />  // Not logged in

return <ProtectedContent />
```

### Loading State Pattern
```typescript
const [isPending, setIsPending] = useState(false)

const handleSubmit = async () => {
  setIsPending(true)
  try {
    await submitForm()
  } finally {
    setIsPending(false)
  }
}

return (
  <button disabled={isPending}>
    {isPending ? "Loading..." : "Submit"}
  </button>
)
```

---

📌 **Next**: Read `6-AUTHENTICATION.md` for auth system
