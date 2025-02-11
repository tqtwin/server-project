const mongoose = require('mongoose');

const websiteInfoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    facebook: {typle:String },
    tiktok: { type: String },
    twitter: { type: String },
    instagram: { type: String },
    about: { type: String },
    privacyPolicy: { type: String },
    address: { type: String },
    phone: { type: String },
    status: { type: String },
    avatar: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const WebsiteInformation = mongoose.model('WebsiteInformation', websiteInfoSchema);
module.exports = WebsiteInformation;
