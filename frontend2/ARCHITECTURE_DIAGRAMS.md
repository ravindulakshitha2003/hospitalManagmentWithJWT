# System Architecture & Flow Diagrams

## 1. Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        BROWSER                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │            REACT APPLICATION (frontend2)                │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │  App.js (Routes)                                   │ │  │
│  │  │  ├─ /login → <Login />                            │ │  │
│  │  │  ├─ /register → <Register />                      │ │  │
│  │  │  ├─ /role-select → <RoleSelect />                │ │  │
│  │  │  └─ /dashboard → <Protected><Dashboard/></       │ │  │
│  │  └─────────────────┬────────────────────────────────┘ │  │
│  │                    │                                   │  │
│  │  ┌─────────────────▼────────────────────────────────┐ │  │
│  │  │  AuthProvider (AuthContext.js)                  │ │  │
│  │  │  ├─ user (state)                               │ │  │
│  │  │  ├─ selectedRole (state)                       │ │  │
│  │  │  ├─ isAuthenticated (state)                    │ │  │
│  │  │  ├─ login() function                           │ │  │
│  │  │  ├─ logout() function                          │ │  │
│  │  │  └─ selectRole() function                      │ │  │
│  │  └─────────────────┬────────────────────────────────┘ │  │
│  │                    │                                   │  │
│  │  ┌─────────────────▼────────────────────────────────┐ │  │
│  │  │  Services Layer                                 │ │  │
│  │  │  ┌──────────────────────────────────────────┐  │ │  │
│  │  │  │ authService.js                          │  │ │  │
│  │  │  │ .login() .register() .refreshToken()    │  │ │  │
│  │  │  │ .getAllUsers() .addRoleToUser()         │  │ │  │
│  │  │  └──────────────────┬───────────────────────┘  │ │  │
│  │  │  ┌──────────────────▼───────────────────────┐  │ │  │
│  │  │  │ api.js (Axios Instance)                 │  │ │  │
│  │  │  │ ├─ Request Interceptor                  │  │ │  │
│  │  │  │ │  └─ Attach Authorization header       │  │ │  │
│  │  │  │ └─ Response Interceptor                 │  │ │  │
│  │  │  │    ├─ Catch 401 errors                 │  │ │  │
│  │  │  │    └─ Auto-refresh token & retry       │  │ │  │
│  │  │  └──────────────────┬───────────────────────┘  │ │  │
│  │  └───────────────────────────────────────────────┘ │  │
│  │                      │                             │  │
│  │                      │ HTTP Requests (with JWT)    │  │
│  │                      └──────────┐                  │  │
│  └──────────────────────────────────┼──────────────────┘  │
│                                      │                    │
└──────────────────────────────────────┼────────────────────┘
                                       │
                    ┌──────────────────▼──────────────────┐
                    │   SPRING BOOT BACKEND               │
                    │   (http://localhost:8080)          │
                    ├──────────────────────────────────────┤
                    │                                      │
                    │  /api/v1/auth/                      │
                    │  ├─ POST /login                     │
                    │  ├─ POST /register                  │
                    │  └─ POST /refresh                   │
                    │                                      │
                    │  /api/v1/admin/                     │
                    │  ├─ GET /allUser                    │
                    │  └─ POST /addRole                   │
                    │                                      │
                    │  JWT Filter & Security Config       │
                    └──────────────────┬───────────────────┘
                                       │
                    ┌──────────────────▼──────────────────┐
                    │   MONGODB DATABASE                  │
                    ├──────────────────────────────────────┤
                    │  Collections:                        │
                    │  ├─ users                           │
                    │  │  ├─ username                     │
                    │  │  ├─ password (hashed)            │
                    │  │  ├─ email                        │
                    │  │  ├─ mobile                       │
                    │  │  └─ roles []                     │
                    │  │                                  │
                    │  ├─ roles                           │
                    │  │  ├─ ROLE_USER                    │
                    │  │  ├─ ROLE_ADMIN                   │
                    │  │  └─ ROLE_STAFF                   │
                    │  │                                  │
                    │  └─ audit_logs                      │
                    │     └─ login attempts, role changes │
                    │                                      │
                    └──────────────────────────────────────┘
```

---

## 2. Authentication Flow

```
                           USER ACTIONS
                                │
                    ┌───────────▼──────────────┐
                    │ Visit /login             │
                    │ Enter username/password │
                    │ Click "Login"            │
                    └───────────┬──────────────┘
                                │
                    ┌───────────▼──────────────┐
                    │ Login Component State    │
                    │ - username              │
                    │ - password              │
                    └───────────┬──────────────┘
                                │
                    ┌───────────▼─────────────────────────┐
                    │ Call: AuthContext.login()           │
                    │        (username, password)        │
                    └───────────┬─────────────────────────┘
                                │
                    ┌───────────▼──────────────────────────┐
                    │ Call: authService.login()            │
                    │ POST /api/v1/auth/login              │
                    │ {username, password}                 │
                    └───────────┬──────────────────────────┘
                                │
                    ┌───────────▼──────────────────────────┐
                    │ Axios Instance:                      │
                    │ - Add Content-Type header            │
                    │ - Send to backend                    │
                    └───────────┬──────────────────────────┘
                                │
                           NETWORK │
                                │
                    ┌───────────▼──────────────────────────┐
                    │ BACKEND /api/v1/auth/login           │
                    │ - Validate credentials               │
                    │ - Check user in database             │
                    └───────────┬──────┬───────────────────┘
                                │      │
                ┌───────────────┘      └───────────────┐
                │ INVALID                              │ VALID
    ┌───────────▼──────────────┐    ┌─────────────────▼────────────┐
    │ 401 Unauthorized         │    │ 200 OK                       │
    │ {error: "..."}           │    │ Response:                    │
    │                          │    │ {                            │
    └────────┬─────────────────┘    │   access_token: JWT,         │
             │                       │   refresh_token: JWT,        │
             │                       │   roles: ["ROLE_USER"],      │
             │                       │   username: "...",           │
             │                       │   email: "...",              │
             │                       │   mobile: "...",             │
             │                       │   message: "...",            │
             │                       │   error: ""                  │
             │                       │ }                            │
             │                       └─────────┬────────────────────┘
             │                                 │
             │                     ┌───────────▼──────────┐
             │                     │ AuthContext.login()  │
             │                     │ Processes Response   │
             │                     └───────────┬──────────┘
             │                                 │
             │         ┌───────────────────────▼────────────────────┐
             │         │ Store in localStorage:                     │
             │         │ - access_token: response.access_token      │
             │         │ - refresh_token: response.refresh_token    │
             │         │ - user_info: JSON.stringify({...})         │
             │         └───────────┬──────────────────────────────┘
             │                     │
             │         ┌───────────▼──────────────────────┐
             │         │ Check Number of Roles            │
             │         └────────┬──────────┬──────────────┘
             │                  │          │
     ┌──────▼─────────┐   Single Role     Multiple Roles
     │ Show Error      │   (1 role)       (2+ roles)
     │ Message         │   │              │
     │                 │   │              │
     │ setError(msg)   │   └──┬───────────┴──┐
     └─────────────────┘      │              │
                    ┌─────────▼────────┐  ┌──▼──────────────┐
                    │ Auto-select role │  │ Show Role       │
                    │ setSelectedRole()│  │ Selection Page  │
                    │ store in LocalSt │  │ User chooses    │
                    │ redirect to /db  │  │ 1 role to use   │
                    │                  │  │                 │
                    │ setIsAuthed(true)│  │ User clicks:    │
                    │ → Dashboard      │  │ "ADMIN" button  │
                    └──────────────────┘  │                 │
                                          │ setSelectedRole │
                                          │ redirect to /db │
                                          └─────────────────┘
                                                  │
                                          ┌───────▼─────────┐
                                          │ Dashboard Logic │
                                          │ if ROLE_ADMIN:  │
                                          │   → AdminDash   │
                                          │ else:           │
                                          │   → UserDash    │
                                          └─────────────────┘
```

---

## 3. Protected Route Flow

```
┌──────────────────────┐
│ Navigate to URL      │
│ /admin-dashboard     │
└──────────┬───────────┘
           │
    ┌──────▼──────────────────────┐
    │ ProtectedRoute Component     │
    │ checks: isAuthenticated?     │
    └──────┬─────────┬─────────────┘
           │         │
      NO  │         │ YES
    ┌─────▼─┐   ┌───▼──────────────────────┐
    │Redirect│   │ Check: requiredRole?    │
    │to Login│   └───┬────────────┬─────────┘
    └────────┘       │            │
              NO     │            │ YES
           ┌─────────┘            └──────┬───┐
           │                             │   │
    ┌──────▼──────────────┐    ┌─────────▼──▼──────────────┐
    │ Render component    │    │ selectedRole matches      │
    │ (no role required)  │    │ requiredRole?             │
    └─────────────────────┘    └─────┬──────────┬──────────┘
                                     │          │
                                   NO│          │YES
                          ┌──────────▼┐  ┌──────▼──────────┐
                          │Error Page:│  │Render Component │
                          │"Access    │  │(Full Access)    │
                          │Denied"    │  │                 │
                          │Required:  │  └─────────────────┘
                          │ROLE_ADMIN │
                          │Your Role: │
                          │ROLE_USER  │
                          └───────────┘
```

---

## 4. Token Refresh Flow

```
┌──────────────────────┐
│ API Request with     │
│ Authorization Header │
│ Bearer <token>       │
└──────────┬───────────┘
           │
    ┌──────▼────────────────┐
    │ Backend Validates JWT │
    │ Check exp claim       │
    └──────┬─────────┬──────┘
           │         │
        VALID      EXPIRED
           │         │
    ┌──────▼──┐  ┌───▼────────────────────────┐
    │200 OK   │  │ 401 Unauthorized           │
    │Response │  │ error: "Token expired"     │
    │sent     │  └───┬────────────────────────┘
    └─────────┘      │
                     │ Axios Response Interceptor
                     │ Catches 401 status
                     │
        ┌────────────▼──────────────┐
        │ Check: Already retried?   │
        │ (originalRequest._retry)  │
        └────────────┬───┬──────────┘
                     │   │
                 NO  │   │ YES
            ┌────────┘   └─────────┐
            │                      │
    ┌───────▼──────────────┐  ┌────▼──────────────┐
    │ Get refresh_token    │  │ Give up - reject  │
    │ from localStorage    │  │ logout + redirect │
    │                      │  │ to login          │
    └───────┬───┬──────────┘  └───────────────────┘
            │   │
        NULL│   │ EXISTS
      ┌─────▼┐ ┌──▼─────────────────────────┐
      │Logout │ │ POST /api/v1/auth/refresh │
      │logout │ │ {refresh_token: "..."}    │
      │give up│ └──┬────────────┬───────────┘
      └──────┘    │            │
                  │        FAILURE
            ┌─────▼──────────────────────┐
            │ GET 200 OK Response        │
            │ {                          │
            │   access_token: JWT,       │
            │   refresh_token: JWT,      │
            │   roles: [...]             │
            │ }                          │
            └─────┬──────────┬───────────┘
                  │          │
              ┌───▼──────────▼──┐
              │ localStorage:    │
              │ access_token     │
              │ refresh_token    │
              └───┬──────────────┘
                  │
         ┌────────▼──────────────┐
         │ Retry Original Request│
         │ with new AUTH header  │
         │ Authorization: Bearer │
         │ <new_access_token>    │
         └───┬──┬────────────────┘
             │  │
          SUCCESS
             │
         ┌───▼──────────┐
         │ Response     │
         │ from API     │
         └──────────────┘
```

---

## 5. Admin Dashboard Flow

```
┌────────────────────────────────┐
│ User has ROLE_ADMIN            │
│ Navigates to /admin-dashboard  │
└─────────────┬──────────────────┘
              │
      ┌───────▼──────────────┐
      │ ProtectedRoute       │
      │ checks auth & role ✓ │
      └───────┬──────────────┘
              │
      ┌───────▼────────────────────────┐
      │ AdminDashboard Component Mounts │
      │ useEffect() → fetchAllUsers()   │
      └───────┬────────────┬────────────┘
              │            │
        START │            │ LOADING
              │            │
     ┌────────▼──────────────────────┐
     │ Call: authService.getAllUsers()
     │ GET /api/v1/admin/allUser      │
     │ Headers: Authorization: Bearer │
     └────┬──────────────┬────────────┘
          │              │
       SUCCESS         ERROR
          │              │
    ┌─────▼────────┐  ┌──▼───────────────┐
    │ Response:    │  │ setError(msg)     │
    │  {           │  │ Show error to user│
    │   users: [{  │  └───────────────────┘
    │    username  │
    │    email     │
    │    mobile    │
    │    roles:[]  │
    │   }, ...]    │
    │  }           │
    └─────┬────────┘
          │
     ┌────▼──────────────────────┐
     │ setUsers(response.users)   │
     │ Display in table:          │
     │ - Username                 │
     │ - Email                    │
     │ - Mobile                   │
     │ - Roles (as tags)          │
     └─────┬─────────────────────┘
           │
     ┌─────▼──────────────────────────┐
     │ USER: Add Role to User          │
     │ - Enter username               │
     │ - Select role from dropdown    │
     │ - Click "Add Role" button      │
     └─────┬──────────────┬───────────┘
           │              │
       SUBMIT            LOADING
           │              │
     ┌─────▼──────────────────────┐
     │ Call:                      │
     │ authService.addRoleToUser( │
     │   username, role)          │
     │ POST /api/v1/admin/addRole │
     │ {username, role}           │
     └─────┬──────────┬────────────┘
           │          │
        SUCCESS     ERROR
           │          │
    ┌──────▼────┐ ┌───▼─────────────┐
    │ Success   │ │ Error Message   │
    │ Message   │ │ "User not found"│
    │           │ │ Show to admin   │
    │ Refresh   │ └─────────────────┘
    │ User List │
    │ Reset     │
    │ Form      │
    └───────────┘
```

---

## 6. Component Hierarchy

```
App
│
├── Router
│   │
│   └── AuthProvider
│       │
│       ├── Routes Configuration
│       │   │
│       │   ├── <Route path="/login" element={<Login />} />
│       │   ├── <Route path="/register" element={<Register />} />
│       │   │
│       │   ├── <Route path="/role-select">
│       │   │   <ProtectedRoute>
│       │   │     <RoleSelect />
│       │   │   </ProtectedRoute>
│       │   │ </Route>
│       │   │
│       │   ├── <Route path="/dashboard">
│       │   │   <ProtectedRoute>
│       │   │     <Dashboard /> (redirects based on role)
│       │   │   </ProtectedRoute>
│       │   │ </Route>
│       │   │
│       │   ├── <Route path="/user-dashboard">
│       │   │   <ProtectedRoute requiredRole="ROLE_USER">
│       │   │     <UserDashboard />
│       │   │   </ProtectedRoute>
│       │   │ </Route>
│       │   │
│       │   └── <Route path="/admin-dashboard">
│       │       <ProtectedRoute requiredRole="ROLE_ADMIN">
│       │         <AdminDashboard />
│       │       </ProtectedRoute>
│       │     </Route>
│       │
│       └── Global State:
│           - user
│           - selectedRole
│           - isAuthenticated
│           - Functions: login, logout, selectRole
```

---

## 7. Data Flow: Complete Login Cycle

```
┌─────────────────────────────────────────────────────────────┐
│                    STEP-BY-STEP FLOW                         │
├─────────────────────────────────────────────────────────────┤

STEP 1: User enters credentials in Login form
┌─────────────────────────────────────────────┐
│ setUsername("john_doe")                     │
│ setPassword("password123")                  │
│ On form submit:                             │
│   onClick → handleSubmit()                  │
└─────────────────────────────────────────────┘
                        │
STEP 2: Call AuthContext.login()
┌─────────────────────────────────────────────┐
│ const { login } = useAuth()                 │
│ const result = await login(username, pwd)   │
└─────────────────────────────────────────────┘
                        │
STEP 3: AuthContext calls authService.login()
┌─────────────────────────────────────────────┐
│ try {                                       │
│   const res = await authService.login(...) │
│   return res.data                           │
│ } catch (err) {                             │
│   throw Error                               │
│ }                                           │
└─────────────────────────────────────────────┘
                        │
STEP 4: authService makes API call
┌─────────────────────────────────────────────┐
│ const response = await api.post(            │
│   '/api/v1/auth/login',                     │
│   { username, password }                    │
│ )                                           │
└─────────────────────────────────────────────┘
                        │
STEP 5: Request Interceptor adds header
┌─────────────────────────────────────────────┐
│ config.headers.Authorization =              │
│   `Bearer ${token}`                         │
│ (Note: token null on first login)           │
└─────────────────────────────────────────────┘
                        │
STEP 6: Network request sent to backend
┌─────────────────────────────────────────────┐
│ POST http://localhost:8080/api/v1/auth/login
│ Headers: {                                  │
│   "Content-Type": "application/json"        │
│ }                                           │
│ Body: {                                     │
│   "username": "john_doe",                   │
│   "password": "password123"                 │
│ }                                           │
└─────────────────────────────────────────────┘
                        │
STEP 7: Backend validates and responds
┌─────────────────────────────────────────────┐
│ 200 OK Response:                            │
│ {                                           │
│   "access_token": "eyJhbGc...",             │
│   "refresh_token": "eyJhbGc...",            │
│   "roles": ["ROLE_USER"],                   │
│   "username": "john_doe",                   │
│   "email": "john@example.com",              │
│   "mobile": "+1234567890",                  │
│   "message": "Login successful",            │
│   "error": ""                               │
│ }                                           │
└─────────────────────────────────────────────┘
                        │
STEP 8: Response Interceptor processes
┌─────────────────────────────────────────────┐
│ Status is 200 (not 401)                     │
│ Return response directly                    │
└─────────────────────────────────────────────┘
                        │
STEP 9: authService returns response
┌─────────────────────────────────────────────┐
│ return response.data                        │
└─────────────────────────────────────────────┘
                        │
STEP 10: AuthContext.login() processes response
┌─────────────────────────────────────────────┐
│ localStorage.setItem('access_token', ...)   │
│ localStorage.setItem('refresh_token', ...)  │
│ localStorage.setItem('user_info', ...)      │
│ setUser({...})                              │
│                                             │
│ Check roles.length:                         │
│   if 1: setSelectedRole(), navigate to /db  │
│   if >1: return roles, navigate to /role-sel
└─────────────────────────────────────────────┘
                        │
STEP 11: Login component receives result
┌─────────────────────────────────────────────┐
│ if (result.success) {                       │
│   if (result.requiresRoleSelection) {       │
│     navigate('/role-select', state)         │
│   } else {                                  │
│     navigate('/dashboard')                  │
│   }                                         │
│ }                                           │
└─────────────────────────────────────────────┘
                        │
STEP 12: Navigation and dashboard display
┌─────────────────────────────────────────────┐
│ Browser navigates to /dashboard             │
│ ProtectedRoute checks isAuthenticated ✓     │
│ Dashboard component mounts                  │
│ useAuth() hook returns:                     │
│   user: {...}                               │
│   selectedRole: "ROLE_USER"                 │
│   isAuthenticated: true                     │
│                                             │
│ Display user info in dashboard              │
└─────────────────────────────────────────────┘

✅ LOGIN COMPLETE!
```

---

## 8. Error Handling Flow

```
API Request Fails
        │
        ├─ Network Error
        │  └─ No connection to backend
        │     └─ Axios error
        │        └─ Show error message
        │
        ├─ 400 Bad Request
        │  └─ Invalid input
        │     └─ Server returns error
        │        └─ Show error to user
        │
        ├─ 401 Unauthorized
        │  ├─ Invalid credentials
        │  │  └─ Show "Invalid username/password"
        │  └─ Token expired
        │     └─ Response Interceptor
        │        ├─ Try refresh token
        │        ├─ Success: Retry request
        │        └─ Failed: Logout + redirect
        │
        ├─ 403 Forbidden
        │  └─ User lacks permission
        │     └─ ProtectedRoute denies access
        │        └─ Show "Access Denied"
        │
        └─ 500 Server Error
           └─ Backend error
              └─ Show error message
```

---

## 9. State Management Overview

```
GLOBAL STATE (AuthContext)
│
├── User Data
│   ├── user.username
│   ├── user.email
│   ├── user.mobile
│   └── user.roles []
│
├── Authentication State
│   ├── selectedRole
│   ├── isAuthenticated
│   ├── loading
│   └── error
│
├── Methods
│   ├── login(username, password)
│   ├── register(username, password, email, mobile)
│   ├── selectRole(role)
│   └── logout()
│
└── Storage
    ├── localStorage.access_token
    ├── localStorage.refresh_token
    ├── localStorage.selected_role
    └── localStorage.user_info

LOCAL STATE (Component-level)
│
├── Login Component
│   ├── username
│   ├── password
│   └── loading
│
├── Register Component
│   ├── username
│   ├── email
│   ├── mobile
│   ├── password
│   └── loading
│
├── AdminDashboard Component
│   ├── users []
│   ├── newRoleUsername
│   ├── newRole
│   └── loading

API RESPONSES (Dynamic)
│
├── Login Response
│   ├── access_token
│   ├── refresh_token
│   ├── roles
│   └── user info
│
└── API Request Data
    ├── Sent with Authorization header
    ├── Intercepted automatically
    └── Refreshed on 401
```

---

This architecture ensures:
- ✅ Clean separation of concerns
- ✅ Reusable components
- ✅ Global state management
- ✅ Automatic token handling
- ✅ Secure authentication
- ✅ Role-based authorization
