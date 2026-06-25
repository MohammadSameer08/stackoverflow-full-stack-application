# Database Architecture Overview

Your app uses **Appwrite** (a BaaS platform) for database operations. Here's how it's structured:

## 1. **Two-Client Configuration**

- **Server-side** (`server/config.ts`): Uses `node-appwrite` with API key authentication (full admin access)
- **Client-side** (`client/config.ts`): Uses `appwrite` SDK without API key (user-level permissions)

## 2. **Database Setup Flow** (`dbSetup.ts`)

When the app starts:

1. **Tries to connect** to existing database named `"main-stackflow"`
2. **If it doesn't exist**, creates the database and initializes all collections:
   - Questions
   - Answers
   - Comments
   - Votes
   - File Storage (for question attachments)

## 3. **Collection Structure** (e.g., `question.collection.ts`)

Each collection follows this pattern:

- **Create collection** with permissions (read for anyone, write for authenticated users)
- **Define attributes** (fields) with types and constraints:
  - `title`: 255 chars
  - `content`: 1000 chars
  - `authorId`, `tags`, `attachmentId`: String fields
- **Create indexes** for faster querying (fulltext indexes on title and authorId)

## 4. **Storage Bucket** (`storage.collection.ts`)

- Stores question attachments
- Allowed file types: jpg, png, gif, jpeg, webp, heic
- Permissions: users can create/update/delete their own files, anyone can read

## 5. **Constants** (`name.ts`)

Centralized DB/collection/bucket names to avoid hardcoding strings throughout the app.

## Summary

Your app uses a server-side setup script to auto-initialize the database schema, then clients interact with collections based on their permission level.
