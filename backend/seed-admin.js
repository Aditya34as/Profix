/**
 * seed-admin.js — Create the first admin user
 * 
 * Usage:
 *   node seed-admin.js
 * 
 * Reads ADMIN_EMAIL and ADMIN_PASSWORD from .env
 * Idempotent — won't create duplicates
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const MONGODB_URI = process.env.MONGODB_URI;

async function seedAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    // Check if admin already exists
    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      if (existing.role === 'admin') {
        console.log(`✅ Admin already exists: ${ADMIN_EMAIL}`);
      } else {
        // Upgrade existing customer to admin
        existing.role = 'admin';
        await existing.save();
        console.log(`🔄 Upgraded existing user to admin: ${ADMIN_EMAIL}`);
      }
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

    // Create admin user
    const admin = new User({
      name: 'Admin',
      email: ADMIN_EMAIL,
      password: hashedPassword,
      phone: '',
      role: 'admin',
    });

    await admin.save();
    console.log(`\n🎉 Admin user created successfully!`);
    console.log(`   Email:    ${ADMIN_EMAIL}`);
    console.log(`   Password: (as set in .env ADMIN_PASSWORD)`);
    console.log(`\n   Sign in at /auth as "Customer" with these credentials.\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
}

seedAdmin();
