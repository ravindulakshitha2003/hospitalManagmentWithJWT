# Backend Integration Guide

This guide details the expected API responses and how the frontend integrates with your Spring Boot backend.

## Required Backend Endpoints

### 1. Authentication Endpoints

#### Login
```
POST /api/v1/auth/login

Request Body:
{
  "username": "string",
  "password": "string"
}

Response (200 OK):
{
  "access_token": "string (JWT)",
  "refresh_token": "string (JWT)",
  "roles": ["string"],  // e.g., ["ROLE_USER", "ROLE_ADMIN"]
  "username": "string",
  "email": "string",
  "mobile": "string",
  "message": "string",
  "error": "string"  // Empty if successful
}

Response (400/401):
{
  "error": "string",
  "message": "string",
  "access_token": null,
  "refresh_token": null
}
```

#### Register
```
POST /api/v1/auth/register

Request Body:
{
  "username": "string",
  "password": "string",
  "email": "string",
  "mobile": "string"
}

Response (200 OK):
{
  "username": "string",
  "email": "string",
  "mobile": "string",
  "message": "Registration successful",
  "error": ""
}

Response (400):
{
  "error": "string",
  "message": "string"
}
```

#### Refresh Token
```
POST /api/v1/auth/refresh

Request Body:
{
  "refresh_token": "string"
}

Response (200 OK):
{
  "access_token": "string (JWT)",
  "refresh_token": "string (JWT)",
  "roles": ["string"],
  "message": "Token refreshed",
  "error": ""
}

Response (401):
{
  "error": "Invalid or expired refresh token",
  "access_token": null,
  "refresh_token": null
}
```

### 2. Admin Endpoints

#### Get All Users
```
GET /api/v1/admin/allUser

Headers:
Authorization: Bearer <access_token>

Response (200 OK):
{
  "users": [
    {
      "id": "string (ObjectId or UUID)",
      "username": "string",
      "email": "string",
      "mobile": "string",
      "roles": ["ROLE_USER"]  // Array of roles
    },
    ...
  ]
}

Alternative Response (also supported):
[
  {
    "id": "string",
    "username": "string",
    "email": "string",
    "mobile": "string",
    "roles": ["ROLE_USER"]
  },
  ...
]

Response (403):
{
  "error": "Access denied",
  "message": "You don't have permission to access this resource"
}

Response (401):
{
  "error": "Token expired or invalid"
}
```

#### Add Role to User
```
POST /api/v1/admin/addRole

Headers:
Authorization: Bearer <access_token>

Request Body:
{
  "username": "string",
  "role": "ROLE_USER" | "ROLE_ADMIN" | "ROLE_STAFF"
}

Response (200 OK):
{
  "username": "string",
  "roles": ["ROLE_USER", "ROLE_ADMIN"],  // Updated roles
  "message": "Role added successfully",
  "error": ""
}

Response (400):
{
  "error": "User not found",
  "message": "string"
}

Response (403):
{
  "error": "Access denied",
  "message": "Only admins can add roles"
}
```

## Security Implementation

### JWT Token Structure

Frontend expects JWT tokens with these claims:

```json
{
  "sub": "username",
  "roles": ["ROLE_USER", "ROLE_ADMIN"],
  "exp": 1700000000,
  "iat": 1699996400,
  "iss": "hospital-system"
}
```

### Required Frontend Middleware

1. **Authorization Header**
   - Frontend automatically adds: `Authorization: Bearer <access_token>`

2. **Token Expiration Handling**
   - 401 response → Automatically refresh token using refresh_token
   - Retry original request with new token
   - If refresh fails → Redirect to login

