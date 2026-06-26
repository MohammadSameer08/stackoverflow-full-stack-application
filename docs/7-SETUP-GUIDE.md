# Setup Guide & Deployment

## Prerequisites

Before starting, ensure you have:
- Node.js 18+ ([download](https://nodejs.org/))
- npm or yarn package manager
- Appwrite account ([cloud.appwrite.io](https://cloud.appwrite.io))
- Git (optional, for version control)

---

## Local Development Setup

### Step 1: Clone Repository

```bash
git clone <your-repo-url>
cd stackoverflow-appwrite
```

Or create new folder:
```bash
mkdir stackoverflow-appwrite
cd stackoverflow-appwrite
```

---

### Step 2: Install Dependencies

```bash
npm install
```

**Key dependencies installed:**
- next@14.2.4
- react@18
- typescript@5
- tailwindcss@3
- zustand (state management)
- @uiw/react-md-editor (rich text editor)
- @tabler/icons-react (icons)
- appwrite (SDK)

---

### Step 3: Setup Appwrite

#### Option A: Appwrite Cloud (Recommended)

1. Go to [cloud.appwrite.io](https://cloud.appwrite.io)
2. Sign up or login
3. Create new project
4. Copy your:
   - **Endpoint**: `https://cloud.appwrite.io/v1`
   - **Project ID**: From project settings
   - **API Key**: From API keys section

#### Option B: Self-Hosted Appwrite

```bash
# Install Docker & Docker Compose
# Then run:
docker run -d \
  -e _APP_ENV=development \
  -e _APP_OPENSSL_KEY_V1=$(openssl rand -hex 16) \
  -e _APP_REDIS_HOST=redis \
  -e _APP_REDIS_PORT=6379 \
  -p 80:80 \
  --name=appwrite \
  appwrite/appwrite:latest
```

---

### Step 4: Environment Variables

Create `.env.local` file in project root:

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_APPWRITE_API_KEY=your_api_key_here
```

**Important**: 
- `.env.local` is in `.gitignore` (never commit secrets)
- `NEXT_PUBLIC_*` variables are exposed to browser
- API Key should be restricted to specific operations

---

### Step 5: Setup Appwrite Database

1. Go to Appwrite console
2. Create **Database**: `main-stackflow`
3. Create **Collections**:

#### Questions Collection
```
Collection ID: questions
Attributes:
- title (string, required)
- content (string, required)
- tags (string)
- authorId (string, required)
- attachmentId (string)
```

#### Answers Collection
```
Collection ID: answers
Attributes:
- content (string, required)
- questionId (string, required) - FK to questions
- authorId (string, required) - FK to users
- attachmentId (string)
```

#### Comments Collection
```
Collection ID: comments
Attributes:
- content (string, required)
- type (string, required) - "question" or "answer"
- typeId (string, required) - ID of question or answer
- authorId (string, required) - FK to users
```

#### Votes Collection
```
Collection ID: votes
Attributes:
- type (string, required) - "question" or "answer"
- typeId (string, required) - ID of question or answer
- voteStatus (string, required) - "upvoted" or "downvoted"
- userId (string, required) - Who voted
```

#### Storage Bucket
```
Bucket ID: question-attachment
File Size Limit: 10MB (default)
Allowed Extensions: pdf, doc, docx, jpg, png
```

---

### Step 6: Start Development Server

```bash
npm run dev
```

Server starts at: **http://localhost:3000**

---

## Project Structure Recap

```
stackoverflow-appwrite/
├── src/
│   ├── app/                 # Next.js pages & routes
│   ├── components/          # Reusable components
│   ├── models/              # Appwrite config
│   ├── store/               # Zustand state
│   ├── utils/               # Helper functions
│   └── lib/                 # Libraries
├── docs/                    # Documentation (you are here!)
├── public/                  # Static files
├── .env.local              # Environment variables (don't commit!)
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── tailwind.config.ts      # Tailwind config
├── next.config.mjs         # Next.js config
└── README.md               # Project readme
```

---

## Development Commands

### Run Development Server
```bash
npm run dev
```
Watches for changes, hot-reload enabled

### Build for Production
```bash
npm run build
```
Creates optimized build in `.next/` folder

### Start Production Server
```bash
npm run start
```
Runs built app (must run `npm run build` first)

### Type Check
```bash
npm run type-check
```
Validates TypeScript types

### Lint Code
```bash
npm run lint
```
Checks code quality

---

## Deployment

### Deploy to Vercel (Recommended for Next.js)

**Step 1: Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push -u origin main
```

**Step 2: Create Vercel Account**
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Select your repository
5. Click "Import"

**Step 3: Configure Environment Variables**
1. In Vercel dashboard, go to **Settings** → **Environment Variables**
2. Add:
   - `NEXT_PUBLIC_APPWRITE_ENDPOINT`
   - `NEXT_PUBLIC_APPWRITE_PROJECT_ID`
   - `NEXT_PUBLIC_APPWRITE_API_KEY`

**Step 4: Deploy**
1. Click "Deploy"
2. Wait for build to complete
3. Your app is live! 🎉

**Live URL**: `https://your-project.vercel.app`

---

### Deploy to Netlify

**Step 1: Push to GitHub** (same as above)

**Step 2: Create Netlify Account**
1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site"
3. Select "Import an existing project"
4. Choose GitHub
5. Authorize and select repository

**Step 3: Configure**
1. Build command: `npm run build`
2. Publish directory: `.next`
3. Add environment variables (same as Vercel)

**Step 4: Deploy**
1. Click "Deploy site"
2. Netlify builds and deploys automatically

---

### Manual Deployment (VPS/Server)

**Step 1: Prepare server**
```bash
# SSH into server
ssh user@server-ip

# Install Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18

# Clone repository
git clone <your-repo-url>
cd stackoverflow-appwrite
```

**Step 2: Install & Build**
```bash
npm install
npm run build
```

**Step 3: Setup PM2 (process manager)**
```bash
npm install -g pm2
pm2 start npm --name "stackoverflow" -- start
pm2 save
pm2 startup
```

**Step 4: Setup Nginx (reverse proxy)**
```bash
# Install Nginx
sudo apt-get install nginx

# Create config
sudo nano /etc/nginx/sites-available/stackoverflow

# Add:
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable
sudo ln -s /etc/nginx/sites-available/stackoverflow /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

**Step 5: SSL Certificate (Let's Encrypt)**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Production Checklist

Before going live:

- [ ] Environment variables set correctly
- [ ] Appwrite security rules configured
- [ ] HTTPS enabled
- [ ] Database backups configured
- [ ] Error monitoring setup (Sentry, LogRocket)
- [ ] Analytics enabled (Google Analytics)
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Database indexes created
- [ ] Search functionality optimized
- [ ] Images optimized
- [ ] Performance tested
- [ ] Security audit completed

---

## Troubleshooting

### "Cannot find module 'appwrite'"
```bash
npm install appwrite
```

### "ENOENT: no such file or directory '.env.local'"
```bash
# Create .env.local file
touch .env.local

# Add variables
NEXT_PUBLIC_APPWRITE_ENDPOINT=...
NEXT_PUBLIC_APPWRITE_PROJECT_ID=...
NEXT_PUBLIC_APPWRITE_API_KEY=...
```

### "Connection refused" to Appwrite
- Check Appwrite server is running
- Verify endpoint URL is correct
- Check firewall settings
- Try using Appwrite Cloud instead

### "Document with the requested ID could not be found"
- Verify collection IDs match (`/src/models/name.ts`)
- Check document exists in database
- Verify query filters are correct

### "User is not authenticated"
- Ensure session is created
- Check token is included in requests
- Verify Appwrite permissions

### Build failing in production
```bash
# Try clean build
rm -rf .next
npm run build

# Check for TypeScript errors
npm run type-check

# Check for lint errors
npm run lint
```

---

## Performance Optimization

### Caching Strategy
```typescript
// Cache for 1 hour (3600 seconds)
export const revalidate = 3600
```

### Image Optimization
```typescript
import Image from 'next/image'

<Image 
  src="/image.jpg"
  alt="Description"
  width={400}
  height={300}
  priority  // Load immediately
/>
```

### Database Indexes
Create indexes in Appwrite for frequently queried fields:
- `questions.authorId`
- `questions.$createdAt`
- `answers.questionId`
- `votes.typeId`

### API Optimization
```typescript
// Limit fields returned
Query.select(["$id", "title", "authorId"])

// Pagination
Query.limit(25)
Query.offset((page - 1) * 25)
```

---

## Monitoring & Logging

### Setup Error Monitoring
```typescript
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: "your-sentry-dsn",
  tracesSampleRate: 1.0,
})
```

### Log Important Events
```typescript
console.log("User created:", user.$id)
console.log("Question posted:", question.$id)
console.error("Vote failed:", error)
```

---

## Maintenance

### Regular Tasks
- ✅ Check error logs daily
- ✅ Monitor database size
- ✅ Review user feedback
- ✅ Update dependencies monthly
- ✅ Backup database weekly
- ✅ Review analytics

### Update Dependencies
```bash
npm outdated          # Check outdated packages
npm update            # Update all packages
npm audit fix         # Fix security vulnerabilities
```

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Appwrite Documentation](https://appwrite.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Documentation](https://react.dev)

---

## Support & Questions

- Check [Appwrite Discussions](https://github.com/appwrite/appwrite/discussions)
- Search [Stack Overflow](https://stackoverflow.com)
- Create GitHub issue
- Ask in community Discord

---

## License

MIT License - Feel free to use this project!

---

**Documentation created**: 2026-06-26  
**Last updated**: 2026-06-26

For more information, check individual documentation files!
