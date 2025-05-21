# Secure Express.js Application

A robust Node.js/Express application with comprehensive security features, MongoDB integration, and complete authentication system.

## Project Overview

This project implements a secure backend infrastructure using Node.js and Express.js, with the following key features:

- **Node.js/Express Architecture**: Modern Express.js application with structured middleware approach
- **MongoDB Integration**: Mongoose-based database integration with secure connection handling
- **Security-First Design**: Multiple layers of security protection including XSS prevention, NoSQL injection protection, and rate limiting
- **JWT Authentication**: Complete authentication system with JWT token management
- **Advanced Error Handling**: Comprehensive error handling for API responses

## Project Structure

```
.
├── config/         # Configuration files (database, environment)
├── controllers/    # Route controllers (business logic)
├── middleware/     # Custom middleware functions
├── models/        # Mongoose models (data layer)
├── public/        # Static files
├── routes/        # API routes
├── src/           # Source files
└── test/          # Test files
```

### Directory Purposes:
- `config/`: Contains database configuration and environment variable setup
- `controllers/`: Houses the business logic for all API endpoints
- `middleware/`: Custom middleware for authentication, error handling, and request processing
- `models/`: Database schemas and models
- `public/`: Static frontend assets
- `routes/`: API route definitions
- `src/`: Core application files including the main server setup
- `test/`: Test suites for automated testing

## Technology Stack

### Core Dependencies
- Express.js (^5.1.0): Web application framework
- Mongoose (^8.15.0): MongoDB ODM
- JSON Web Token (^9.0.2): Authentication tokens
- Bcrypt.js (^3.0.2): Password hashing
- Nodemailer (^7.0.3): Email functionality

### Security Packages
- Helmet (^8.1.0): Security headers
- CORS (^2.8.5): Cross-Origin Resource Sharing
- Express-Rate-Limit (^7.5.0): API rate limiting
- Express-Mongo-Sanitize (^2.2.0): NoSQL injection prevention
- XSS-Clean (^0.1.4): Cross-site scripting prevention
- HPP (^0.2.3): HTTP Parameter Pollution protection

### Development Tools
- Nodemon (^3.1.0): Development server with hot reload
- Jest (^29.7.0): Testing framework
- Supertest (^7.1.1): HTTP testing

## Setup Process

### Environment Configuration
1. Copy `.env.example` to `.env`
2. Configure the following variables:
```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/your_database
JWT_SECRET=your_secure_jwt_secret
```

### Installation Steps
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables
4. Start the server:
   - Development: `npm run dev`
   - Production: `npm start`
   - Testing: `npm test`

### Available Scripts
- `npm start`: Start production server
- `npm run dev`: Start development server with Nodemon
- `npm test`: Run test suite

## Security Features

### API Protection
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **XSS Protection**: Sanitizes input to prevent cross-site scripting
- **NoSQL Injection**: Sanitizes MongoDB queries
- **Parameter Pollution**: Prevents HTTP parameter pollution attacks

### CORS Configuration
- Development: All origins allowed
- Production: Configured for specific domain
- Credentials: Enabled for authenticated requests

### Security Headers (Helmet)
- Content Security Policy
- XSS Protection
- Frame Options
- DNS Prefetch Control
- HSTS
- Other secure headers

## Error Handling

The application implements comprehensive error handling for various scenarios:

### Types of Errors Handled
- Validation Errors (400)
- Authentication Errors (401)
- Database Errors (400/404)
- Server Errors (500)

### Error Response Format
```json
{
  "success": false,
  "error": "Error message",
  "stack": "Stack trace (development only)"
}
```

### Specific Error Cases
- JWT Authentication Failures
- Database Validation Errors
- Duplicate Key Errors
- Cast Errors (Invalid IDs)
- Rate Limit Exceeded
- General Server Errors
