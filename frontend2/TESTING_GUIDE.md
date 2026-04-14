# Testing Guide

Complete guide to test all features of the Hospital Management System frontend.

## Test Environment Setup

### Prerequisites
- Node.js installed: `node --version`
- npm installed: `npm --version`
- Backend running: `http://localhost:8080`
- Frontend running: `http://localhost:3000`

### Verify Setup
```bash
# Check backend
curl http://localhost:8080/api/v1/auth/login

# Check frontend
npm start  # Should open http://localhost:3000
```

---

## Test Cases

### 1. Registration Flow

#### Test 1.1: Valid Registration
**Steps:**
1. Navigate to `http://localhost:3000/register`
2. Enter:
   - Username: `testuser1`
   - Email: `test1@example.com`
   - Mobile: `1234567890`
   - Password: `Test@12345`
3. Click "Register"

**Expected Result:**
✅ Success message appears  
✅ Redirects to login page after 2 seconds  
✅ Can login with new credentials  

**Verify:**
```javascript
// In console, after registration
localStorage.getItem('access_token')  // Should be null
localStorage.getItem('user_info')     // Should be null
```

#### Test 1.2: Invalid Email
**Steps:**
1. Register with Email: `invalidemail`
2. Click "Register"

**Expected Result:**
❌ Error message (backend validation)

#### Test 1.3: Duplicate Username
**Steps:**
1. Register user A with username: `duplicate`
2. Try to register user B with same username
3. Click "Register"

**Expected Result:**
❌ Error message: "Username already exists"

#### Test 1.4: Empty Fields
**Steps:**
1. Leave any field empty
2. Click "Register"

**Expected Result:**
❌ HTML5 validation: "Please fill in this field"

---

### 2. Login Flow

#### Test 2.1: Valid Single Role Login
**Prerequisites:**
- User exists with single role: ROLE_USER

**Steps:**
1. Navigate to `http://localhost:3000/login`
2. Enter credentials
3. Click "Login"

**Expected Result:**
✅ Redirect to `/dashboard`  
✅ `access_token` in localStorage  
✅ `refresh_token` in localStorage  
✅ `selected_role` = "ROLE_USER"  
✅ Shows UserDashboard  

**Verify in Console:**
```javascript
localStorage.getItem('access_token')     // JWT token
localStorage.getItem('refresh_token')    // JWT token
localStorage.getItem('selected_role')    // "ROLE_USER"
JSON.parse(localStorage.getItem('user_info')).username
```

#### Test 2.2: Valid Multi-Role Login
**Prerequisites:**
- User exists with roles: ["ROLE_USER", "ROLE_ADMIN"]

**Steps:**
1. Login with multi-role user
2. Click "Login"

**Expected Result:**
✅ Redirect to `/role-select`  
✅ Shows buttons: "USER", "ADMIN", "STAFF"  
✅ Can select a role  

**Verify:**
```javascript
localStorage.getItem('selected_role')  // null initially
// After selecting role
localStorage.getItem('selected_role')  // "ROLE_ADMIN"
```

#### Test 2.3: Invalid Credentials
**Steps:**
1. Enter wrong username or password
2. Click "Login"

**Expected Result:**
❌ Error message displayed  
❌ No redirect  
❌ localStorage empty  

#### Test 2.4: Empty Credentials
**Steps:**
1. Don't enter username and password
2. Click "Login"

**Expected Result:**
❌ HTML5 validation: "Please fill in this field"

#### Test 2.5: Username/Email Case Sensitivity
**Steps:**
1. Register with: `userName123`
2. Try login with: `username123`
3. Check if login works

**Expected Result:**
⚠️ Depends on backend implementation

---

### 3. Role Selection Flow

#### Test 3.1: Role Selection
**Prerequisites:**
- User has roles: ["ROLE_USER", "ROLE_ADMIN", "ROLE_STAFF"]

**Steps:**
1. Login → Role selection page appears
2. Click on "ADMIN" button
3. Verify redirect

