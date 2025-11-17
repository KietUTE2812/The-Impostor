const WordBank = require('../models/WordBank');

// Sample data for initial setup
const sampleWords = [
  {
    category: "Animals",
    keywords: ["Penguin", "Elephant", "Kangaroo", "Whale", "Dolphin", "Tiger", "Eagle", "Panda"]
  },
  {
    category: "Sports",
    keywords: ["Goalkeeper", "Basketball", "Touchdown", "Homerun", "Referee", "Tennis", "Swimming", "Boxing"]
  },
  {
    category: "Jobs",
    keywords: ["Doctor", "Programmer", "Teacher", "Chef", "Firefighter", "Pilot", "Nurse", "Engineer"]
  },
  {
    category: "Foods",
    keywords: ["Pizza", "Sushi", "Burger", "Pasta", "Taco", "Sandwich", "Salad", "Ramen"]
  },
  {
    category: "Countries",
    keywords: ["Japan", "France", "Brazil", "Egypt", "Canada", "Australia", "Italy", "Mexico"]
  },
  {
    category: "Movies",
    keywords: ["Titanic", "Avatar", "Inception", "Frozen", "Joker", "Superman", "Spiderman", "Batman"]
  },
  {
    category: "Fruits",
    keywords: ["Apple", "Banana", "Orange", "Strawberry", "Mango", "Pineapple", "Watermelon", "Grape"]
  },
  {
    category: "Vehicles",
    keywords: ["Bicycle", "Motorcycle", "Airplane", "Helicopter", "Train", "Boat", "Submarine", "Rocket"]
  }
];

async function seedDatabase() {
  try {
    // Clear existing data
    await WordBank.deleteMany({});
    console.log('Cleared existing word banks');

    // Insert sample data
    await WordBank.insertMany(sampleWords);
    console.log('Successfully seeded database with sample words');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  require('dotenv').config();
  const mongoose = require('mongoose');
  
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('Connected to MongoDB');
      return seedDatabase();
    })
    .catch(err => {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    });
}

module.exports = seedDatabase;
