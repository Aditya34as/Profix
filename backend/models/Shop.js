const mongoose = require('mongoose');

// Full GeoJSON Point — only used when both fields are set (register or dashboard)
const PointSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator(v) {
          return Array.isArray(v) && v.length === 2 && v.every((n) => typeof n === 'number' && Number.isFinite(n));
        },
        message: 'coordinates must be [longitude, latitude]',
      },
    },
  },
  { _id: false }
);

const ShopSchema = new mongoose.Schema({
  businessName: { type: String, required: true, trim: true },
  ownerName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  whatsappNumber: { type: String, default: '' },

  services: [{
    type: String,
    enum: ['ac-repair', 'plumbing', 'water-heater', 'electrical', 'carpentry', 'painting', 'cleaning', 'pest-control'],
  }],

  address: {
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    pincode: { type: String, default: '' },
  },

  // Optional — omit entirely until owner adds pin (registration never requires coords)
  location: { type: PointSchema, required: false },

  description: { type: String, default: '' },
  openingHours: { type: String, default: 'Mon-Sat 8AM-8PM' },
  profileImage: { type: String, default: '' },
  galleryImages: [{ type: String }],

  isApproved: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now },
});

// Drop partial/invalid location (avoids "coordinates required" when type/Point was set without coords)
ShopSchema.pre('validate', function (next) {
  const loc = this.location;
  if (loc == null) return next();
  const c = loc.coordinates;
  const ok =
    Array.isArray(c) &&
    c.length === 2 &&
    c.every((n) => typeof n === 'number' && Number.isFinite(n));
  if (!ok) {
    this.set('location', undefined);
  }
  next();
});

ShopSchema.index({ location: '2dsphere' }, { sparse: true });

ShopSchema.index({ businessName: 'text', description: 'text', 'address.city': 'text' });

module.exports = mongoose.model('Shop', ShopSchema);
