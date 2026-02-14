# Sortify - AI-Powered Waste Disposal Web App

## Overview
Sortify is a desktop-first, responsive web application that helps users correctly dispose of items using AI, gamification, and interactive maps.

## Features

### 1. Authentication (`/src/app/pages/AuthPage.tsx`)
- Email/password login
- User registration
- Guest/anonymous login
- Clean, welcoming design with error states

### 2. Scan Page (`/src/app/pages/ScanPage.tsx`)
- Camera preview using browser MediaDevices API
- Image capture functionality
- AI analysis simulation (2-second mock delay)
- Result card showing:
  - Item name
  - Bin category (waste/compost/recycle)
  - Confidence percentage
  - Explanation text
  - Points earned (+10)
- Actions: Find nearest bin, scan another item

### 3. Map Page (`/src/app/pages/MapPage.tsx`)
- Interactive map using Leaflet/React-Leaflet
- Color-coded bin markers:
  - Blue: Recycle
  - Green: Compost
  - Gray: Waste
- Filter panel for bin categories
- Bin detail popup with:
  - Type, address, distance
  - "Open in Google Maps" button

### 4. Leaderboard Page (`/src/app/pages/LeaderboardPage.tsx`)
- User points and rank display
- Scope selector: Local / National / Worldwide
- Ranking table with:
  - Rank badges (crown for #1, medals for #2-3)
  - Username
  - Points
  - Current user highlight
- How to earn points section

### 5. Profile Page (`/src/app/pages/ProfilePage.tsx`)
- User profile card with avatar
- Total points and rank
- Quick stats (total scans, most used category, avg confidence)
- Category breakdown chart
- Complete scan history with:
  - Item name
  - Bin category
  - Confidence
  - Timestamp
  - Points earned

## Component Structure

```
/src/app/
├── App.tsx                    # Main app with routing
├── components/
│   ├── Navigation.tsx         # Top navigation bar
│   └── ui/                    # Reusable UI components (buttons, cards, etc.)
├── contexts/
│   └── AppContext.tsx         # Global state management with mock data
└── pages/
    ├── AuthPage.tsx           # Authentication
    ├── ScanPage.tsx           # Item scanning
    ├── MapPage.tsx            # Bin location map
    ├── LeaderboardPage.tsx    # Rankings
    └── ProfilePage.tsx        # User profile
```

## Mock Data & API Readiness

All data is currently mocked in `/src/app/contexts/AppContext.tsx`:

### Mock Functions (Ready for API Integration)
- `login(email, password)` - Simulates user authentication
- `signup(email, password, username)` - Simulates user registration
- `loginAsGuest()` - Creates guest user session
- `performScan(imageData)` - Simulates AI analysis (replace with real API call)
- `bins` - Array of bin locations (replace with geolocation API)
- `leaderboardData` - Rankings by scope (replace with backend API)

### Data Placeholder Variables
The app uses clear variable naming for easy API integration:
- `{{user.points}}` - User's total points
- `{{user.rank}}` - User's current rank
- `{{scan.result}}` - Latest scan result
- `{{bins[]}}` - Array of bin locations
- `{{leaderboardData[]}}` - Leaderboard entries
- `{{scanHistory[]}}` - User's scan history

## Styling

- **Framework**: Tailwind CSS v4
- **Theme**: Green/sustainability-focused color scheme
- **Components**: shadcn/ui component library
- **Icons**: Lucide React
- **Responsive**: Desktop-first, responsive design

### Color Scheme
- Primary: Green (#22c55e, #16a34a)
- Recycle: Blue (#3b82f6)
- Compost: Green (#22c55e)
- Waste: Gray (#6b7280)

## Technology Stack

- **React** 18.3.1 - UI framework
- **TypeScript** - Type safety
- **React Router** 7.13.0 - Client-side routing
- **Leaflet** 1.9.4 - Interactive maps
- **React Leaflet** 5.0.0 - React wrapper for Leaflet
- **Tailwind CSS** 4.1.12 - Styling
- **Lucide React** - Icons
- **shadcn/ui** - Component library

## Getting Started

1. All pages are accessible through the top navigation
2. Start at the Auth page (login, signup, or guest)
3. Default landing page after auth: `/scan`
4. All mock data is pre-populated for demonstration

## API Integration Points

### To connect to real APIs, update:

1. **AppContext.tsx** - Replace mock functions with API calls:
   ```typescript
   const login = async (email, password) => {
     const response = await fetch('/api/auth/login', {
       method: 'POST',
       body: JSON.stringify({ email, password })
     });
     // Handle response
   };
   ```

2. **Scan functionality** - Replace mock AI with real endpoint:
   ```typescript
   const performScan = async (imageData) => {
     const response = await fetch('/api/scan', {
       method: 'POST',
       body: JSON.stringify({ image: imageData })
     });
     // Handle AI response
   };
   ```

3. **Map data** - Fetch bins from geolocation API
4. **Leaderboard** - Fetch rankings from backend
5. **Profile** - Fetch user data and history from database

## Notes

- Camera access requires HTTPS in production
- Map requires internet connection for tiles
- All timestamps use browser's local timezone
- Points system is purely frontend (needs backend validation)
- Guest users can use all features but won't persist data

## Future Enhancements

- Real-time leaderboard updates
- Push notifications for challenges
- Social sharing features
- Achievement badges
- Weekly/monthly challenges
- Community features
- Multi-language support
