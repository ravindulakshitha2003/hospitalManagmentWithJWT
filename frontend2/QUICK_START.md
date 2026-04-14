# Quick Start Guide

## 5-Minute Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment
```bash
cp .env.example .env
```

Make sure `.env` has:
```
REACT_APP_API_URL=http://localhost:8080
```

### Step 3: Start Backend
Ensure your Spring Boot backend is running on `http://localhost:8080`

### Step 4: Start Frontend
```bash
npm start
```

App opens at `http://localhost:3000` ✅

---

## Test the Application

### 1. Register a New User
1. Click "Register here" on login page
2. Fill in the form:
   - Username: `testuser`
   - Email: `test@example.com`
   - Mobile: `1234567890`
   - Password: `Test@123`
3. Click "Register"
4. Should see success message

### 2. Login
1. Go to `/login` or click "Login here"
2. Enter credentials:
   - Username: `testuser`
   - Password: `Test@123`
3. Click "Login"
4. Experience:
   - **Single role** → Redirects to dashboard
   - **Multiple roles** → Shows role selection page

### 3. User Dashboard
- See user profile information
- View all assigned roles
- Quick stats display
- Logout button in navbar

### 4. Admin Features
1. Need ROLE_ADMIN to access admin dashboard
2. If you have admin role:
   - View all users in table
   - Add new roles to users
   - See user details (email, mobile, roles)

---

## Project Structure Navigation

```
src/
├── services/
│   ├── api.js              ← Axios + Interceptors
│   └── authService.js      ← API calls
├── context/
│   └── AuthContext.js      ← State management
├── components/
│   └── ProtectedRoute.js   ← Route protection
├── pages/
│   ├── Login.js           ← Login page
│   ├── Register.js        ← Register page
│   ├── RoleSelect.js      ← Role selection
│   ├── UserDashboard.js   ← User view
│   └── AdminDashboard.js  ← Admin view
├── styles/
│   ├── Auth.css
│   └── Dashboard.css
└── App.js                  ← Main routing
```

---

## Key Features to Test

### ✅ JWT Authentication
- [ ] Login creates tokens
- [ ] Tokens stored in localStorage
- [ ] Token sent in Authorization header

### ✅ Role Selection
- [ ] Multiple roles show selection page
- [ ] Single role auto-selects
- [ ] Selected role stored and retrieved

### ✅ Role-Based Access
- [ ] Admin can access admin dashboard
- [ ] Non-admin cannot access admin dashboard
- [ ] Shows "Access Denied" error

### ✅ Auto Token Refresh
- [ ] Set breakpoint at token refresh
- [ ] Wait for access token to expire
- [ ] Auto refresh should happen
- [ ] Request should retry automatically

### ✅ Protected Routes
- [ ] Cannot access /admin-dashboard without ROLE_ADMIN
- [ ] Can access /user-dashboard with ROLE_USER
- [ ] Redirects work correctly

---

## Common Testing Scenarios

### Scenario 1: New User Journey
```
1. Register new account
2. Login
3. View user dashboard
4. Logout
```

### Scenario 2: Admin User Journey
```
1. Login as admin
2. Choose ROLE_ADMIN from role selection
3. Access admin dashboard
4. View all users
5. Add role to a user
6. Verify user roles updated
7. Logout
```

### Scenario 3: Multi-Role User
```
1. Login with user having 2+ roles
2. See role selection page
3. Select ROLE_USER
4. View user dashboard
5. Logout and login again
6. Select ROLE_ADMIN (if available)
7. View admin dashboard
```

---

## Debugging Tips

### Check localStorage
```javascript
// In browser console:
console.log(JSON.parse(localStorage.getItem('user_info')));
console.log(localStorage.getItem('selected_role'));
console.log(localStorage.getItem('access_token'));
```

### Monitor Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Login and see requests:
   - POST /api/v1/auth/login
   - Check Authorization header
   - Verify response tokens

### Check Auth State
```javascript
// In React DevTools:
// You can inspect AuthContext state directly
```

### Test Token Expiration
1. Set a very short expiration on backend (1 minute)
2. Login
3. Wait 1+ minute
4. Make API request
5. Should auto-refresh token

---

## Deployment Checklist

- [ ] Backend running and accessible
- [ ] CORS enabled on backend
- [ ] `.env` updated with production API URL
- [ ] `npm run build` passes
- [ ] All routes tested
- [ ] Login/logout works
- [ ] Token refresh works
- [ ] Admin features work
- [ ] No console errors
- [ ] localStorage working
- [ ] Production URL configured

---

## Troubleshooting

### "Cannot find module" error
```bash
rm -rf node_modules
npm install
npm start
```

### CORS errors
- Check backend CORS configuration
- Ensure `http://localhost:3000` is allowed

### 404 on /api routes
- Verify backend is running
- Check API URL in `.env`
- Ensure endpoints exist in backend

### Blank page after login
- Check browser console for errors
- Verify user info stored in localStorage
- Check if token is being sent

### Token not refreshing
- Verify `/api/v1/auth/refresh` endpoint exists
- Check refresh_token is stored
- Look for interceptor errors in console

---

## Environment Variables

Create `.env` file:
```bash
# Backend API URL
REACT_APP_API_URL=http://localhost:8080

# Optional: for different environments
# REACT_APP_ENV=development
# REACT_APP_DEBUG=true
```

Load environment:
```javascript
const apiUrl = process.env.REACT_APP_API_URL;
```

---

## API Response Expectations

### Successful Login
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "roles": ["ROLE_ADMIN"],
  "message": "Login successful",
  "error": ""
}
```

### Multiple Roles (Example)
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "roles": ["ROLE_USER", "ROLE_ADMIN", "ROLE_STAFF"],
  "message": "Login successful",
  "error": ""
}
```

### Error Response
```json
{
  "error": "Invalid credentials",
  "message": "",
  "access_token": null,
  "refresh_token": null
}
```

---

## Next Steps

1. ✅ Get backend running
2. ✅ Test registration endpoint
3. ✅ Test login endpoint  
4. ✅ Test admin endpoints
5. ✅ Test token refresh
6. ✅ Deploy frontend
7. ✅ Configure production API URL

---

## Quick Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Test the app
npm test

# Eject (not recommended)
npm eject
```

---

## Need Help?

Check these files:
- **README.md** - Full documentation
- **IMPLEMENTATION_GUIDE.md** - Architecture & flow
- **src/context/AuthContext.js** - State management logic
- **src/services/api.js** - Axios interceptor setup
- **src/App.js** - Route configuration

Happy coding! 🚀
