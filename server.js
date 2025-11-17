const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
// require("dotenv").config
require("dotenv").config();

const app = express();

// Serve static files (public assets)
app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//importing all routers
// const userRoutes = import("./Routes/userRoutes");
// const carRoutes = import("./Routes/carRoutes");
// const bookingRoutes = import("./Routes/bookingRoutes")
const userRoutes = require("./Routes/userRoutes");
const carRoutes = require("./Routes/carRoutes");
const bookingRoutes = require("./Routes/bookingRoutes");

const authRoutes = require("./Routes/authRoutes");

// API routes
app.use("/auth", authRoutes);

app.use("/users", userRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/bookings", bookingRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Basic root to indicate API-only server (frontend is handled separately)
app.get("/", (req, res) => {
  res.json({ message: "API server - frontend is served separately (see /frontend)." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on PORT : ${PORT}`);
});