**Expected Result:**
✅ Selected role stored in localStorage  
✅ Redirect to `/admin-dashboard`  
✅ AdminDashboard shows "Role: ADMIN"  

**Verify:**
```javascript
localStorage.getItem('selected_role')  // "ROLE_ADMIN"
```

#### Test 3.2: Switch Roles (Logout & Login)
**Steps:**
1. Login and select "USER"
2. Go to UserDashboard
3. Logout
4. Login again
5. Select "ADMIN"
6. Go to AdminDashboard

**Expected Result:**
✅ Both dashboards accessible  
✅ Correct role shown in each  
✅ Permissions enforced  

---

### 4. User Dashboard

#### Test 4.1: Display User Information
**Steps:**
1. Login as regular user
2. Redirect to UserDashboard
3. Verify information displayed

**Expected Result:**
✅ Username displayed  
✅ Email displayed  
✅ Mobile displayed  
✅ Current role badge shown  
✅ List of all roles shown  
✅ Stats displayed (0 values are OK)  

**Check Elements:**
```javascript
// In DevTools Elements tab
// Should see:
// - <p>{username}</p>
// - <p>{email}</p>
// - <p>{mobile}</p>
// - <span class="role-badge">{role}</span>
```

#### Test 4.2: Logout
**Steps:**
1. On UserDashboard
2. Click "Logout" button

**Expected Result:**
✅ localStorage cleared  
✅ Redirect to `/login`  
✅ Cannot access `/dashboard` without login  

**Verify:**
```javascript
localStorage.getItem('access_token')   // null
localStorage.getItem('selected_role')  // null
localStorage.getItem('user_info')      // null
```

#### Test 4.3: Session Persistence
**Steps:**
1. Login successfully
2. Refresh page (F5)
3. Should still be logged in

**Expected Result:**
✅ Page reloads and shows dashboard  
✅ User info still displayed  
✅ No redirect to login  

**Verify:**
```javascript
// After refresh, in console:
localStorage.getItem('access_token')   // Still present
// Should see user dashboard immediately
```

---

### 5. Admin Dashboard

#### Test 5.1: Access Admin Dashboard
**Prerequisites:**
- User has ROLE_ADMIN

**Steps:**
1. Login with admin user
2. Select ROLE_ADMIN
3. Should redirect to admin dashboard

**Expected Result:**
✅ Redirect to `/admin-dashboard`  
✅ See "Admin Dashboard" title  
✅ See admin features  

#### Test 5.2: View All Users
**Steps:**
1. On Admin Dashboard
2. Scroll to "All Users" section
3. Verify table displays

**Expected Result:**
✅ Table with columns: Username, Email, Mobile, Roles  
✅ All users from database displayed  
✅ Each user's roles shown as tags  

**Check:**
```javascript
// Table should have:
// - thead with 4 columns
// - tbody with user rows
// - Each role as colored tag
```

#### Test 5.3: Add Role to User
**Steps:**
1. On Admin Dashboard
2. In "Add Role to User" form:
   - Username: `testuser1`
   - Select Role: `ROLE_STAFF`
3. Click "Add Role"

**Expected Result:**
✅ Success message appears  
✅ User's roles updated in table  
✅ Form cleared  

**Verify:**
```javascript
// Check if user now has ROLE_STAFF
// Scroll in users table and confirm
```

#### Test 5.4: Add Role to Non-Existent User
**Steps:**
1. On Admin Dashboard
2. Username: `nonexistentuser`
3. Role: `ROLE_USER`
4. Click "Add Role"

**Expected Result:**
❌ Error message: "User not found" or similar  

#### Test 5.5: Add Duplicate Role
**Steps:**
1. User already has ROLE_ADMIN
2. Try to add ROLE_ADMIN again
3. Click "Add Role"

**Expected Result:**
⚠️ Depends on backend (could succeed/fail)  
✅ Table should update correctly  

---

### 6. Protected Routes

#### Test 6.1: Cannot Access Admin Without Permission
**Steps:**
1. Login as regular ROLE_USER
2. Try to manually navigate to `/admin-dashboard`

