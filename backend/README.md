# Backend API

A Node.js/Express backend API with MongoDB.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables by creating a `.env` file with:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/my_database
   NODE_ENV=development
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## Available Scripts

- `npm start`: Starts the production server
- `npm run dev`: Starts the development server with hot-reload
- `npm test`: Runs tests

## API Endpoints

- `GET /`: Welcome message 