# Car Rental App

A small Node.js + Express application for managing car rentals. The app uses EJS for server-side views and MongoDB (via Mongoose) for data storage. It includes user authentication, car listings, and booking management.

## Features

- User signup and login (JWT)
- Password hashing with bcryptjs
- CRUD for cars (admin views)
- Booking creation and listing
- EJS server-side rendered views

## Prerequisites

- Node.js (v16+ recommended)
- npm (comes with Node.js)
- MongoDB server or MongoDB Atlas connection string

## Getting started

1. Clone the repo and move into the project directory:

   git clone <repo-url>
   cd carRental

2. Install dependencies:

   npm install

3. Create a `.env` file in the project root and set the following variables (example):

  PORT=5000
  MONGO_URI=mongodb://localhost:27017/car_rental
  JWT_SECRET=your_jwt_secret_here

4. Run the app:

- Start in production mode:

  npm start

- Start in development (auto-reload) mode:

  npm run dev

The app will be available at http://localhost:3000 (or the port you set in `.env`).

## Project structure

- `server.js` - App entrypoint and Express setup
- `Routes/` - Express route definitions
  - `authRoutes.js` - Authentication endpoints (signup/login)
  - `userRoutes.js` - User-related endpoints
  - `carRoutes.js` - Car CRUD and listing endpoints
  - `bookingRoutes.js` - Booking endpoints
  - `viewRoutes.js` - Routes that render EJS views
- `models/` - Mongoose models (`User.js`, `Car.js`, `Booking.js`)
- `middleware/` - Middleware (`auth.js` for protecting routes)
- `public/` - Static assets (CSS & client JS)
- `views/` - EJS templates for server-side rendering

Frontend (Next.js)

This project includes a new React/Next.js frontend in the `frontend/` folder that replaces the previous EJS views. The backend now serves API endpoints only. To run the frontend in development:

```bash
cd frontend
npm install
npm run dev
```

The Next.js dev server runs on `http://localhost:3000` by default and talks to the backend API (default `http://localhost:5000`).

Optional: to point the frontend at a different backend URL, create a `.env.local` in the `frontend/` folder and set:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Environment & configuration

- `PORT` — Port the server listens on. Defaults to 3000 if not provided.
- `MONGODB_URI` — MongoDB connection string.
- `JWT_SECRET` — Secret used to sign JWT tokens for authentication.

If you're using MongoDB Atlas, use the connection string format provided by Atlas and ensure network access is configured.

## Scripts

- `npm start` — start the app with Node
- `npm run dev` — start the app with nodemon for development
- `npm test` — placeholder (no tests configured)

## How to use

1. Visit `/signup` to create an account (or use the API endpoint in `Routes/authRoutes.js`).
2. Log in via `/login` to receive a JWT token stored in a cookie/localStorage (depending on frontend behavior).
3. Use the admin views (`/admin` or `views/admin.ejs`) to add or manage cars.
4. Navigate to `/cars` to view available cars and `/bookings` to manage bookings.

## Notes & next steps

- Add unit and integration tests (Jest or Mocha + Supertest).
- Harden security: rate limiting, helmet, input validation, strict CORS policies.
- Add API docs (Swagger/OpenAPI) and Postman collection.
- Add CI (GitHub Actions) for linting and tests.

## Contributing

Feel free to open issues or submit pull requests. For major changes, open an issue first to discuss what you'd like to change.

## License

ISC
