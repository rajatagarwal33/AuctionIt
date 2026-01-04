
import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(

    {
        auctionTitle:{type: String, required: true, unique: true}, 
        message:{type: String , required: true}
    }

);


const Notification = mongoose.model('Notification',NotificationSchema);

export default Notification;