# Iten Municipality Official Website

**County Government of Elgeyo Marakwet**  
*A Town of Choice for Sports, Tourism and Investment*

## Overview

This is the official website for Iten Municipality, showcasing municipal information, services, publications, development projects, and community engagement.

## Features

- **Institutional Information**: About us, vision, mission, leadership, and organizational structure
- **Departments**: Comprehensive department information and contacts
- **Publications**: News, public notices, tenders, reports, and documents
- **Development Projects**: Infrastructure and development portfolio
- **Discover Iten**: Tourism, athletics heritage, and investment opportunities
- **Contact & Engagement**: Multiple channels for public interaction
- **Content Management System**: Simple admin interface for content updates

## Technology Stack

- **Frontend**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel recommended

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser at
http://localhost:3000
```

### Build for Production

```bash
# Build optimized production bundle
npm run build

# Run production server
npm start
```

## Project Structure

```
iten-municipality-website/
├── app/                    # Next.js App Router pages
│   ├── about/             # About Us pages
│   ├── departments/       # Department pages
│   ├── development/       # Development projects
│   ├── publications/      # Publications archive
│   ├── discover/          # Discover Iten
│   ├── contact/           # Contact page
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # Reusable React components
│   ├── layout/            # Layout components
│   ├── ui/                # UI components
│   └── sections/          # Page sections
├── lib/                   # Utility functions
│   ├── data/              # Data management
│   └── utils.ts           # Helpers
├── public/                # Static assets
│   ├── images/            # Images
│   ├── documents/         # Downloadable documents
│   └── uploads/           # User uploads
└── styles/                # Global styles

```

## Content Management

### Admin Access

Access the admin dashboard at `/admin` (authentication required)

### Managing Content

- **Publications**: Create, edit, and publish news, notices, and tenders
- **Documents**: Upload and organize PDFs and documents
- **Projects**: Add and update development projects
- **Pages**: Edit institutional pages

## Configuration

### Environment Variables

Create a `.env.local` file:

```env
# Admin Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password

# Database (if using)
DATABASE_URL=your_database_url

# File Storage (if using cloud storage)
STORAGE_URL=your_storage_url
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms

The site can be deployed to any platform supporting Next.js:
- Netlify
- AWS Amplify
- Digital Ocean
- Custom server with Node.js

## Maintenance

### Adding Content

1. Access admin dashboard
2. Navigate to relevant section
3. Create or edit content
4. Publish when ready

### Updating Pages

- Institutional content: Edit in `app/` directory
- Components: Update in `components/` directory
- Styles: Modify Tailwind classes or `globals.css`

## Support

For technical support or inquiries about the website:

**Iten Municipality**  
Email: info@iten.go.ke  
Phone: [Official contact]

## License

© 2026 Iten Municipality, County Government of Elgeyo Marakwet.  
All rights reserved.

---

**Built with Next.js | Designed for the People of Iten**
