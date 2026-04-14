# Hospital Management System - Implementation Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    REACT FRONTEND                           │
│  (http://localhost:3000)                                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         PAGES / COMPONENTS                           │  │
│  │ ┌─────────────┐  ┌──────────────┐  ┌────────────┐   │  │
│  │ │Login        │  │Register      │  │RoleSelect  │   │  │
│  │ └─────────────┘  └──────────────┘  └────────────┘   │  │
│  │ ┌──────────────────────────────────────────────────┐ │  │
│  │ │UserDashboard / AdminDashboard (Protected)        │ │  │
│  │ └──────────────────────────────────────────────────┘ │  │
│  └─────────────┬──────────────────────────────────────┘  │
│                │                                          │
│  ┌─────────────▼──────────────────────────────────────┐  │
│  │  AuthContext (useAuth Hook)                        │  │
│  │  - user state                                      │  │
│  │  - selectedRole state                             │  │
│  │  - isAuthenticated state                          │  │
│  │  - login / register / logout functions            │  │
│  │  - Token management                               │  │
│  └─────────────┬──────────────────────────────────────┘  │
│                │                                          │
│  ┌─────────────▼──────────────────────────────────────┐  │
│  │  Axios Interceptors (api.js)                       │  │
│  │  - Attach Authorization header                     │  │
│  │  - Handle token expiration (401)                   │  │
│  │  - Auto-refresh token                             │  │
│  │  - Retry failed requests                          │  │
│  └─────────────┬──────────────────────────────────────┘  │
│                │                                          │
│  ┌─────────────▼──────────────────────────────────────┐  │
│  │  Auth Service (authService.js)                     │  │
│  │  - login()                                         │  │
│  │  - register()                                      │  │
│  │  - refreshToken()                                 │  │
│  │  - getAllUsers()                                  │  │
│  │  - addRoleToUser()                                │  │
│  │  - logout()                                       │  │
│  └─────────────┬──────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                                 API REQUESTS                │
│ ┌────────────────────────────────────────────────────────┐ │
│ │   SPRING BOOT BACKEND (http://localhost:8080)         │ │
│ │   - JWT Authentication                                │ │
│ │   - Role-Based Authorization                          │ │
│ │   - User Management                                   │ │
│ │   - Role Assignment                                   │ │
│ └────────────────────────────────────────────────────────┘ │
│                                 ▲                           │
│                    OAuth2/JWT   │                           │
└────────────────────────────────┼───────────────────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │  MongoDB Database         │
                    │  - Users Collection       │
                    │  - Roles Collection       │
                    │  - Audit Logs             │
                    └───────────────────────────┘
```

## Authentication Flow

### 1. Login Flow

```
User enters credentials
        │
        ▼
Login Page
        │
        ▼
authService.login(username, password)  [POST /api/v1/auth/login]
        │
        ▼
Backend validates credentials
        │
        ├─── Invalid ─┬─ Return 401/400
        │             └─ Show error in UI
        │
        └─── Valid ──┬─ Generate JWT tokens
                     ├─ Return access_token, refresh_token, roles
                     │
                     ▼
        Store in localStorage:
        - access_token
        - refresh_token
        - user_info (username, email, roles)
                     │
                     ├─── Multiple roles? ──┬─ Go to RoleSelect page
                     │                       └─ User chooses role
                     │
                     └─── Single role? ──────┬─ Auto-select role
                                            └─ Store in localStorage
                                            └─ Redirect to Dashboard
```

### 2. Token Refresh Flow

```
API Request with access_token
        │
        ▼
Response received
        │
        ├─── 200 OK ──────── Request successful
        │
        └─── 401 Unauthorized
                │
                ▼
        Token expired - Axios Interceptor triggers
                │
                ▼
        Refresh Token Flow:
                │
                ▼
        POST /api/v1/auth/refresh
        { refresh_token: "..." }
                │
                ├─── Success ──┬─ Get new access_token
                │              ├─ Store in localStorage
                │              └─ Retry original request with new token
                │
                └─── Failed ──┬─ Clear localStorage
                              ├─ Redirect to login
                              └─ Show error
```

### 3. Logout Flow

```
User clicks Logout
        │
        ▼
authService.logout()
        │
        ├─ Clear localStorage:
        │  - access_token
        │  - refresh_token
        │  - selected_role
        │  - user_info
        │
        ├─ Reset AuthContext state
        │
        └─ Redirect to /login
```

## Role-Based Access Control

### User Roles

| Role | Access | Dashboard |
|------|--------|-----------|
| ROLE_USER | /user-dashboard, /dashboard | Can view own profile |
| ROLE_STAFF | /user-dashboard, /dashboard | Can view own profile |
| ROLE_ADMIN | /admin-dashboard, /user-dashboard, /dashboard | Can manage users and roles |

### Protected Route Component

```javascript
<ProtectedRoute requiredRole="ROLE_ADMIN">
  <AdminDashboard />
</ProtectedRoute>
```

**Flow:**
1. Check if user is authenticated
2. If not → Redirect to /login
3. If authenticated:
   - If requiredRole is set, check if user has that role
   - If role doesn't match → Show "Access Denied"
   - If role matches → Render component

## Token Structure (JWT Example)

```
Header:
{
  "alg": "HS512",
  "typ": "JWT"
}

Payload:
{
  "sub": "john_doe",
  "roles": ["ROLE_USER", "ROLE_ADMIN"],
  "email": "john@example.com",
  "iat": 1700000000,
  "exp": 1700003600,
  "iss": "hospital-system"
}

Signature:
HMACSHA512(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

## Axios Interceptor Logic

### Request Interceptor

```javascript
// Before sending request:
if (localStorage.getItem('access_token')) {
  config.headers.Authorization = `Bearer ${access_token}`;
}
return config;
```

### Response Interceptor

```javascript
// If response status is 401:
if (error.response.status === 401 && !originalRequest._retry) {
  originalRequest._retry = true;
  
  // Get refresh token
  const refreshToken = localStorage.getItem('refresh_token');
  
  // POST /api/v1/auth/refresh
  const response = await axios.post('/api/v1/auth/refresh', {
    refresh_token: refreshToken
  });
  
  // Store new tokens
  localStorage.setItem('access_token', response.data.access_token);
  localStorage.setItem('refresh_token', response.data.refresh_token);
  
  // Retry original request with new token
  originalRequest.headers.Authorization = `Bearer ${new_access_token}`;
  return api(originalRequest);
}
```

## Component Interaction

### App.js (Route Setup)

```
App
├── <Router>
│   └── <AuthProvider>
│       └── <AppRoutes>
│           ├── /login → <Login />
│           ├── /register → <Register />
│           ├── /role-select → <ProtectedRoute><RoleSelect /></ProtectedRoute>
│           ├── /dashboard → <ProtectedRoute><Dashboard /></ProtectedRoute>
│           ├── /user-dashboard → <ProtectedRoute requiredRole="ROLE_USER"><UserDashboard /></ProtectedRoute>
│           └── /admin-dashboard → <ProtectedRoute requiredRole="ROLE_ADMIN"><AdminDashboard /></ProtectedRoute>
```

### AuthContext Hook

```javascript
const { 
  user,              // { username, email, mobile, roles }
  selectedRole,      // "ROLE_USER" | "ROLE_ADMIN" | "ROLE_STAFF"
  isAuthenticated,   // boolean
  loading,           // boolean
  error,             // string | null
  login,             // async function
  register,          // async function
  selectRole,        // function
  logout             // function
} = useAuth();
```

## Data Flow Example: User Login

```
1. User types credentials in Login component
   - state: username, password

2. User clicks "Login" button
   - Calls: login(username, password)

3. AuthContext.login executes:
   - Calls: authService.login(username, password)

4. authService.login executes:
   - POST /api/v1/auth/login with credentials
   - Using: Axios instance

5. Axios request interceptor:
   - Adds headers (Content-Type)
   - Sends request to backend

6. Backend responds with:
   {
     "access_token": "eyJhbGc...",
     "refresh_token": "eyJhbGc...",
     "roles": ["ROLE_USER"],
     "username": "john_doe"
   }

7. AuthContext.login processes response:
   - localStorage.setItem('access_token', ...)
   - localStorage.setItem('refresh_token', ...)
   - localStorage.setItem('user_info', ...)
   - setUser({ username, email, roles, mobile })
   
   - If multiple roles:
       - Return { requiresRoleSelection: true }
       - Navigate to /role-select
   
   - If single role:
       - setSelectedRole(roles[0])
       - localStorage.setItem('selected_role', ...)
       - setIsAuthenticated(true)
       - Navigate to /dashboard

8. Dashboard component renders based on role:
   - ROLE_ADMIN → Navigate to /admin-dashboard
   - ROLE_USER or ROLE_STAFF → Navigate to /user-dashboard
```

## Error Handling

### Login Errors

```javascript
try {
  const result = await login(username, password);
  if (result.success) {
    // Success handling
  } else {
    // Show error: result.error
  }
} catch (error) {
  // Network or other error
}
```

### API Errors

```javascript
// In authService:
try {
  const response = await api.post('/api/v1/auth/login', {...});
  return response.data;
} catch (error) {
  throw error.response?.data || error.message;
}

// In component:
if (error) {
  <div className="error-message">{error}</div>
}
```

### Token Expiration

```
User makes API request
    │
    ▼
Response has 401 status
    │
    ▼
Axios Response Interceptor catches error
    │
    ├─ Check if refresh_token exists
    │
    ├─── YES ──── Try to refresh
    │            │
    │            ├─ POST /api/v1/auth/refresh
    │            │
    │            ├─ Success: Update tokens, retry
    │            │
    │            └─ Failed: Clear storage, redirect to login
    │
    └─── NO ───── Clear storage, redirect to login
```

## LocalStorage Structure

```javascript
{
  access_token: "eyJhbGciOiJIUzUxMiJ9...",
  refresh_token: "eyJhbGciOiJIUzUxMiJ9...",
  selected_role: "ROLE_ADMIN",
  user_info: JSON.stringify({
    username: "john_doe",
    email: "john@example.com",
    mobile: "+1234567890",
    roles: ["ROLE_USER", "ROLE_ADMIN"]
  })
}
```

## Environment Configuration

```bash
# .env file
REACT_APP_API_URL=http://localhost:8080
```

Used in:
- `src/services/api.js` - Axios baseURL
- `src/services/authService.js` - API endpoints

## State Management Flow

```
Global State (AuthContext)
├── user
│   ├── username
│   ├── email
│   ├── mobile
│   └── roles
├── selectedRole
├── isAuthenticated
├── loading
└── error

Local Component State
├── Login Component
│   ├── username (form input)
│   ├── password (form input)
│   └── error (submission error)
├── Register Component
│   ├── formData (email, mobile, etc.)
│   ├── error
│   └── success
└── AdminDashboard Component
    ├── users
    ├── newRoleUsername
    ├── newRole
    └── error
```

## Security Considerations

1. **Token Storage**: Stored in localStorage (vulnerable to XSS)
   - **Mitigation**: Keep tokens short-lived, refresh frequently

2. **CORS**: Frontend communicates with backend API
   - **Mitigation**: Configure CORS on backend properly

3. **JWT Validation**: Backend validates JWT signature
   - **Mitigation**: Use strong secret key

4. **Refresh Token**: Valid for longer period
   - **Mitigation**: Store refresh token securely, rotate regularly

5. **Role Validation**: Check roles on backend for every request
   - **Mitigation**: Never trust role from frontend alone

## Performance Optimization

1. **Code Splitting**: Routes are lazy-loaded (use React.lazy() if needed)
2. **API Caching**: Consider implementing response caching for users list
3. **Memoization**: Use React.memo() for expensive components
4. **Debouncing**: Form inputs debouncing (add if needed)

## Troubleshooting Checklist

- [ ] Backend is running on http://localhost:8080
- [ ] `.env` file has correct `REACT_APP_API_URL`
- [ ] CORS is enabled on backend
- [ ] JWT tokens are being generated correctly
- [ ] Refresh token endpoint is working
- [ ] Roles are being returned in login response
- [ ] Browser localStorage is enabled
- [ ] Check browser console for errors

## Production Deployment

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Update API URL in .env:**
   ```
   REACT_APP_API_URL=https://api.example.com
   ```

3. **Deploy to:**
   - Vercel
   - Netlify
   - GitHub Pages
   - AWS S3 + CloudFront
   - Docker container
   - Self-hosted server (nginx)

## Next Steps

1. Test all authentication flows
2. Implement additional admin features
3. Add patient/appointment management
4. Implement medical records system
5. Add notifications/alerts
6. Implement logging and analytics
7. Add automated testing
