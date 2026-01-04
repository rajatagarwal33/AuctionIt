import { createNotification } from '../controllers/notification.controller.js';
import Listing from '../models/listing.model.js';
import Notification from '../models/notification.model.js';

export const manageNotification = async () => {
  try {
    const listings = await Listing.find({ status: 'Active' });
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 2); // Adjust for time zone offset

    listings.forEach(async listing => {
      const auctionEndDate = new Date(listing.auctionEndDate);
      const timeRemaining = auctionEndDate - currentTime;

      if (timeRemaining <= 3600000 && timeRemaining > 3500000) { // Between 60 and 58 minutes remaining
       

        const notificationData = {
          auctionTitle: listing.title,
          message: 'One hour left for the auction!',
        };

        await createNotification({ body: notificationData }, {
          status: (code) => ({ json: (data) => data }), 
        }, (err) => { if (err) throw err; });
      }
    });
  } catch (error) {
    console.error('Error managing notifications:', error);
  }
};


export const removeNotificationsForClosedAuctions = async () => {
    try {
      const currentTime = new Date();
      currentTime.setHours(currentTime.getHours() + 2); // Error off two hour on my computer 
      const endedListings = await Listing.find({ auctionEndDate: { $lt: currentTime }, status: 'Active' });
  
      endedListings.forEach(async listing => {
        await Notification.deleteMany({ auctionTitle: listing.title });
        listing.status = 'Ended';
        await listing.save();
      });
    } catch (error) {
      console.error('Error removing notifications for closed auctions:', error);
    }
  };