**Expected Result:**
❌ Error message: "Access Denied"  
❌ Shows required vs. actual role  
❌ Cannot see admin content  

#### Test 6.2: Cannot Access User Dashboard Without Auth
**Steps:**
1. Logout or don't login
2. Try to navigate to `/user-dashboard`

**Expected Result:**
❌ Redirect to `/login`  
❌ Cannot see dashboard  

#### Test 6.3: Protected Routes After Logout
**Steps:**
1. Login successfully
2. Note a protected URL: `/dashboard`
3. Logout
4. Navigate back to that URL

**Expected Result:**
❌ Redirect to `/login`  
❌ Cannot access protected page  

---

### 7. Token Refresh

#### Test 7.1: Automatic Token Refresh
**Setup:**
- Need to set very short token expiration (1 minute)

**Steps:**
1. Login successfully
2. In DevTools, go to Application tab
3. Note current `access_token` value
4. Wait for token to expire (check exp claim)
5. Make any API call (e.g., navigate)

**Expected:**
✅ Network tab shows POST to `/api/v1/auth/refresh`  
✅ New tokens received  
✅ Original request retried with new token  

**Verify in Network Tab:**
```
POST /api/v1/auth/refresh - 200 OK
(see response with new tokens)

GET /api/v1/admin/allUser - 200 OK
(retried with new token)
```

#### Test 7.2: Refresh Token Expired
**Setup:**
- Both tokens expired

**Steps:**
1. Force token expiration (manual localStorage edit)
2. Make API call that requires auth
3. Refresh also fails

**Expected Result:**
✅ Redirect to `/login`  
✅ localStorage cleared  

---

### 8. API Error Handling

#### Test 8.1: Network Error
**Steps:**
1. Stop backend server
2. Click logout (or make any API request)
3. Try to login

**Expected Result:**
❌ Error message displayed  
❌ No infinite loading  

**In Console:**
```javascript
// Should see network error
```

#### Test 8.2: Unauthorized (401)
**Steps:**
1. Manually clear `access_token` from localStorage
2. Make API call (e.g., go to admin dashboard)

**Expected Result:**
✅ Auto-refresh attempted  
❌ Since no refresh_token, redirect to login  

#### Test 8.3: Forbidden (403)
**Steps:**
1. Login as regular user
2. Try to access `/admin-dashboard`

**Expected Result:**
❌ Error message: "Access Denied"  

---

### 9. UI/UX Testing

#### Test 9.1: Responsive Design
**Steps:**
1. Open on different screen sizes:
   - Desktop (1920x1080)
   - Tablet (768x1024)
   - Mobile (375x667)
2. Test all pages

**Expected Result:**
✅ UI adjusts properly  
✅ No horizontal scrolling  
✅ Buttons clickable on mobile  

#### Test 9.2: Form Validation Messages
**Steps:**
1. Try invalid inputs
2. Check error messages

**Expected Result:**
✅ Clear error messages  
✅ Messages disappear when fixed  

#### Test 9.3: Loading States
**Steps:**
1. Check login button while loading
2. Should show "Logging in..."

**Expected Result:**
✅ Button disabled during request  
✅ Loading text shown  
✅ Prevents double-click submissions  

#### Test 9.4: Navigation
**Steps:**
1. Test all links and buttons
2. Go back/forward in browser

**Expected Result:**
✅ All links work  
✅ Back button works  
✅ URLs update correctly  

---

### 10. Security Testing

#### Test 10.1: XSS Prevention
**Steps:**
1. Try to register with username: `<script>alert('xss')</script>`
2. Check if script runs

**Expected Result:**
❌ Script should NOT execute  
✅ Treated as regular text  

#### Test 10.2: Token in URL
**Steps:**
1. After login, check URL bar
2. Check if token appears in URL

**Expected Result:**
❌ Never in URL  
✅ Only in localStorage  

#### Test 10.3: Credentials in URL
**Steps:**
1. Try attack: `login?username=admin&password=123`
2. Does it auto-login?

