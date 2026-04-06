const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema({
  businessName: { type: String, required: true, trim: true },
  ownerName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  whatsappNumber: { type: String, default: '' },

  // Services offered
  services: [{
    type: String,
    enum: ['ac-repair', 'plumbing', 'water-heater', 'electrical', 'carpentry', 'painting', 'cleaning', 'pest-control']
  }],

  // Address
  address: {
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    pincode: { type: String, default: '' }
  },

  // GeoJSON for 2dsphere geo-queries
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },

  // Profile
  description: { type: String, default: '' },
  openingHours: { type: String, default: 'Mon-Sat 8AM-8PM' },
  profileImage: { type: String, default: '' },
  galleryImages: [{ type: String }],

  // Platform
  isApproved: { type: Boolean, default: false }, // Requires admin approval
  isActive: { type: Boolean, default: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now }
});

// 2dsphere index for geo-queries ($near, $geoWithin)
ShopSchema.index({ location: '2dsphere' });

// Text index for search
ShopSchema.index({ businessName: 'text', description: 'text', 'address.city': 'text' });

module.exports = mongoose.model('Shop', ShopSchema);
