const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    favoriteColor: { type: String, required: true },
    birthday: { type: Date, required: true },
    notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);