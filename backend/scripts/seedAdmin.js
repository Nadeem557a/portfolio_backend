const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
require('dotenv').config({ path: __dirname + '/../.env' });

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    const email = 'm.nadeemakhtarr@gmail.com';
    const password = '@mrnadeem';
    const twoStepCode = '2610';

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log('⚠️ Admin already exists. Deleting to recreate...');
      await Admin.deleteOne({ email });
    }

    // Hash password and 2-step code
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const hashedTwoStepCode = await bcrypt.hash(twoStepCode, salt);

    // Create new admin
    const admin = new Admin({
      email,
      password: hashedPassword,
      twoStepCode: hashedTwoStepCode
    });

    await admin.save();
    console.log('✅ Admin user created successfully.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
