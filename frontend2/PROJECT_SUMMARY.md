# 🏥 Hospital Management System - React Frontend

## Project Complete ✅

A **production-ready React frontend** with JWT authentication and role-based authorization for a Hospital Management System.

---

## 📊 What's Included

### ✅ Complete React Application
- **5 Pages**: Login, Register, Role Selection, User Dashboard, Admin Dashboard
- **3 Components**: ProtectedRoute, Forms, Tables
- **Services**: API service with Axios interceptors
- **State Management**: React Context API
- **Routing**: React Router v6

### ✅ Authentication System
- JWT token-based authentication
- Access token + Refresh token
- Automatic token refresh on expiration
- Secure logout

### ✅ Authorization
- Role-based access control (RBAC)
- Role selection for multi-role users
- Protected routes
- Admin-only endpoints

### ✅ Features
- User registration
- User login
- Role management (Admin only)
- User management (Admin only)
- Session persistence
- Error handling
- Loading states
- Responsive UI

### ✅ Documentation
- **README.md** - Full documentation
- **QUICK_START.md** - 5-minute setup guide
- **IMPLEMENTATION_GUIDE.md** - Architecture & flows
- **BACKEND_INTEGRATION.md** - API requirements
- **TESTING_GUIDE.md** - Complete test cases

---

## 🚀 Quick Start (5 minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Backend URL
Create `.env` file:
```
REACT_APP_API_URL=http://localhost:8080
```

### Step 3: Start Frontend
```bash
npm start
```

App opens at `http://localhost:3000`

### Step 4: Test It!
1. Register new user
2. Login
3. Select role (if multiple)
4. View dashboard

---

## 📁 Project Structure

```
frontend2/
│
├── 📄 package.json           # Dependencies & scripts
├── 📄 .env.example           # Environment template
├── 📄 .gitignore             # Git ignore rules
│
├── 📁 public/
│   └── index.html            # HTML entry point
│
├── 📁 src/
│   ├── App.js                # Main app with routing
│   ├── App.css
│   ├── index.js              # React entry point
│   ├── index.css
│   │
│   ├── 📁 services/          # API & business logic
│   │   ├── api.js            # Axios with interceptors ⭐
│   │   └── authService.js    # Auth API calls ⭐
│   │
│   ├── 📁 context/           # State management
│   │   └── AuthContext.js    # Auth context & hook ⭐
│   │
│   ├── 📁 components/        # Reusable components
│   │   └── ProtectedRoute.js # Route protection ⭐
│   │
│   ├── 📁 pages/             # Page components
│   │   ├── Login.js          # Login page
│   │   ├── Register.js       # Register page
│   │   ├── RoleSelect.js     # Role selection
│   │   ├── UserDashboard.js  # User dashboard
│   │   └── AdminDashboard.js # Admin dashboard
│   │
│   └── 📁 styles/            # CSS files
│       ├── Auth.css          # Auth pages styling
│       └── Dashboard.css     # Dashboard styling
│
└── 📚 Documentation/
    ├── README.md             # Full documentation
    ├── QUICK_START.md        # Quick setup guide
    ├── IMPLEMENTATION_GUIDE.md
    ├── BACKEND_INTEGRATION.md
    └── TESTING_GUIDE.md
```

---

## 🔐 Authentication Flow

```
User Credentials
    ↓
[Login Page]
    ↓
authService.login()
    ↓
POST /api/v1/auth/login
    ↓
Backend validates → Returns tokens
    ↓
localStorage stores tokens
    ↓
Check roles:
├─ Multiple roles → [Role Selection]
└─ Single role → Auto-select
    ↓
[Dashboard]
```

---

## 🎯 Key Features

### 1. User Registration
- Fill username, email, mobile, password
- Backend creates user with ROLE_USER
- Redirect to login after success

### 2. User Login
- Enter username and password
- Get access & refresh tokens
- Multiple roles? Choose one
- Single role? Auto-proceed
- Stored in localStorage

### 3. Role Selection
- If user has multiple roles
- Beautiful button-based selection
- Selected role stored
- Redirect to appropriate dashboard

### 4. User Dashboard
- View user profile
- See all assigned roles
- Quick stats display
- Logout button

