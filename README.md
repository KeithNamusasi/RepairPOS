# RepairPOS - MERN Stack Application

A full-stack MERN (MongoDB, Express, React, Node.js) application for repair shop point of sale.

## Features

- **User Registration** - Create a new account
- **User Login** - Authenticate with email and password
- **Sign Out** - Securely sign out of the application
- **Delete Account** - Permanently delete your account

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. **Clone the repository:**

2. **Install dependencies:**
   ```bash
   npm run install:all
   ```
   
   Or manually:
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

3. **Set up MongoDB:**
   - Ensure MongoDB is running locally, or
   - Update `server/.env` with your MongoDB URI

4. **Start the application:**

   For development (both frontend and backend):
   ```bash
   npm run dev
   ```

   Or individually:
   ```bash
   # Terminal 1 - Backend
   npm run server
   
   # Terminal 2 - Frontend
   npm run client
   ```

## Environment Variables

### Server (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/repairpos
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NODE_ENV=development
```

## API Endpoints

| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| POST | /api/auth/signout | Sign out user |
| DELETE | /api/auth/delete | Delete account |
| GET | /api/auth/me | Get current user |

## Project Structure

```
repairpos/
├── client/               # React frontend
│   ├── public/
│   └── src/
│       ├── components/  # React components
│       ├── context/      # Auth context
│       ├── App.js       # Main app
│       └── index.js     # Entry point
├── server/               # Express backend
│   ├── middleware/      # Auth middleware
│   ├── models/          # Mongoose models
│   ├── routes/         # Express routes
│   └── index.js        # Server entry point
├── package.json         # Root package.json
└── README.md
```

## Running the Application

1. Make sure MongoDB is running
2. Start the backend server:
   ```bash
   cd server && npm start
   ```
3. Start the frontend:
   ```bash
   cd client && npm start
   ```
4. Open http://localhost:3000 in your browser

## License

MIT