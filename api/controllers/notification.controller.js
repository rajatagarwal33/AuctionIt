import Notification from "../models/notification.model.js";
import { errorHandler } from "../utils/error.js";


export const createNotification = async (req, res, next) => {
  try {
    const { auctionTitle } = req.body;
    
    // Check if a notification with the same auctionTitle already exists
    const existingNotification = await Notification.findOne({ auctionTitle });
    console.log(existingNotification);
    if (existingNotification) {
      // If a notification with the same auctionTitle exists, update it
      existingNotification.message = req.body.message; // Update other fields as needed
      await existingNotification.save();
      return res.status(200).json(existingNotification); // Return the updated notification
    } else {
      // If no notification with the same auctionTitle exists, create a new one
      const notification = await Notification.create(req.body);
      return res.status(201).json(notification);
    }
  } catch (error) {
    next(error);
  }
};


export const deleteNotification = async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(errorHandler(404, 'notification not found!'));
  }

  try {
    await notification.findByIdAndDelete(req.params.id);
    res.status(200).json('notification has been deleted!');
  } catch (error) {
    next(error);
  }
};

  export const getNotifications = async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit) || 8;
      const startIndex = parseInt(req.query.startIndex) || 0;

      const sort = req.query.sort || 'createdAt';
  
      const order = req.query.order || 'desc';
  
      const notifications = await Notification.find()
        .sort({ [sort]: order })
        .limit(limit)
        .skip(startIndex);
  
      return res.status(200).json(notifications);
    } catch (error) {
      next(error);
    }
  };

