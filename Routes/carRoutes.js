const express = require("express");
const auth = require("../middleware/auth");

const router = express.Router();
const Car = require("../models/Car");
const Booking = require("../models/Booking");

// add a car(only admin can do this)
router.post("/", auth(["admin"]), async (req, res) => {
  const car = new Car(req.body);
  try {
    await car.save();
    res.status(201).json(car);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    // Support filtering by location, availability, type and price range
    const { location, available, type, minPrice, maxPrice } = req.query;
    const filter = {};
    if (location) filter.location = { $regex: location, $options: "i" };
    if (type) filter.type = { $regex: `^${type}$`, $options: "i" };
    if (minPrice || maxPrice) {
      filter.pricePerDay = {};
      if (minPrice) filter.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerDay.$lte = Number(maxPrice);
    }

    const cars = await Car.find(filter);

    // Check booking status for each car
    const carsWithAvailability = await Promise.all(
      cars.map(async (car) => {
        const today = new Date();
        const activeBookings = await Booking.find({
          carId: car._id,
          status: "booked",
          endDate: { $gte: today },
        });

        // Car is available if no active bookings
        const isAvailable = activeBookings.length === 0;

        return {
          ...car.toObject(),
          availability: isAvailable,
        };
      })
    );

    // If client requested only available cars, filter them
    const result = available === "true" ? carsWithAvailability.filter(c => c.availability) : carsWithAvailability;

    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a car (admin only)
router.delete("/:id", auth(["admin"]), async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.json({ message: "Car deleted successfully", car });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
