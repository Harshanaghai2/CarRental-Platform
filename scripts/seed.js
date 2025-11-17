require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Car = require('../models/Car');

async function main() {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not set in environment. Aborting.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB for seeding');

  // Create admin user if not exists
  const adminEmail = 'admin@demo.com';
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    const passwordHash = await bcrypt.hash('password', 10);
    admin = new User({ name: 'Admin', email: adminEmail, password: passwordHash, role: 'admin' });
    await admin.save();
    console.log('Created admin user:', adminEmail, 'password: password');
  } else {
    console.log('Admin user already exists:', adminEmail);
  }

  // Seed cars if none exist
  const count = await Car.countDocuments();
  if (count === 0) {
    const cars = [
      { model: 'Toyota Corolla', type: 'Sedan', pricePerDay: 45, availability: true, location: 'San Francisco', image: 'https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=6b5b6c1b6a1f9b2e6d2f8f3e4b1a9d2c' },
      { model: 'Honda Civic', type: 'Sedan', pricePerDay: 50, availability: true, location: 'Los Angeles', image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=8f9d4c6e2a6b1c3d4e5f6a7b8c9d0e1f' },
      { model: 'Ford Explorer', type: 'SUV', pricePerDay: 85, availability: true, location: 'San Diego', image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=2a3e4d5c6b7a8e9f0d1c2b3a4e5f6a7b' },
      { model: 'Tesla Model 3', type: 'Electric', pricePerDay: 120, availability: true, location: 'San Francisco', image: 'https://images.unsplash.com/photo-1549921296-3f2f1b0dfe0b?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d' },
      { model: 'BMW 3 Series', type: 'Luxury', pricePerDay: 140, availability: true, location: 'New York', image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f' }
    ];

    await Car.insertMany(cars);
    console.log('Inserted sample cars with images');
  } else {
    console.log('Cars already present, updating any placeholder images if needed. Found:', count);
    // Update any cars that still use placeholder image to have realistic images
    const placeholder = '/car-placeholder.svg';
    const replacements = [
      'https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=6b5b6c1b6a1f9b2e6d2f8f3e4b1a9d2c',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=8f9d4c6e2a6b1c3d4e5f6a7b8c9d0e1f',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=2a3e4d5c6b7a8e9f0d1c2b3a4e5f6a7b',
      'https://images.unsplash.com/photo-1549921296-3f2f1b0dfe0b?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d',
      'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f'
    ];
    const toUpdate = await Car.find({ image: placeholder }).limit(replacements.length);
    for (let i = 0; i < toUpdate.length; i++) {
      toUpdate[i].image = replacements[i % replacements.length];
      await toUpdate[i].save();
      console.log('Updated car image for', toUpdate[i].model);
    }
  }

  await mongoose.disconnect();
  console.log('Seeding finished');
  process.exit(0);
}

main().catch(err => {
  console.error('Seeding failed', err);
  process.exit(1);
});
