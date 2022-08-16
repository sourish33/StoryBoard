const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    googleId: {
        type: String,
    },
    displayName: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
    },
    liked: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Story' 
    }],
    role: {
        type: String,
        enum : ['guest', 'user','admin'],
        default: 'user'
    },
})

UserSchema.set('timestamps', true)

module.exports = mongoose.model('User', UserSchema);