3. **CORS Configuration (Backend)**
   Add to backend (Spring Boot config):
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
                       .allowedMethods("GET", "POST", "PUT", "DELETE")
                       .allowedHeaders("*")
                       .allowCredentials(true)
                       .maxAge(3600);
               }
           };
       }
   }
   ```

## Frontend Implementation Details

### Axios Interceptor

```javascript
// Request Interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Attempt token refresh
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(
          '/api/v1/auth/refresh',
          { refresh_token: refreshToken }
        );
        
        // Update tokens
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        
        // Retry original request
        error.config.headers.Authorization = `Bearer ${response.data.access_token}`;
        return api(error.config);
      } catch (err) {
        // Logout on refresh failure
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

### Auth Context Storage

Frontend stores in localStorage:
```javascript
localStorage.setItem('access_token', response.access_token);
localStorage.setItem('refresh_token', response.refresh_token);
localStorage.setItem('selected_role', selectedRole);
localStorage.setItem('user_info', JSON.stringify({
  username: response.username,
  email: response.email,
  mobile: response.mobile,
  roles: response.roles
}));
```

## Response Format Compatibility

The frontend is flexible and handles multiple response formats:

### Format 1: Wrapper Object
```json
{
  "users": [{...}, {...}],
  "message": "Success",
  "error": ""
}
```

### Format 2: Direct Array
```json
[
  {...},
  {...}
]
```

Both formats are supported in AdminDashboard:
```javascript
setUsers(response.users || response || []);
```

## Error Handling

### Login Errors
```javascript
// Backend returns
{
  "error": "Invalid credentials",
  "message": "Username or password incorrect"
}

// Frontend displays
<div className="error-message">{error.error || error.message}</div>
```

### Unauthorized Access (401)

**Scenario 1: Expired Access Token**
- Frontend: Refresh token automatically
- Backend: Return 401 with invalid token error

**Scenario 2: Invalid/Expired Refresh Token**
- Frontend: Clear tokens, redirect to login
- Backend: Return 401 with refresh token error

**Scenario 3: Invalid JWT Signature**
- Frontend: Treat as 401, attempt refresh
- Backend: Return 401, don't refresh

### Forbidden Access (403)

**When accessing restricted endpoints:**
```json
{
  "error": "Access Denied",
  "message": "You don't have permission to access this resource"
}
```

Frontend shows:
```javascript
<div className="error-message">
  You don't have permission to access this page.
</div>
```

## Testing Backend Integration

### Test Cases

#### 1. Test Login with Multiple Roles
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'

# Expected Response:
{
  "access_token": "...",
  "refresh_token": "...",
  "roles": ["ROLE_USER", "ROLE_ADMIN"],
  "message": "Login successful",
  "error": ""
}
```

#### 2. Test Admin Endpoint
```bash
curl -X GET http://localhost:8080/api/v1/admin/allUser \
  -H "Authorization: Bearer <access_token>"

# Expected Response:
{
  "users": [
    {"username":"user1", "email":"user1@example.com", "roles":["ROLE_USER"]},
    {"username":"user2", "email":"user2@example.com", "roles":["ROLE_ADMIN", "ROLE_USER"]}
  ]
}
```

#### 3. Test Token Refresh
```bash
curl -X POST http://localhost:8080/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refresh_token":"<refresh_token>"}'

# Expected Response:
{
  "access_token": "...",
  "refresh_token": "...",
  "roles": ["ROLE_USER"],
  "message": "Token refreshed",
  "error": ""
}
```

## Response Timing

### Expected Response Times
- Login: < 500ms
- Token Refresh: < 300ms
- Get Users: < 1000ms
- Add Role: < 500ms

## Data Validation

### Frontend Validation
- Username: Required, non-empty
- Password: Required, non-empty
- Email: Valid email format
- Mobile: Non-empty

### Backend Should Also Validate
- Username: Unique, min 3 chars
- Password: Min 8 chars, strong complexity
- Email: Valid format, unique
- Mobile: Valid format

## Troubleshooting Integration

### Issue: CORS Error
```
Access to XMLHttpRequest blocked by CORS
```
**Solution**: Configure CORS on backend

### Issue: 404 on API Endpoints
```
POST /api/v1/auth/login 404 Not Found
```
**Solution**: Verify endpoint URLs in backend

### Issue: Token Not Refreshing
```
401 error keeps recurring
```
**Solution**: Verify refresh endpoint and token structure

### Issue: Empty Roles Array
```
login returns roles: []
```
**Solution**: Ensure user has roles assigned in database

### Issue: CORS Preflight Failing
```
OPTIONS /api/v1/admin/allUser 403 Forbidden
```
**Solution**: Allow OPTIONS method in CORS config

## API Response Enhancements

Optional enhancements for better frontend experience:

### 1. Include Timestamps
```json
{
  "access_token": "...",
  "localTime": "2024-01-15T10:30:00Z",  // Server time
  "message": "Login successful"
}
```

### 2. Include Token Expiration
```json
{
  "access_token": "...",
  "expiresIn": 3600,  // Seconds
  "message": "Login successful"
}
```

### 3. Include User Role Count
```json
{
  "users": [...],
  "totalCount": 10,
  "pageNumber": 1,
  "pageSize": 10
}
```

## Production Considerations

1. **HTTPS Required**
   - All JWT tokens should be transmitted over HTTPS

2. **Secure Token Storage**
   - Consider secure cookie storage for tokens
   - Implement token rotation strategy

3. **Rate Limiting**
   - Add rate limiting on auth endpoints
   - Prevent brute force attacks

4. **Token Expiration**
   - Access token: 15-30 minutes
   - Refresh token: 7 days - 30 days

5. **Logging**
   - Log authentication attempts
   - Monitor failed login attempts
   - Track API usage per role

6. **Monitoring**
   - Monitor token refresh frequency
   - Alert on unusually high failed logins
   - Track unauthorized access attempts