### 5. Admin Dashboard
- View all users (table)
- Add roles to users (form)
- User management
- Admin-only access

### 6. Auto Token Refresh
- Access token expires?
- Automatically refresh
- Retry failed request
- Seamless experience

### 7. Protected Routes
- Can't access without login
- Can't access without role
- Automatic redirects
- Error messages

---

## 📡 API Endpoints (Backend Required)

### Authentication
```
POST   /api/v1/auth/login      - User login
POST   /api/v1/auth/register   - New user registration
POST   /api/v1/auth/refresh    - Refresh access token
```

### Admin
```
GET    /api/v1/admin/allUser   - Get all users (ROLE_ADMIN)
POST   /api/v1/admin/addRole   - Add role to user (ROLE_ADMIN)
```

---

## 🛡️ Axios Interceptor Magic ✨

### Request Interceptor
Automatically adds:
```javascript
Authorization: Bearer <access_token>
```

### Response Interceptor
Auto-handles:
- 401 → Refresh token
- Token expired → Automatic retry
- Refresh fails → Logout & redirect

**No manual token management needed!** 🎉

---

## 🎨 Component Architecture

```
App (Routes)
  │
  ├── AuthProvider
  │   │
  │   ├── Login
  │   ├── Register
  │   ├── RoleSelect
  │   │
  │   └── ProtectedRoute
  │       ├── UserDashboard
  │       └── AdminDashboard
```

---

## 🔧 Configuration

### Environment Variables
```
REACT_APP_API_URL=http://localhost:8080
```

Override in:
- `.env` - Development
- `.env.local` - Local overrides
- `.env.production` - Production

### Backend CORS Setup (Required)
```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                   .allowedOrigins("http://localhost:3000")
                   .allowedMethods("*")
                   .allowedHeaders("*")
                   .allowCredentials(true);
            }
        };
    }
}
```

---

## 📦 Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "axios": "^1.6.0",
  "react-scripts": "5.0.1"
}
```

Install all:
```bash
npm install
```

---

## 🧪 Testing

### Quick Test
1. Register: `testuser` / `Test@12345`
2. Login with credentials
3. See dashboard
4. Logout

### Comprehensive Testing
See **TESTING_GUIDE.md** for:
- 10 test categories
- 50+ test cases
- Step-by-step procedures
- Expected results
- Debugging tips

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| **README.md** | Complete feature documentation |
| **QUICK_START.md** | Fast 5-minute setup |
| **IMPLEMENTATION_GUIDE.md** | Architecture & data flows |
| **BACKEND_INTEGRATION.md** | API requirements & responses |
| **TESTING_GUIDE.md** | Comprehensive test cases |

---

## 🎯 Use Cases

### Use Case 1: Patient Login
1. Patient registers
2. Gets ROLE_USER
3. Views personal dashboard
4. Sees appointments, prescriptions, etc.

### Use Case 2: Doctor/Staff
1. Staff member registers
2. Admin assigns ROLE_STAFF
3. Staff logs in, selects ROLE_STAFF
4. Accesses treatment interfaces

### Use Case 3: Administrator
1. Admin registers
2. Gets ROLE_ADMIN
3. Logs in, selects ROLE_ADMIN
4. Manages users and roles

### Use Case 4: Multi-Role User
1. Doctor who is also Admin
2. Has ROLE_DOCTOR + ROLE_ADMIN
3. Logs in, chooses which role to use
4. Access appropriate features

---

## 🚨 Common Issues & Solutions

### Issue: Cannot connect to backend
**Check:**
- Is backend running? `curl http://localhost:8080`
- Is `.env` configured correctly?
- Are ports correct? (Frontend: 3000, Backend: 8080)

### Issue: CORS error in console
**Fix (Backend):**
```java
@Bean
public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/**")
                .allowedOrigins("*")
                .allowedMethods("*");
        }
    };
}
```

### Issue: Token not refreshing
**Check:**
- Is `/api/v1/auth/refresh` endpoint working?
- Is refresh_token in localStorage?
- Check backend logs

### Issue: Blank page after login
**Debug:**
```javascript
console.log(localStorage.getItem('user_info'))
console.log(localStorage.getItem('selected_role'))
```

---

## 🎓 Learning Resources