**Expected Result:**
❌ No auto-login from URL  
✅ Must submit form  

#### Test 10.4: Token Exposure
**Steps:**
1. In DevTools, check Network tab
2. Verify Authorization header present

**Expected Result:**
✅ Authorization header shown  
✅ Only sent to backend URL  

---

## Test Data

### Sample Users to Create

#### User 1: Single Role
```
Username: user-single
Password: Pass@12345
Email: single@example.com
Mobile: 9111111111
Roles: ROLE_USER
```

#### User 2: Multiple Roles
```
Username: user-multi
Password: Pass@12345
Email: multi@example.com
Mobile: 9222222222
Roles: ROLE_USER, ROLE_STAFF
```

#### User 3: Admin
```
Username: user-admin
Password: Pass@12345
Email: admin@example.com
Mobile: 9333333333
Roles: ROLE_ADMIN, ROLE_USER
```

---

## Test Checklist

### Authentication
- [ ] Register new user
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Logout functionality
- [ ] Session persistence on refresh

### Authorization
- [ ] Role selection (multiple roles)
- [ ] Access denied for wrong role
- [ ] Admin-only pages blocked
- [ ] Protected routes work

### Token Management
- [ ] Tokens stored in localStorage
- [ ] Authorization header added
- [ ] Token refresh works
- [ ] Logout clears tokens

### User Dashboard
- [ ] Shows user information
- [ ] Displays all roles
- [ ] Shows stats
- [ ] Logout button works

### Admin Dashboard
- [ ] Shows all users
- [ ] Can add roles
- [ ] User list updates
- [ ] Only accessible by admin

### UI/UX
- [ ] Responsive on mobile
- [ ] Error messages clear
- [ ] Loading states work
- [ ] Navigation smooth

### Performance
- [ ] Login < 500ms
- [ ] Page loads < 1s
- [ ] No memory leaks
- [ ] Smooth animations

### Security
- [ ] No XSS vulnerabilities
- [ ] Tokens not in URL
- [ ] Credentials not exposed
- [ ] HTTPS ready

---

## Debugging Tools

### Browser Console
```javascript
// Check auth state
useAuth()  // Would need to be in component

// Check localStorage
JSON.parse(localStorage.getItem('user_info'))
localStorage.getItem('access_token')
localStorage.getItem('selected_role')

// Clear all
localStorage.clear()

// Decode JWT (for inspection)
// Use: https://jwt.io
```

### Network Tab (F12)
- Monitor API requests
- Check response headers
- Verify Authorization header
- Watch token refresh

### React DevTools
- Inspect component state
- Check AuthContext values
- Watch state changes
- Profile performance

### Backend Logs
- Monitor login attempts
- Check token generation
- Verify admin requests
- Track errors

---

## Test Report Template

```markdown
## Test Session: [Date & Time]

### Environment
- Backend: http://localhost:8080 ✅/❌
- Frontend: http://localhost:3000 ✅/❌
- Database: Running ✅/❌

### Test Results
- Registration: ✅/❌ [Notes]
- Login: ✅/❌ [Notes]
- Role Selection: ✅/❌ [Notes]
- User Dashboard: ✅/❌ [Notes]
- Admin Dashboard: ✅/❌ [Notes]
- Token Refresh: ✅/❌ [Notes]
- Protected Routes: ✅/❌ [Notes]
- Logout: ✅/❌ [Notes]

### Issues Found
- [Issue 1]
- [Issue 2]
- [Issue 3]

### Pass/Fail
Overall: PASS ✅ / FAIL ❌
```

---

## Quick Test Commands

```bash
# Clear all data
localStorage.clear()

# Check if logged in
!!localStorage.getItem('access_token')

# Get user info
console.log(JSON.parse(localStorage.getItem('user_info')))

# Get selected role
console.log(localStorage.getItem('selected_role'))

# Simulate logout
localStorage.clear(); location.href='/login'
```

---

Happy Testing! 🧪
