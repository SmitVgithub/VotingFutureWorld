const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Email validation regex
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Ethereum address validation regex (if election_address is a blockchain address)
const addressRegex = /^0x[a-fA-F0-9]{40}$/;

//Define a schema
const Schema = mongoose.Schema;
const VoterSchema = new Schema ({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [emailRegex, 'Please provide a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Password must be at least 8 characters long']
    },
    election_address: {
        type: String,
        required: true,
        trim: true,
        match: [addressRegex, 'Please provide a valid election address']
    }
});

// Exclude password from JSON serialization
VoterSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        delete ret.password;
        return ret;
    }
});

VoterSchema.set('toObject', {
    transform: function(doc, ret, options) {
        delete ret.password;
        return ret;
    }
});

// hash user password before saving into database (only if modified)
VoterSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }
    
    try {
        // Use async hash instead of sync to avoid blocking event loop
        this.password = await bcrypt.hash(this.password, saltRounds);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
VoterSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('VoterList', VoterSchema);