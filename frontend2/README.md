# Hospital Management System - React Frontend

A production-ready React frontend for a Hospital Management System with JWT authentication and role-based authorization.

## Features

✅ **JWT Authentication** - Access token + Refresh token  
✅ **Role-Based Authorization** - ROLE_USER, ROLE_ADMIN, ROLE_STAFF  
✅ **Role Selection** - Auto-select if single role, choose if multiple  
✅ **Auto Token Refresh** - Seamless token renewal with Axios interceptor  
✅ **Protected Routes** - Role-based access control  
✅ **User Dashboard** - View profile and roles  
✅ **Admin Dashboard** - Manage users and roles  
✅ **Register Page** - New user registration  
✅ **Responsive UI** - Works on desktop and mobile  

## Project Structure

```
frontend2/
├── public/
│   └── index.html
├── src/
│   ├── services/
│   │   ├── api.js                 # Axios instance with interceptors
│   │   └── authService.js         # Auth API calls
│   ├── context/
│   │   └── AuthContext.js         # Authentication context
│   ├── components/
│   │   └── ProtectedRoute.js      # Role-based route protection
│   ├── pages/
│   │   ├── Login.js              # Login page
│   │   ├── Register.js           # Register page
│   │   ├── RoleSelect.js         # Role selection page
│   │   ├── UserDashboard.js      # User dashboard
│   │   └── AdminDashboard.js     # Admin dashboard
│   ├── styles/
│   │   ├── Auth.css              # Auth pages styling
│   │   └── Dashboard.css         # Dashboard styling
│   ├── App.js                    # Main App component with routes
│   ├── App.css
│   ├── index.js                  # React entry point
│   └── index.css
├── .env.example                  # Environment variables template
├── package.json
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js 14+ and npm installed
- Spring Boot backend running on `http://localhost:8080`

### Installation

1. **Clone or navigate to the project:**
   ```bash
   cd frontend2
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```

4. **Update `.env` file:**
   ```
   REACT_APP_API_URL=http://localhost:8080
   ```
   
   Adjust the API URL if your backend is running on a different port or domain.

5. **Start the development server:**
   ```bash
   npm start
   ```

   The app will open at `http://localhost:3000`

## Usage Flow

### 1. Authentication Flow

#### Login
- Visit `http://localhost:3000/login`
- Enter username and password
- If user has multiple roles → redirected to role selection page
- If user has single role → redirected to dashboard automatically

#### Register
- Visit `http://localhost:3000/register`
- Fill in username, email, mobile, password
- Account will be created with ROLE_USER by default

#### Role Selection (if applicable)
- If user has multiple roles, they can choose one to proceed
- Selected role is stored in localStorage

### 2. Authorization Flow

#### User Dashboard (ROLE_USER, ROLE_STAFF)
- View user profile information
- Display roles and basic stats
- Access restricted to non-admin users

#### Admin Dashboard (ROLE_ADMIN)
- View all users in the system
- Add roles to existing users
- Manage user permissions

### 3. Token Management

**Automatic Token Refresh:**
- When access_token expires, the app automatically calls `/api/v1/auth/refresh`
- New tokens are stored and request is retried
- If refresh fails, user is logged out automatically

**Token Storage:**
- `access_token` - Used for API requests
- `refresh_token` - Used to get new access_token
- `selected_role` - User's chosen role
- `user_info` - User details (username, email, roles, etc.)

## API Integration

### Axios Interceptor

**Request Interceptor:**
- Automatically attaches Authorization header with Bearer token

**Response Interceptor:**
- Handles 401 errors by refreshing token
- Retries original request with new token
- Logs out user if refresh fails

### Authentication Service

All API calls are handled through `authService`:

```javascript
// Login
await authService.login(username, password);

// Register
await authService.register(username, password, email, mobile);

// Refresh token
await authService.refreshToken(refreshToken);

// Get all users (admin)
await authService.getAllUsers();

// Add role to user (admin)
await authService.addRoleToUser(username, role);

// Logout
authService.logout();
```

## API Endpoints Reference

### Authentication

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/auth/login` | POST | User login |
| `/api/v1/auth/register` | POST | User registration |
| `/api/v1/auth/refresh` | POST | Refresh access token |

### Admin Features

| Endpoint | Method | Purpose | Role |
|----------|--------|---------|------|
| `/api/v1/admin/allUser` | GET | Get all users | ROLE_ADMIN |
| `/api/v1/admin/addRole` | POST | Add role to user | ROLE_ADMIN |

## Request/Response Examples

### Login Request
```json
{
  "username": "john_doe",
  "password": "password123"
}
```

### Login Response
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "roles": ["ROLE_USER"],
  "message": "Login successful",
  "error": ""
}
```

### Register Request
```json
{
  "username": "jane_smith",
  "password": "securepass123",
  "email": "jane@example.com",
  "mobile": "+1234567890"
}
```

### Add Role Request
```json
{
  "username": "john_doe",
  "role": "ROLE_ADMIN"
}
```

## Authentication Context Hook

Use the `useAuth` hook to access authentication state and methods:

```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, selectedRole, isAuthenticated, login, logout } = useAuth();

  // user: { username, email, mobile, roles }
  // selectedRole: "ROLE_USER" | "ROLE_ADMIN" | "ROLE_STAFF"
  // isAuthenticated: boolean
}
```

## Protected Routes

Protect routes using the `ProtectedRoute` component:

```javascript
<ProtectedRoute requiredRole="ROLE_ADMIN">
  <AdminDashboard />
</ProtectedRoute>
```

If user doesn't have required role, access is denied.

## Styling

The application uses custom CSS for a clean, modern UI:

- **Auth.css** - Login, Register, Role Selection pages
- **Dashboard.css** - User and Admin dashboards
- Responsive design for mobile, tablet, and desktop
- Gradient backgrounds and smooth transitions

## Development Tips

### Debugging

1. **Check localStorage:**
   ```javascript
   console.log(localStorage.getItem('access_token'));
   console.log(localStorage.getItem('selected_role'));
   console.log(localStorage.getItem('user_info'));
   ```

2. **Monitor API calls:**
   - Open DevTools Network tab
   - Check request headers for Authorization token
   - Verify response status and data

3. **Console logging:**
   ```javascript
   import { useAuth } from '../context/AuthContext';
   
   const { user, selectedRole } = useAuth();
   console.log('User:', user);
   console.log('Role:', selectedRole);
   ```

### Building for Production

```bash
npm run build
```

Creates an optimized production build in the `build/` folder.

## Common Issues and Solutions

### Issue: "Access Denied" on protected routes
**Solution:** Ensure you have the required role. Check localStorage for selected_role.

### Issue: Blank page after login
**Solution:** Check browser console for errors. Verify API URL in .env file.

### Issue: Token not refreshing automatically
**Solution:** Check that `/api/v1/auth/refresh` endpoint is returning new tokens correctly.

### Issue: CORS errors
**Solution:** Configure CORS on Spring Boot backend to allow requests from `http://localhost:3000`

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| REACT_APP_API_URL | http://localhost:8080 | Backend API base URL |

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review backend API documentation
3. Check browser console for errors

---

**Built with React 18 + Axios + React Router v6 + Context API**
