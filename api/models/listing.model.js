
import mongoose from 'mongoose';

const auctionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    startingPrice: {
      type: Number,
      required: true,
    },
    // currentBid: {
    //   type: Number,
    //   default: 0, 
    // },

    auctionEndDate: {
      type: Date,
      required: true,
    },
    userRef: {
      //type: mongoose.Schema.Types.ObjectId,
      type: String,
      //ref: 'User', // Reference to the user who listed the item
      required: true,
    },
    bids: [
      {
        bidder: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User', // Reference to the user making the bid
        },
        amount: {
          type: Number,
          required: false,
        },
        // bidTime: {
        //   type: Date,
        //   default: Date.now,
        // },
      },
    ],

    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the user who won the auction
    },
    status: {
      type: String,
      enum: ['Active', 'Ended'],
      default: 'Active',
    },
    category: {
      type: String,
      enum: ['Artifacts', 'Wearables', 'Electronics', 'Automotives', 'Sports', 'Books and Media', 'Others'], 
      required: true,
    },
    condition: {
      type: String,
      enum: ['Mint', 'Fine', 'Worn Out', 'Damaged'], 
      required: true,
    },
    imageUrls: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model('Auction', auctionSchema);

export default Listing; 