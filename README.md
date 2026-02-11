<p align="center">
  <a href="https://mindle.space" rel="noopener">
 <img width=200px height=200px src="https://i.imgur.com/FxL5qM0.jpg" alt="Mindle logo"></a>
</p>

<h3 align="center">Mindle - Productivity & Wellness Platform</h3>

<div align="center">

[![Status](https://img.shields.io/badge/status-production-success.svg)](https://mindle.space)
[![Platform](https://img.shields.io/badge/platform-Nuxt.js-green.svg)](https://nuxt.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center"> 🧠 A comprehensive productivity and wellness platform designed to help users manage tasks, habits, focus sessions, finances, and daily mood tracking.
    <br> Built with Nuxt.js, focusing on accessibility and pure CSS styling.
</p>

## 📝 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Development](#development)
- [Deployment](#deployment)
- [Accessibility Approach](#accessibility-approach)
- [Authors](#authors)

## 🧐 About <a name = "about"></a>

Mindle is a full-stack productivity and wellness application built as a learning project to explore the Nuxt.js ecosystem. The platform serves as a production application at [mindle.space](https://mindle.space), helping users organize their daily lives through comprehensive task management, habit tracking, focus sessions, financial planning, and mood monitoring.

The project was developed with a specific focus on accessibility and pure CSS styling techniques, avoiding component libraries and SCSS mixins. This approach was chosen to better understand semantic HTML, ARIA attributes, and CSS best practices - particularly to support users with ADHD by creating a clean, distraction-free interface.

## ✨ Features <a name = "features"></a>

### Core Functionality
- **Task Management**: Create, organize, and track tasks with categories, priorities, and subtasks
- **Habit Tracking**: Build and monitor daily habits with streak tracking
- **Focus Sessions**: Pomodoro-style focus timer with customizable durations
- **Financial Planning**: Track bills, payments, and financial goals
- **Mood Tracking**: Daily mood monitoring for wellness insights
- **Planner Integration**: Calendar-style planning with task scheduling

### User Experience
- **Google Authentication**: Secure OAuth integration for easy account access
- **Responsive Design**: Mobile-first approach with tablet and desktop optimization
- **Accessibility First**: WCAG compliant components with proper ARIA labels
- **Dark/Light Themes**: Customizable theme preferences
- **Real-time Updates**: Live data synchronization across devices

## 🛠️ Tech Stack <a name = "tech-stack"></a>

### Frontend
- **Nuxt.js 4**: Vue.js meta-framework for SSR/SSG
- **Vue 3**: Composition API and reactivity system
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Pure CSS**: Custom components without external UI libraries

### Backend
- **Nuxt Server API**: Full-stack API routes
- **Prisma**: Modern database ORM
- **MongoDB**: NoSQL database for flexible data storage
- **JWT Authentication**: Secure token-based authentication
- **Google OAuth**: Third-party authentication

### Development Tools
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting standards
- **TypeScript**: Static type checking
- **pnpm**: Package manager for efficient dependency handling

## 📁 Project Structure <a name = "project-structure"></a>

```
nuxt-app/
├── app/
│   ├── assets/css/          # Custom CSS and design system
│   ├── components/          # Vue components organized by feature
│   │   ├── focus/          # Focus session components
│   │   ├── habits/         # Habit tracking components
│   │   ├── planner/        # Planning components
│   │   ├── tasks/          # Task management components
│   │   └── ui/             # Reusable UI components
│   ├── composables/        # Vue composition functions
│   ├── layouts/            # Nuxt layout components
│   ├── middleware/         # Route middleware
│   ├── pages/              # Application pages/routes
│   ├── stores/             # Pinia state management
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── server/
│   ├── api/               # API routes and handlers
│   ├── middleware/        # Server middleware
│   └── utils/             # Server utilities
├── prisma/
│   └── schema.prisma      # Database schema definition
├── public/                # Static assets
└── nuxt.config.ts        # Nuxt configuration
```

## 🏁 Getting Started <a name = "getting-started"></a>

### Prerequisites

- Node.js 18+ 
- pnpm package manager
- MongoDB database (local or cloud)
- Google OAuth credentials (optional)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd nuxt-app
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Generate Prisma client**
```bash
pnpm run postinstall
```

5. **Run development server**
```bash
pnpm run dev
```

The application will be available at `http://localhost:3000`

## ⚙️ Environment Setup <a name = "environment-setup"></a>

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="mongodb://localhost:27017/mindle"

# Authentication
JWT_SECRET="your-super-secret-jwt-key"
NUXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-oauth-client-id"

# Optional: Google OAuth Secret (for server-side verification)
GOOGLE_CLIENT_SECRET="your-google-oauth-secret"
```

## 🗄️ Database Setup <a name = "database-setup"></a>

The application uses MongoDB with Prisma ORM. The database schema includes:

- **Users**: Authentication and user preferences
- **Tasks**: Task management with categories and subtasks
- **Habits**: Habit tracking with daily logs
- **Focus Sessions**: Time tracking for focused work
- **Finance Entries**: Financial planning and bill tracking
- **Daily Moods**: Wellness and mood monitoring
- **Planner Entries**: Calendar integration

To set up the database:

1. **Install MongoDB** (local or use MongoDB Atlas)
2. **Update DATABASE_URL** in your `.env` file
3. **Run database migrations** (if needed):
```bash
npx prisma db push
```

## 🚀 Development <a name = "development"></a>

### Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run lint` - Run ESLint
- `pnpm run lint:fix` - Fix linting issues
- `pnpm run typecheck` - Run TypeScript checks

### Code Style

The project follows strict code formatting rules:
- ESLint with Prettier integration
- TypeScript for type safety
- Consistent naming conventions
- Component-based architecture

## 🌐 Deployment <a name = "deployment"></a>

The application is deployed to production at [mindle.space](https://mindle.space).

### Production Build
```bash
pnpm run build
```

### Environment Variables for Production
Ensure all required environment variables are set in your production environment, particularly:
- `DATABASE_URL` - Production MongoDB connection
- `JWT_SECRET` - Secure JWT secret key
- `NUXT_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth client ID

## ♿ Accessibility Approach <a name = "accessibility-approach"></a>

This project was developed with a strong focus on web accessibility:

### Design Decisions
- **Pure CSS Components**: Avoided component libraries to implement custom, accessible components
- **Semantic HTML**: Proper use of HTML5 semantic elements
- **ARIA Attributes**: Comprehensive ARIA labeling for screen readers
- **Keyboard Navigation**: Full keyboard accessibility support
- **Focus Management**: Proper focus indicators and trap management
- **Color Contrast**: WCAG AA compliant color schemes

### ADHD-Friendly Features
- **Clean Interface**: Minimal distractions and clutter-free design
- **Clear Visual Hierarchy**: Consistent typography and spacing
- **Predictable Interactions**: Standard UI patterns and behaviors
- **Reduced Motion Options**: Respect prefers-reduced-motion settings
- **Customizable Themes**: Light/dark mode for different preferences

### Technical Implementation
- Custom form components with proper labeling
- Accessible modal dialogs with focus management
- Screen reader announcements for dynamic content
- High contrast mode support
- Responsive text sizing

## ✍️ Authors <a name = "authors"></a>

- **Ricardo Bezerra** - Development and design
  - [GitHub](https://github.com/ricardobezerra22)

## 🎉 Acknowledgements <a name = "acknowledgement"></a>

- Nuxt.js team for the excellent framework
- Prisma team for the modern database toolkit
- The ADHD community for feedback on accessibility features
- Open source contributors for the tools and libraries used
