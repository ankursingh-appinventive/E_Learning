import mongoose from 'mongoose'

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isActive: {
        type: Boolean,
        default: false
    },
    deviceId: {
        type: String,
        required: true
    }
},{timestamps:true});

const Session = mongoose.model('Session', sessionSchema)

export {Session};