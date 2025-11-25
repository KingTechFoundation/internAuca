# AUCA Lab Management System - Backend API

A comprehensive Spring Boot backend system for managing AUCA laboratory resources, equipment, bookings, and maintenance.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Default Admin User](#default-admin-user)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
  - [Authentication Endpoints](#authentication-endpoints)
  - [User Management Endpoints](#user-management-endpoints)
  - [Lab Management Endpoints](#lab-management-endpoints)
  - [Equipment Management Endpoints](#equipment-management-endpoints)
  - [Booking Management Endpoints](#booking-management-endpoints)
  - [Maintenance Management Endpoints](#maintenance-management-endpoints)
  - [Reports & Analytics Endpoints](#reports--analytics-endpoints)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [Testing with Postman](#testing-with-postman)

## Prerequisites

- Java 21 or higher
- Maven 3.6+
- MySQL 8.0+
- Postman (for API testing)

## Setup Instructions

1. **Clone the repository** (if applicable) or navigate to the project directory

2. **Create MySQL Database**
   ```sql
   CREATE DATABASE elisa;
   ```

3. **Update Database Configuration** (if needed)
   - Edit `src/main/resources/application.properties`
   - Update database URL, username, and password

4. **Build the Project**
   ```bash
   mvn clean install
   ```

5. **Run the Application**
   ```bash
   mvn spring-boot:run
   ```

   The application will start on `http://localhost:8080`

## Default Admin User

On first startup, the system automatically creates a default admin user:

- **Username:** `admin`
- **Password:** `admin123`
- **Email:** `admin@auca.rw`
- **Role:** `ADMIN`

**⚠️ IMPORTANT:** Change the default password after first login in production!

## Authentication

All endpoints (except `/api/auth/**`) require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Getting a Token

1. Register a new user or login with existing credentials
2. Copy the `token` from the response
3. Use it in subsequent requests

## API Endpoints

### Base URL
```
http://localhost:8080
```

### Authentication Endpoints

#### 1. Register User
- **POST** `/api/auth/register`
- **Description:** Register a new user (default role: STUDENT)
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "labId": null
  }
  ```
- **Success Response (200):**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "type": "Bearer",
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "STUDENT"
    },
    "timestamp": "2024-01-15T10:30:00"
  }
  ```

#### 2. Login
- **POST** `/api/auth/login`
- **Description:** Login with username and password
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "username": "admin",
    "password": "admin123"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "type": "Bearer",
      "id": 1,
      "username": "admin",
      "email": "admin@auca.rw",
      "firstName": "System",
      "lastName": "Administrator",
      "role": "ADMIN"
    },
    "timestamp": "2024-01-15T10:30:00"
  }
  ```

### User Management Endpoints

*All endpoints require ADMIN role*

#### 3. Create User
- **POST** `/api/admin/users?labId={labId}`
- **Description:** Create a new user (Admin, Lab Manager, Instructor, or Student)
- **Auth Required:** Yes (ADMIN)
- **Request Body:**
  ```json
  {
    "username": "lab_manager1",
    "email": "manager@auca.rw",
    "password": "password123",
    "firstName": "Jane",
    "lastName": "Manager",
    "role": "LAB_MANAGER",
    "active": true
  }
  ```
- **Query Parameters:**
  - `labId` (optional): Assign user to a lab

#### 4. Update User
- **PUT** `/api/admin/users/{id}?labId={labId}`
- **Description:** Update user information
- **Auth Required:** Yes (ADMIN)

#### 5. Delete User
- **DELETE** `/api/admin/users/{id}`
- **Description:** Delete a user
- **Auth Required:** Yes (ADMIN)

#### 6. Get All Users
- **GET** `/api/admin/users`
- **Description:** Retrieve all users
- **Auth Required:** Yes (ADMIN)

#### 7. Get User by ID
- **GET** `/api/admin/users/{id}`
- **Description:** Retrieve user by ID
- **Auth Required:** Yes (ADMIN)

#### 8. Get Users by Role
- **GET** `/api/admin/users/role/{role}`
- **Description:** Get users filtered by role (ADMIN, LAB_MANAGER, INSTRUCTOR, STUDENT)
- **Auth Required:** Yes (ADMIN)

### Lab Management Endpoints

#### 9. Create Lab
- **POST** `/api/admin/labs`
- **Description:** Create a new lab
- **Auth Required:** Yes (ADMIN)
- **Request Body:**
  ```json
  {
    "name": "Computer Lab 101",
    "location": "Building A, Room 101",
    "capacity": 30,
    "type": "MAIN_COMPUTER_LAB",
    "labManagerId": 2
  }
  ```
- **Lab Types:**
  - `MAIN_COMPUTER_LAB`
  - `EXTENSION_104`
  - `EXTENSION_108`
  - `EXTENSION_204`
  - `EXTENSION_209`
  - `EXTENSION_310`
  - `ENGLISH_LAB`

#### 10. Update Lab
- **PUT** `/api/admin/labs/{id}`
- **Description:** Update lab information
- **Auth Required:** Yes (ADMIN)

#### 11. Delete Lab
- **DELETE** `/api/admin/labs/{id}`
- **Description:** Delete a lab
- **Auth Required:** Yes (ADMIN)

#### 12. Get All Labs
- **GET** `/api/labs`
- **Description:** Retrieve all labs
- **Auth Required:** Yes

#### 13. Get Active Labs
- **GET** `/api/labs/active`
- **Description:** Retrieve only active labs
- **Auth Required:** Yes

#### 14. Get Lab by ID
- **GET** `/api/labs/{id}`
- **Description:** Retrieve lab by ID
- **Auth Required:** Yes

#### 15. Get Labs by Manager
- **GET** `/api/lab-manager/labs`
- **Description:** Get labs managed by current user
- **Auth Required:** Yes (LAB_MANAGER or ADMIN)

### Equipment Management Endpoints

#### 16. Create Equipment
- **POST** `/api/lab-manager/equipment`
- **Description:** Add new equipment to a lab
- **Auth Required:** Yes (LAB_MANAGER or ADMIN)
- **Request Body:**
  ```json
  {
    "name": "Desktop Computer",
    "description": "Dell OptiPlex 7090",
    "serialNumber": "DL-2024-001",
    "labId": 1,
    "status": "AVAILABLE"
  }
  ```
- **Equipment Status:**
  - `AVAILABLE`
  - `IN_USE`
  - `UNDER_MAINTENANCE`
  - `BROKEN`

#### 17. Update Equipment
- **PUT** `/api/lab-manager/equipment/{id}`
- **Description:** Update equipment information
- **Auth Required:** Yes (LAB_MANAGER or ADMIN)

#### 18. Delete Equipment
- **DELETE** `/api/lab-manager/equipment/{id}`
- **Description:** Delete equipment
- **Auth Required:** Yes (LAB_MANAGER or ADMIN)

#### 19. Get All Equipment
- **GET** `/api/equipment`
- **Description:** Retrieve all equipment
- **Auth Required:** Yes

#### 20. Get Equipment by ID
- **GET** `/api/equipment/{id}`
- **Description:** Retrieve equipment by ID
- **Auth Required:** Yes

#### 21. Get Equipment by Lab
- **GET** `/api/equipment/lab/{labId}`
- **Description:** Get all equipment in a specific lab
- **Auth Required:** Yes

#### 22. Get Equipment by Status
- **GET** `/api/equipment/status/{status}`
- **Description:** Get equipment filtered by status
- **Auth Required:** Yes

### Booking Management Endpoints

#### 23. Create Booking (Instructor)
- **POST** `/api/instructor/bookings`
- **Description:** Instructor creates a booking (auto-approved)
- **Auth Required:** Yes (INSTRUCTOR or ADMIN)
- **Request Body:**
  ```json
  {
    "labId": 1,
    "startTime": "2024-01-20T09:00:00",
    "endTime": "2024-01-20T11:00:00",
    "purpose": "Database Systems Class"
  }
  ```

#### 24. Create Booking Request (Student)
- **POST** `/api/student/bookings`
- **Description:** Student creates a booking request (pending approval)
- **Auth Required:** Yes (STUDENT or ADMIN)
- **Request Body:** Same as instructor booking

#### 25. Update Booking
- **PUT** `/api/instructor/bookings/{id}`
- **Description:** Update booking details
- **Auth Required:** Yes (INSTRUCTOR or ADMIN)

#### 26. Approve Booking
- **POST** `/api/lab-manager/bookings/{id}/approve`
- **Description:** Approve a pending booking
- **Auth Required:** Yes (LAB_MANAGER or ADMIN)

#### 27. Reject Booking
- **POST** `/api/lab-manager/bookings/{id}/reject`
- **Description:** Reject a pending booking
- **Auth Required:** Yes (LAB_MANAGER or ADMIN)

#### 28. Cancel Booking
- **POST** `/api/bookings/{id}/cancel`
- **Description:** Cancel a booking
- **Auth Required:** Yes (any authenticated user)

#### 29. Delete Booking
- **DELETE** `/api/admin/bookings/{id}`
- **Description:** Delete a booking
- **Auth Required:** Yes (ADMIN)

#### 30. Get All Bookings
- **GET** `/api/bookings`
- **Description:** Retrieve all bookings
- **Auth Required:** Yes

#### 31. Get Booking by ID
- **GET** `/api/bookings/{id}`
- **Description:** Retrieve booking by ID
- **Auth Required:** Yes

#### 32. Get Bookings by User
- **GET** `/api/bookings/user/{userId}`
- **Description:** Get all bookings for a specific user
- **Auth Required:** Yes

#### 33. Get My Bookings
- **GET** `/api/bookings/my-bookings`
- **Description:** Get current user's bookings
- **Auth Required:** Yes

#### 34. Get Bookings by Lab
- **GET** `/api/bookings/lab/{labId}`
- **Description:** Get all bookings for a specific lab
- **Auth Required:** Yes

#### 35. Get Bookings by Date Range
- **GET** `/api/bookings/lab/{labId}/availability?start=2024-01-20T00:00:00&end=2024-01-21T23:59:59`
- **Description:** Get bookings for a lab within a date range
- **Auth Required:** Yes

### Maintenance Management Endpoints

#### 36. Create Maintenance Request
- **POST** `/api/lab-manager/maintenance`
- **Description:** Create a maintenance request
- **Auth Required:** Yes (LAB_MANAGER or ADMIN)
- **Request Body:**
  ```json
  {
    "equipmentId": 1,
    "description": "Computer not booting",
    "assignedTechnicianId": 5,
    "cost": null,
    "notes": null
  }
  ```

#### 37. Assign Technician
- **POST** `/api/lab-manager/maintenance/{id}/assign?technicianId={technicianId}`
- **Description:** Assign a technician to maintenance request
- **Auth Required:** Yes (LAB_MANAGER or ADMIN)

#### 38. Complete Maintenance
- **POST** `/api/lab-manager/maintenance/{id}/complete?cost=150.00&notes=Replaced hard drive`
- **Description:** Mark maintenance as completed
- **Auth Required:** Yes (LAB_MANAGER or ADMIN)

#### 39. Update Maintenance
- **PUT** `/api/lab-manager/maintenance/{id}`
- **Description:** Update maintenance request details
- **Auth Required:** Yes (LAB_MANAGER or ADMIN)

#### 40. Cancel Maintenance
- **POST** `/api/lab-manager/maintenance/{id}/cancel`
- **Description:** Cancel a maintenance request
- **Auth Required:** Yes (LAB_MANAGER or ADMIN)

#### 41. Get All Maintenance
- **GET** `/api/maintenance`
- **Description:** Retrieve all maintenance requests
- **Auth Required:** Yes

#### 42. Get Maintenance by ID
- **GET** `/api/maintenance/{id}`
- **Description:** Retrieve maintenance request by ID
- **Auth Required:** Yes

#### 43. Get Maintenance by Equipment
- **GET** `/api/maintenance/equipment/{equipmentId}`
- **Description:** Get maintenance history for equipment
- **Auth Required:** Yes

#### 44. Get Maintenance by Status
- **GET** `/api/maintenance/status/{status}`
- **Description:** Get maintenance filtered by status (PENDING, IN_PROGRESS, COMPLETED, CANCELLED)
- **Auth Required:** Yes

#### 45. Get Maintenance by Technician
- **GET** `/api/maintenance/technician/{technicianId}`
- **Description:** Get maintenance assigned to a technician
- **Auth Required:** Yes

### Reports & Analytics Endpoints

*All endpoints require ADMIN role*

#### 46. Monthly Lab Usage Report
- **GET** `/api/admin/reports/monthly-lab-usage?yearMonth=2024-01`
- **Description:** Generate monthly lab usage report
- **Auth Required:** Yes (ADMIN)
- **Query Parameters:**
  - `yearMonth`: Format `YYYY-MM` (e.g., `2024-01`)

#### 47. Equipment Utilization Report
- **GET** `/api/admin/reports/equipment-utilization`
- **Description:** Generate equipment utilization statistics
- **Auth Required:** Yes (ADMIN)

#### 48. Maintenance Statistics
- **GET** `/api/admin/reports/maintenance-statistics`
- **Description:** Generate maintenance cost and frequency statistics
- **Auth Required:** Yes (ADMIN)

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2024-01-15T10:30:00"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "data": null,
  "timestamp": "2024-01-15T10:30:00"
}
```

### Validation Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "username": "Username is required",
    "email": "Email should be valid"
  },
  "timestamp": "2024-01-15T10:30:00"
}
```

## Error Handling

The API handles errors with appropriate HTTP status codes:

- **200 OK:** Successful request
- **400 Bad Request:** Validation errors or business logic errors
- **401 Unauthorized:** Missing or invalid JWT token
- **403 Forbidden:** Insufficient permissions
- **404 Not Found:** Resource not found
- **500 Internal Server Error:** Server error

Common error messages:
- `"Username is already taken"`
- `"Email is already in use"`
- `"User not found"`
- `"Lab not found"`
- `"Lab is already booked for this time slot"`
- `"Invalid username or password"`
- `"Account is deactivated"`

## Testing with Postman

### Setup Postman Collection

1. **Create a new Collection:** "AUCA Lab Management System"

2. **Set Collection Variables:**
   - `base_url`: `http://localhost:8080`
   - `token`: (will be set after login)

3. **Create Environment Variables:**
   - Create a new environment
   - Add variable `token` with initial value empty

### Testing Workflow

#### Step 1: Login
1. Create a POST request to `{{base_url}}/api/auth/login`
2. Body (JSON):
   ```json
   {
     "username": "admin",
     "password": "admin123"
   }
   ```
3. Add a **Test Script** to save the token:
   ```javascript
   if (pm.response.code === 200) {
       var jsonData = pm.response.json();
       pm.environment.set("token", jsonData.data.token);
   }
   ```

#### Step 2: Set Authorization Header
1. Go to Collection settings
2. Add Authorization:
   - Type: Bearer Token
   - Token: `{{token}}`

#### Step 3: Test Endpoints
Now all requests will automatically include the token. Test endpoints in this order:

1. **Create Lab** → `/api/admin/labs`
2. **Create User** → `/api/admin/users` (create Lab Manager, Instructor, Student)
3. **Create Equipment** → `/api/lab-manager/equipment`
4. **Create Booking** → `/api/instructor/bookings`
5. **Create Maintenance** → `/api/lab-manager/maintenance`
6. **View Reports** → `/api/admin/reports/equipment-utilization`

### Sample Postman Requests

#### Register User
```
POST {{base_url}}/api/auth/register
Content-Type: application/json

{
  "username": "student1",
  "email": "student1@auca.rw",
  "password": "password123",
  "firstName": "Student",
  "lastName": "One"
}
```

#### Create Lab
```
POST {{base_url}}/api/admin/labs
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "name": "Computer Lab 101",
  "location": "Building A, Room 101",
  "capacity": 30,
  "type": "MAIN_COMPUTER_LAB"
}
```

#### Create Booking
```
POST {{base_url}}/api/instructor/bookings
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "labId": 1,
  "startTime": "2024-02-20T09:00:00",
  "endTime": "2024-02-20T11:00:00",
  "purpose": "Database Systems Class"
}
```

## User Roles & Permissions

### ADMIN
- Full access to all endpoints
- Can manage users, labs, equipment
- Can view all reports

### LAB_MANAGER
- Manage assigned labs
- Manage equipment in assigned labs
- Approve/reject student bookings
- Create maintenance requests
- View reports for assigned labs

### INSTRUCTOR
- Create bookings (auto-approved)
- View own bookings
- View lab schedules

### STUDENT
- Create booking requests (pending approval)
- View own bookings
- View lab schedules
- Request equipment usage

## Database Schema

The system automatically creates the following tables:
- `users` - User accounts with roles
- `labs` - Laboratory information
- `equipment` - Equipment inventory
- `bookings` - Lab booking reservations
- `maintenance` - Maintenance requests and history
- `audit_logs` - System audit trail

## Notes

- All timestamps are in ISO 8601 format
- JWT tokens expire after 24 hours (86400000 ms)
- Date/time fields should be in format: `YYYY-MM-DDTHH:mm:ss`
- The system logs all actions to `audit_logs` table for compliance
- Equipment status is automatically updated when maintenance is created/completed

## Support

For issues or questions, contact the development team.

---

**Version:** 1.0.0  
**Last Updated:** January 2024






