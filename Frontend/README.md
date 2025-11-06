# AUCA Lab Management System - Frontend

A modern, responsive React frontend for the AUCA Lab Management System built with React 19, Vite, Tailwind CSS, and React Router.

## Features

- 🎨 **Beautiful UI**: Modern, responsive design with Tailwind CSS
- 🔐 **Authentication**: JWT-based authentication with protected routes
- 👥 **Role-Based Access**: Different dashboards for Admin, Lab Manager, Instructor, and Student
- 📱 **Responsive**: Mobile-first design that works on all devices
- ⚡ **Fast**: Built with Vite for lightning-fast development and builds

## Tech Stack

- **React 19** - Latest React with hooks
- **Vite** - Fast build tool and dev server
- **React Router 7** - Client-side routing
- **Tailwind CSS 4** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icon library

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Backend API running on `http://localhost:8080`

### Installation

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── ui/          # shadcn/ui components (Button, Card, Input, etc.)
│   │   ├── Navbar.jsx   # Navigation bar
│   │   └── ProtectedRoute.jsx  # Route protection component
│   ├── context/         # React Context providers
│   │   └── AuthContext.jsx  # Authentication context
│   ├── pages/          # Page components
│   │   ├── Landing.jsx    # Landing/home page
│   │   ├── Login.jsx      # Login page
│   │   ├── Register.jsx   # Registration page
│   │   ├── Dashboard.jsx # Role-based dashboard
│   │   └── Labs.jsx       # Labs listing page
│   ├── services/        # API services
│   │   └── api.js       # Axios instance and API functions
│   ├── lib/            # Utility functions
│   │   └── utils.js     # Helper functions
│   ├── App.jsx         # Main app component with routing
│   └── main.jsx        # Entry point
```

## Default Credentials

**Admin Account:**
- Username: `admin`
- Password: `admin123`

## API Configuration

The frontend is configured to connect to the backend at `http://localhost:8080`. To change this, update the `API_BASE_URL` in `src/services/api.js`.

## Features by Role

### Admin
- Full access to all features
- User management
- Lab management
- View all bookings and maintenance
- Generate reports

### Lab Manager
- Manage assigned labs
- Manage equipment
- Approve/reject student bookings
- Create maintenance requests

### Instructor
- Create lab bookings (auto-approved)
- View own bookings
- View lab schedules

### Student
- Request lab bookings (pending approval)
- View own booking requests
- View available labs

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Styling

The project uses Tailwind CSS with custom theme configuration. The primary color is blue, matching the AUCA branding.

## Authentication Flow

1. User logs in or registers
2. JWT token is stored in localStorage
3. Token is automatically added to API requests
4. Protected routes check authentication status
5. On 401 error, user is redirected to login

## Next Steps

To extend the frontend, you can:

1. Add more CRUD pages for:
   - Equipment management
   - Booking management
   - Maintenance management
   - User management (admin)
   - Reports dashboard

2. Add features like:
   - Real-time notifications
   - Calendar view for bookings
   - Charts and graphs for reports
   - Search and filtering
   - Pagination for large lists

3. Enhance UI with:
   - Loading skeletons
   - Toast notifications
   - Modal dialogs
   - Data tables
   - Form validation

## Troubleshooting

**CORS Errors:**
- Ensure backend has CORS configured to allow requests from `http://localhost:5173`

**Authentication Issues:**
- Check that token is being stored in localStorage
- Verify backend is running and accessible
- Check browser console for errors

**Build Errors:**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version (requires 18+)

---

**Happy Coding! 🚀**
