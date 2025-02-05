# Product Requirements Document (PRD)

## **Project: Authentication System for React Vite Application**

### **1. Overview**

The objective of this project is to integrate authentication into an existing React Vite application. The authentication system will support **local authentication**, **Google OAuth authentication**, and **passwordless authentication via magic links** using Passport.js. Additionally, a **PostgreSQL database** will be set up to store user credentials and authentication data.

### **2. Features**

#### **2.1 User Authentication**

- **Local Authentication (passport-local)**

  - Users can register with an email and password.
  - Passwords should be hashed and stored securely.
  - Users can log in using their email and password.
  - Login session management with cookies or JWT.
  - **Password Validation**:
    - Minimum 8 characters.
    - At least one uppercase letter.
    - At least one lowercase letter.
    - At least one digit.
    - At least one special character.

- **Google OAuth Authentication (passport-google-oauth20)**

  - Users can log in using their Google account.
  - If a new user logs in with Google, an account is created in the database.
  - If an existing user logs in with Google, their session is authenticated.

- **Magic Link Authentication (passport-magic-link)**

  - Users can log in without a password via an email magic link.
  - A one-time authentication link is sent to the user’s email.
  - Clicking the link logs the user in and redirects them to the application.

- **Forgot Password & Password Reset Mechanism**

  - Users can request a password reset link via email.
  - A one-time token is generated and stored securely.
  - The user clicks the link, enters a new password, and updates their credentials.
  - **Password Validation on Reset** (Same criteria as login validation).

- **Email Activation Mechanism**

  - After registration, users receive an activation email.
  - A unique activation link is sent to verify the email.
  - The account remains inactive until the user clicks the link.

- **Logout Functionality**
  - Users can log out from the frontend, which will call the backend logout API.
  - Backend will clear session data or invalidate JWT tokens as needed.
  - Users will be redirected to the login page after logging out.

#### **2.2 API Endpoints**

| Endpoint                        | Method | Description                                                       |
| ------------------------------- | ------ | ----------------------------------------------------------------- |
| `/api/auth/register`            | POST   | Register a new user (email/password) with password validation     |
| `/api/auth/login`               | POST   | Log in with email/password (validates password strength)          |
| `/api/auth/logout`              | GET    | Log out the user and clear session or JWT token                   |
| `/api/auth/google`              | GET    | Redirect to Google OAuth login                                    |
| `/api/auth/google/callback`     | GET    | Handle Google OAuth callback                                      |
| `/api/auth/magic-link`          | POST   | Send a magic link to the user’s email                             |
| `/api/auth/magic-link/callback` | GET    | Handle magic link authentication                                  |
| `/api/auth/forgot-password`     | POST   | Send a password reset link                                        |
| `/api/auth/reset-password`      | POST   | Reset password with token (validates new password)                |
| `/api/auth/activate`            | GET    | Activate user account via email link                              |
| `/api/auth/user`                | GET    | Get the authenticated user’s details (firstname, lastname, email) |

#### **2.3 Frontend UI**

- **Login Page**
  - Input fields for email and password (with validation feedback)
  - "Login with Google" button
  - "Login with Magic Link" button
- **Registration Page**
  - Input fields for email, password, confirm password (with validation feedback)
  - "Resend Activation Email" button
- **Forgot Password Page**
  - Input field for email to request a password reset
- **Reset Password Page**
  - Input fields for new password and confirmation (with validation feedback)
- **Dashboard**
  - Display user information after login (firstname, lastname, email)
  - "Logout" button, which triggers the logout API and redirects to login

### **3. Technical Stack**

#### **Frontend (React Vite)**

- React.js with Vite
- React Router for navigation
- Axios for API requests
- Tailwind CSS for styling

#### **Backend (NestJS)**

- NestJS for API endpoints
- Passport.js for authentication
- bcrypt for password hashing
- JWT or session-based authentication
- Nodemailer for email handling
- **Password Validation on Backend**
  - Implement validation middleware to enforce password complexity rules
  - Return meaningful error messages for invalid passwords

#### **Database (PostgreSQL)**

- PostgreSQL for storing user credentials
- TypeORM or Prisma as an ORM

### **4. Database Schema**

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    google_id VARCHAR(255) UNIQUE,
    magic_link_token VARCHAR(255),
    reset_password_token VARCHAR(255),
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **5. Swagger API Documentation**

- Swagger will be used to document and test the API endpoints.
- NestJS Swagger module (`@nestjs/swagger`) will generate OpenAPI documentation.
- The API documentation will be available at `/api/docs`.
- Each endpoint will have descriptions, request/response schemas, and example responses.

### **6. Deployment & Configuration**

- **Backend** hosted on a Node.js environment (e.g., Heroku, AWS, or DigitalOcean).
- **Frontend** deployed via Vercel or Netlify.
- **PostgreSQL** hosted on Supabase, AWS RDS, or DigitalOcean.
- **Environment Variables** for secrets (Google OAuth credentials, JWT secret, email SMTP credentials, DB connection string).

### **7. Milestones & Timeline**

1. **Week 1**: Setup PostgreSQL, backend API, and Passport authentication.
2. **Week 2**: Implement frontend UI (Login/Register, Forgot Password, Magic Link) and API integration.
3. **Week 3**: Implement email activation, password reset, and testing.
4. **Week 4**: Deployment and documentation.

### **8. Security Considerations**

- Use HTTPS in production.
- Store environment variables securely.
- Implement rate-limiting to prevent brute-force attacks.
- Validate and sanitize user input.
- Secure magic links and password reset links with expiration and one-time use.
- **Enforce strong password policies on both frontend and backend.**

### **9. Future Enhancements**

- Multi-factor authentication (MFA).
- Role-based access control (RBAC).
- Social logins for additional providers (GitHub, Twitter, etc.).

This PRD provides a clear roadmap for implementing authentication in your React Vite application. Let me know if you need any modifications!
