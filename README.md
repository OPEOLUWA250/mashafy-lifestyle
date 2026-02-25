# Mashafy Lifestyle - E-Commerce Store

A premium, fully responsive e-commerce platform built for Mashafy Lifestyle, an inclusive brand for visionaries who live with intention, faith, and courage.

## 🚀 Features

### Store Features

- **Responsive Design**: Fully responsive across all devices (mobile, tablet, desktop)
- **Product Catalog**: Browse tees and journals with filtering and sorting
- **Shopping Cart**: Add to cart with persistent storage using Zustand
- **Product Pages**: Detailed product information with multiple colors and sizes
- **Search & Filter**: Find products by category, price, and other attributes
- **Beautiful UI**: Built with Tailwind CSS for modern, accessible design
- **Fast Performance**: Optimized with Vite for instant load times

### Admin Dashboard

- **Dashboard Overview**: Browse and manage products with search
- **Product Management**: Add, edit, and delete inventory
- **Responsive Admin UI**: Fully optimized for mobile and desktop

### Additional Pages

- **Home Page**: Hero section with featured products
- **About Page**: Brand story and values
- **Contact Page**: Contact form and FAQ
- **Shop Page**: Full product catalog with filters

## 🏗️ Tech Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: Zustand
- **Icons**: Lucide React
- **HTTP Client**: Axios

## 📁 Project Structure

```
mashafy-lifestyle/
├── src/
│   ├── components/
│   │   └── store/
│   │       ├── Navbar.tsx
│   │       ├── ProductCard.tsx
│   │       └── Footer.tsx
│   ├── pages/
│   │   ├── store/
│   │   │   ├── Home.tsx
│   │   │   ├── Shop.tsx
│   │   │   ├── Cart.tsx
│   │   │   ├── About.tsx
│   │   │   └── Contact.tsx
│   │   └── admin/
│   │       ├── Dashboard.tsx
│   │       ├── Products.tsx

│   ├── store/
│   │   └── cartStore.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── style.css
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
└── README.md
```

## 🎨 Brand Identity

**Mashafy Lifestyle** = "Beauty" + "Influence" (Hebrew words)

### Core Values

1. **Ambition** - Drive and determination to achieve greatness
2. **Faith** - Trust in purpose and divine direction
3. **Clarity** - Clear vision and intentional living
4. **Refinement** - Excellence in quality and execution
5. **Boldness** - Courage to stand out and be authentic

### Product Line (Launch Trio)

1. **I Dare to Stand Out** - Unisex minimalist typography tee
2. **Ambitious and Anointed** - Female & male cut variations
3. **Fierce and Fearless** - Bold statement tee
4. **Premium Journals** - For intentional living

### Community

**The Muse** - A gender-inclusive community of visionaries connected by purpose and belonging

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Open browser and navigate to:

```
http://localhost:5173/
```

## 📦 Available Scripts

### Development

```bash
npm run dev      # Start development server
```

### Build

```bash
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🔗 Routes

### Store Routes

- `/` - Home page
- `/shop` - Product catalog
- `/cart` - Shopping cart
- `/about` - About us
- `/contact` - Contact & FAQ

### Admin Routes

- `/admin/login` - Admin login page
- `/admin` - Dashboard (protected)
- `/admin/products` - Product management (protected)
- `/admin/products/new` - Add new product (protected)
- `/admin/products/:id/edit` - Edit product (protected)

## 🎯 Key Features

### Cart System

- Add/remove products
- Update quantities
- Persistent storage (localStorage)
- Real-time calculations
- Tax and shipping calculation

### Product Management

- Filter by category (tees/journals)
- Sort by price or newest
- Product details with images
- Multiple colors and sizes
- Stock management

### Admin Features

- **Secure Authentication**: Email and password login with session management
- **Rate Limiting**: Account lockout after 5 failed login attempts
- **Session Timeout**: Auto-logout after 30 minutes of inactivity
- **Protected Routes**: All admin pages require authentication
- **Product Inventory Management**: Search, filter, add, edit, and delete products
- **Mobile-responsive Dashboard**: Fully optimized for all devices

## 📱 Responsive Design

- Mobile First approach
- Optimized for all screen sizes
- Touch-friendly interface
- Fast loading on mobile networks
- Progressive enhancement

## 🎨 Color Scheme

- **Primary Color**: Brown/Gold (#cd9b64)
- **Dark**: #1a1a1a
- **Light Grays**: Various shades for hierarchy
- **Accent Colors**: For status badges and highlights

## 🚀 Deployment Ready

- Production build optimized
- Vite configured for fast builds
- React Router for client-side routing
- Can be deployed to Vercel, Netlify, or any static host

## 📊 Performance

- Optimized bundle size (~70KB gzipped)
- Fast page load times
- Efficient asset loading
- Lazy loading ready

## 🔐 Security

- Type-safe with TypeScript
- Input validation and XSS protection with React
- **Secure Admin Authentication**: Credentials managed by Supabase backend
- **No Exposed Credentials**: Admin passwords never stored in frontend or environment
- **Rate Limiting**: Protects against brute force attacks (5 attempts, 15-minute lockout)
- **Session Management**: Activity tracking and 30-minute inactivity timeout
- **Protected Routes**: All admin functionality requires valid Supabase session
- **Backend Validation**: All authentication handled securely by Supabase servers

## 🔑 Admin Authentication Setup

Admin accounts are securely managed through **Supabase Authentication**. No credentials are stored in environment variables or code.

### Creating Admin Users

1. **Go to Supabase Dashboard** → Select your project
2. **Navigate to** Authentication → Users
3. **Click** "Add User" button
4. **Enter** email and password for your admin account
5. Admin can now login at `/admin/login` with their Supabase credentials

### Security Features

- ✅ **Supabase Backend Authentication**: Credentials validated on secure backend
- ✅ **No Exposed Credentials**: No passwords in frontend code or environment variables
- ✅ **Rate Limiting**: Account lockout after 5 failed login attempts (15-minute lockout)
- ✅ **Session Timeout**: Automatic logout after 30 minutes of inactivity
- ✅ **Session Validation**: All protected routes validate active session
- ✅ **Activity Tracking**: User activity resets the inactivity timeout

## 📝 Notes

- Products are currently using Supabase database
- Admin authentication is implemented with session management
- Payment gateway integration ready for backend
- API integration points prepared for Supabase extensions

## 🤝 Contributing

For updates to Mashafy Lifestyle, follow these guidelines:

1. Create feature branches
2. Write components with TypeScript
3. Use Tailwind CSS for styling
4. Keep components modular and reusable

## 📄 License

© 2026 Mashafy Lifestyle. All rights reserved.

---

**Made with ⚡ for the Muse Community**

For inquiries: hello@mashafy.com | +234 818 012 9670 | WhatsApp: https://wa.me/2348180129670
