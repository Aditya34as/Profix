const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  serviceRequested: { type: String, required: true },
  message: { type: String },
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', default: null },
  customerLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: undefined
    }
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'completed', 'cancelled'],
    default: 'new'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lead', LeadSchema);
