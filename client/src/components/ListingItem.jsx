import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MdLocationOn } from 'react-icons/md';

// Utility function to calculate the remaining time
const calculateRemainingTime = (endDate) => {
  
  const now = new Date();
  const end = new Date(endDate);
  const timeDiff = end - now;

  if (timeDiff <= 0) {
    return { time: 'Auction ended', ended: true };
  }

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeDiff / 1000 / 60) % 60);
  const seconds = Math.floor((timeDiff / 1000) % 60);

  return { time: `${days}d ${hours}h ${minutes}m ${seconds}s`, ended: false };
};

export default function ListingItem({ listing }) {
  const [remainingTime, setRemainingTime] = useState(calculateRemainingTime(listing.auctionEndDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime(calculateRemainingTime(listing.auctionEndDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [listing.auctionEndDate]);

  return (
    <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]'>
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls[0]}
          alt='listing cover'
          className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
        />
        <div className='p-3 flex flex-col gap-2 w-full'>
          <p className='truncate text-lg font-semibold text-slate-700'>
            {listing.title}
          </p>
          <p className='text-sm text-black-600 line-clamp-2'>
            {listing.description}
          </p>
          <p className='text-slate-500 mt-2 font-semibold '>
            Starting Price: ${listing.startingPrice}
          </p>
          <div className='flex gap-4'>
            <div className='font-bold text-xs'>
              Category: {listing.category}
            </div>
            <div className='font-bold text-xs'>
              Condition: {listing.condition}
            </div>
            <div className='font-bold text-xs'>
              Status: {listing.status}
            </div>
          </div>
          <div
            className={`mt-2 text-sm font-bold ${
              remainingTime.ended ? 'text-red-500' : 'text-black'
            }`}
          >
            Time left: {remainingTime.time}
          </div>
        </div>
      </Link>
    </div>
  );
}
