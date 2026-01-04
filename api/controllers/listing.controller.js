
import { error } from 'console';
import Listing from '../models/listing.model.js';
import { errorHandler } from "../utils/error.js";

let wss;

export const setWebSocketServer = (webSocketServer) => {
  wss = webSocketServer;
};

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, req.user.id));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only update your own listings!'));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};



// error is not working for this update and delete. 


export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    //convertion between time stored in mongoDB and html format 
    const formattedEndDate = listing.auctionEndDate.toISOString().slice(0, 16);
    const formattedListing = {
      ...listing.toJSON(),
      auctionEndDate: formattedEndDate
    };

    res.status(200).json(formattedListing);
  } catch (error) {
    next(error);
  }
  
  };

  export const getListings = async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit) || 8;
      const startIndex = parseInt(req.query.startIndex) || 0;
  
      let condition = req.query.condition;
      if (condition === undefined || condition === 'all') {
        condition = { $in: ['Mint', 'Fine', 'Worn Out', 'Damaged'] };
      }
  
      let category = req.query.category;
      if (category === undefined || category === 'all') {
        category = { $in: ['Artifacts', 'Wearables', 'Electronics', 'Automotives', 'Sports', 'Books and Media', 'Others'] };
      }
  
      const searchTerm = req.query.searchTerm || '';
      const sort = req.query.sort || 'createdAt';
      const order = req.query.order || 'desc';
  
      const listings = await Listing.find({
        title: { $regex: searchTerm, $options: 'i' },
        condition,
        category,
      })
        .sort({ [sort]: order })
        .limit(limit)
        .skip(startIndex);
  
      return res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  };


  export const makeBid = async (req, res, next) => {
    try {
      const listing = await Listing.findById(req.params.id);
      if (!listing) {
        return next(errorHandler(404, 'Listing not found!'));
      }
  
      const { bid, userId } = req.body;
  
      listing.bids.push({ amount: bid, bidder: userId });
      await listing.save();
  
      // Broadcast the new bid to all connected clients
      console.log("gets here");
      //console.log(wss);
      
      wss.clients.forEach(client => {
        
        
        if (client.readyState === 1) {
        client.send(JSON.stringify({ listingId: req.params.id, bid }));
        }
        });
  
  
      return res.status(201).json(listing);
    } catch (error) {
      next(error);
    }
  };



  export const createMessage = async (req, res, next) => {
    const { auctionId } = req.params;
    console.log(req.params);
  
  
    try {

  
      // Fetch the listing to get its title
      const listing = await Listing.findById(auctionId);
  
      if (!listing) {
        return next(errorHandler(404, 'Listing not found!'));
      }

      const { writter2, message2 } = req.body;
      const titleRef2 = listing.title;

      listing.messages.push({titleRef: titleRef2, writter: writter2 , message: message2 })
  
      await listing.save();

     
      // Respond with success message
      return res.status(201).json(listing);
    } catch (error) {
      next(error);
    }
  };