### Concepts Used
- **React 18** - Component-based UI
- **React Hooks** - useState, useContext, useEffect
- **Context API** - Global state management
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **JWT** - Token-based auth
- **CSS** - Styling

### Study Materials
- [React Docs](https://react.dev)
- [React Router](https://reactrouter.com)
- [Axios Docs](https://axios-http.com)
- [JWT.io](https://jwt.io)

---

## 🚀 Production Ready

### What's Production-Ready
✅ Clean, maintainable code  
✅ Error handling  
✅ Loading states  
✅ Security best practices  
✅ Responsive design  
✅ Environment configuration  
✅ Comprehensive docs  

### Before Going Live
- [ ] Test all features
- [ ] Use HTTPS
- [ ] Set production API URL
- [ ] Build: `npm run build`
- [ ] Set secure token expiration
- [ ] Configure CORS properly
- [ ] Monitor API usage
- [ ] Enable CSRF protection

---

## 📈 Scalability Tips

### Current Implementation
- Single-page application (SPA)
- Client-side routing
- Context API for state

### Future Enhancements
- Redux for complex state (if needed)
- Code splitting with React.lazy()
- Service Worker for offline support
- Server-side rendering (Next.js)
- GraphQL instead of REST

---

## 🤝 Integration Checklist

- [ ] Backend running and accessible
- [ ] CORS enabled on backend
- [ ] Endpoints created:
  - [ ] POST /api/v1/auth/login
  - [ ] POST /api/v1/auth/register
  - [ ] POST /api/v1/auth/refresh
  - [ ] GET /api/v1/admin/allUser
  - [ ] POST /api/v1/admin/addRole
- [ ] JWT tokens generated correctly
- [ ] Roles returned in response
- [ ] Refresh token working
- [ ] Database populated with test users

---

## 📞 Support Resources

### Documentation
- README.md - Features & API reference
- IMPLEMENTATION_GUIDE.md - Architecture details
- BACKEND_INTEGRATION.md - API requirements
- TESTING_GUIDE.md - Test procedures

### Debugging
1. Check browser console (F12)
2. Check Network tab for API calls
3. Inspect localStorage
4. Check backend logs
5. Verify environment config

### Common Commands
```bash
npm install      # Install dependencies
npm start        # Start dev server
npm run build    # Build for production
npm test         # Run tests
```

---

## 📝 Version Info

- **React**: 18.2.0
- **React Router**: 6.20.0
- **Axios**: 1.6.0
- **Node**: 14+ recommended
- **npm**: 6+ recommended

---

## ✨ Highlights

🎯 **Zero-Config Setup** - Just `npm install` and go  
🔒 **Security First** - JWT tokens, secure headers  
⚡ **Auto Token Refresh** - No manual token management  
🎨 **Beautiful UI** - Gradient design, responsive  
📱 **Mobile Friendly** - Works on all devices  
🔄 **State Management** - Clean Context API setup  
🧪 **Well Documented** - 5 comprehensive guides  
🚀 **Production Ready** - Best practices included  

---

## 🎉 You're All Set!

Your Hospital Management System frontend is ready to use!

### Next Steps
1. ✅ Install dependencies: `npm install`
2. ✅ Configure backend URL in `.env`
3. ✅ Start frontend: `npm start`
4. ✅ Test registration & login
5. ✅ Explore admin features
6. ✅ Deploy to production

---

## 📚 Quick Reference

### File Purposes
- **api.js** - Axios setup with interceptors
- **authService.js** - API call wrappers
- **AuthContext.js** - State management hook
- **ProtectedRoute.js** - Route security
- **App.js** - Route configuration

### To Add Features
1. Create component in `src/pages/`
2. Create route in `App.js`
3. Use `useAuth()` hook for auth state
4. Call `authService.*()` for API

### To Debug
1. Check browser console
2. Check Network tab
3. Inspect localStorage
4. Check backend logs

---

## Happy Coding! 🚀

For detailed information, see:
- **README.md** - Full documentation
- **QUICK_START.md** - Quick setup
- **IMPLEMENTATION_GUIDE.md** - Deep dive
- **TESTING_GUIDE.md** - Test procedures

---

**Built with ❤️ for Healthcare Management**
