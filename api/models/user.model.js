
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        //unique: true
    },
    email: {
        type: String,
        required: true,
        // unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    },
    userType: {
        type: String,
        enum: ['buyer', 'seller'], // Enumerated values for buyer and seller
        required: true
    }
}, { timestamps: true });


userSchema.index({ email: 1, userType: 1 }, { unique: true });
const User = mongoose.model('User', userSchema);
export default User;
