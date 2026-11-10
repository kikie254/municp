# ITEN MUNICIPALITY WEBSITE - SETUP GUIDE

Complete guide for setting up, running, and deploying the Iten Municipality website.

---

## TABLE OF CONTENTS

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Running the Development Server](#running-the-development-server)
4. [Project Structure](#project-structure)
5. [Configuration](#configuration)
6. [Building for Production](#building-for-production)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

---

## PREREQUISITES

Before you begin, ensure you have the following installed:

### Required Software:

1. **Node.js (v18 or higher)**
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm (comes with Node.js)**
   - Verify installation: `npm --version`

3. **Git (optional, for version control)**
   - Download from: https://git-scm.com/
   - Verify installation: `git --version`

### Recommended Tools:

- **VS Code** or another code editor
- **Chrome** or **Firefox** for development
- **Postman** for API testing (when backend is added)

---

## INSTALLATION

### Step 1: Navigate to Project Directory

```bash
cd c:\Users\ADMIN\Desktop\iten-municipality-website
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 14+
- React 18+
- TypeScript
- Tailwind CSS
- Lucide React (icons)
- date-fns (date formatting)

**Note:** Installation may take 2-5 minutes depending on your internet connection.

### Step 3: Verify Installation

Check that `node_modules` folder was created:

```bash
ls node_modules
```

Or on Windows:

```powershell
dir node_modules
```

---

## RUNNING THE DEVELOPMENT SERVER

### Start the Development Server:

```bash
npm run dev
```

**Expected Output:**
```
> iten-municipality-website@1.0.0 dev
> next dev

   ▲ Next.js 14.x.x
   - Local:        http://localhost:3000
   - Network:      http://192.168.x.x:3000

 ✓ Ready in 2.5s
```

### Access the Website:

Open your browser and navigate to:

```
http://localhost:3000
```

You should see the Iten Municipality homepage.

### Development Features:

- **Hot Reload**: Changes are automatically reflected in the browser
- **Fast Refresh**: Component state is preserved during updates
- **Error Overlay**: Clear error messages appear in the browser

### Stop the Server:

Press `Ctrl + C` in the terminal

---

## PROJECT STRUCTURE

```
iten-municipality-website/
│
├── app/                          # Next.js App Router (pages and routing)
│   ├── about/                   # About Us pages
│   │   ├── page.tsx             # Main about page
│   │   ├── vision-mission/      # Vision & mission page
│   │   ├── charter/             # Municipal charter
│   │   ├── leadership/          # Leadership profiles
│   │   └── structure/           # Organizational structure
│   │
│   ├── departments/             # Department pages
│   │   ├── page.tsx            # Departments index
│   │   └── [id]/               # Individual department pages
│   │
│   ├── publications/            # Publications section
│   │   ├── page.tsx            # Publications archive
│   │   └── [id]/               # Individual publication
│   │
│   ├── development/             # Development projects
│   ├── discover/                # Discover Iten
│   ├── contact/                 # Contact page
│   ├── admin/                   # Admin dashboard (to be built)
│   │
│   ├── layout.tsx               # Root layout (header, footer)
│   ├── page.tsx                 # Homepage
│   └── globals.css              # Global styles
│
├── components/                   # Reusable React components
│   ├── layout/                  # Layout components
│   │   ├── Header.tsx          # Main navigation
│   │   └── Footer.tsx          # Site footer
│   │
│   ├── sections/                # Homepage sections
│   │   ├── HeroSection.tsx
│   │   ├── WelcomeSection.tsx
│   │   ├── VisionMissionSection.tsx
│   │   └── ... (other sections)
│   │
│   └── ui/                      # Reusable UI components
│
├── lib/                         # Utility functions and helpers
│   ├── data/                   # Data management
│   └── utils.ts                # Helper functions
│
├── public/                      # Static assets
│   ├── images/                 # Images
│   ├── documents/              # Downloadable documents
│   └── uploads/                # User uploads (created on first use)
│
├── styles/                      # Additional styles (if needed)
│
├── .gitignore                  # Git ignore rules
├── next.config.js              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
│
└── README.md                   # Project documentation
```

---

## CONFIGURATION

### Environment Variables

Create a `.env.local` file in the project root (for future database and auth setup):

```env
# Database (when adding backend)
DATABASE_URL=postgresql://user:password@localhost:5432/iten_municipality

# Authentication (when adding admin panel)
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Admin Credentials (temporary - will be replaced with proper auth)
ADMIN_EMAIL=admin@iten.go.ke
ADMIN_PASSWORD=change-this-password

# Email Configuration (for contact forms)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# File Storage (optional - for cloud storage)
# STORAGE_BUCKET=iten-municipality-files
# STORAGE_REGION=us-east-1
# STORAGE_ACCESS_KEY=your-access-key
# STORAGE_SECRET_KEY=your-secret-key
```

**Note:** The `.env.local` file is git-ignored for security.

### Tailwind CSS Configuration

Colors and styling can be customized in `tailwind.config.ts`:

```typescript
colors: {
  navy: {
    DEFAULT: '#0A2540',
    // ... other shades
  },
  accent: {
    DEFAULT: '#2E7D32',
    // ... other shades
  },
}
```

---

## BUILDING FOR PRODUCTION

### Create Production Build:

```bash
npm run build
```

This will:
1. Optimize all code
2. Generate static pages where possible
3. Create production-ready bundles
4. Output to `.next/` directory

### Test Production Build Locally:

```bash
npm start
```

Access at: `http://localhost:3000`

### Build Output:

```
Route (app)                              Size     First Load JS
┌ ○ /                                    5.2 kB          95 kB
├ ○ /about                               3.8 kB          92 kB
├ ○ /about/vision-mission                4.1 kB          93 kB
├ ○ /contact                             4.5 kB          94 kB
├ ○ /departments                         6.1 kB          96 kB
└ ○ / ... (other routes)

○  (Static)  prerendered as static content
```

---

## DEPLOYMENT

### Option 1: Vercel (Recommended - Easy & Free)

**Benefits:**
- Automatic deployments from Git
- Built-in CDN and optimizations
- Zero configuration for Next.js
- Free tier available

**Steps:**

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Follow the prompts:**
   - Set up new project? Yes
   - Link to existing project? No
   - Project name: iten-municipality-website
   - Deploy? Yes

5. **Production Deployment:**
   ```bash
   vercel --prod
   ```

**Custom Domain:**
- Add `iten.go.ke` in Vercel dashboard
- Update DNS records as instructed

---

### Option 2: Netlify

**Steps:**

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login:**
   ```bash
   netlify login
   ```

3. **Initialize:**
   ```bash
   netlify init
   ```

4. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

---

### Option 3: Custom Server (VPS/Dedicated)

**Requirements:**
- Ubuntu 20.04+ or similar
- Node.js 18+ installed
- Nginx or Apache
- PM2 for process management

**Steps:**

1. **Install PM2:**
   ```bash
   npm install -g pm2
   ```

2. **Build the project:**
   ```bash
   npm run build
   ```

3. **Start with PM2:**
   ```bash
   pm2 start npm --name "iten-municipality" -- start
   ```

4. **Configure Nginx as reverse proxy:**
   ```nginx
   server {
       listen 80;
       server_name iten.go.ke;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **Install SSL certificate (Let's Encrypt):**
   ```bash
   sudo certbot --nginx -d iten.go.ke
   ```

---

## TROUBLESHOOTING

### Common Issues:

#### 1. **"Module not found" errors**

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

#### 2. **Port 3000 already in use**

**Solution:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

#### 3. **Build fails with "Out of memory"**

**Solution:**
```bash
# Increase Node.js memory limit
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

#### 4. **Styles not updating**

**Solution:**
```bash
# Stop dev server and clear Next.js cache
rm -rf .next
npm run dev
```

#### 5. **Images not loading**

**Solution:**
- Check image paths (use `/images/...` for files in `public/images/`)
- Verify images exist in the correct location
- Check Next.js image configuration in `next.config.js`

---

### Getting Help:

**For technical issues:**
- Check Next.js documentation: https://nextjs.org/docs
- Tailwind CSS docs: https://tailwindcss.com/docs
- TypeScript docs: https://www.typescriptlang.org/docs

**For project-specific help:**
- Review `README.md`
- Check `IMPLEMENTATION_PLAN.md`
- Contact the development team

---

### Useful Commands:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type check
npx tsc --noEmit

# Clear cache
rm -rf .next

# Update dependencies
npm update
```

---

## NEXT STEPS

1. ✅ Complete installation
2. ✅ Run development server
3. ⏳ Review and customize content
4. ⏳ Add database for publications
5. ⏳ Build admin dashboard
6. ⏳ Add real content and images
7. ⏳ Test thoroughly
8. ⏳ Deploy to production

---

**Last Updated:** November 10, 2026  
**Maintained By:** Development Team  
**Version:** 1.0.0
