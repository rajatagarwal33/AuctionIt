import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';



export default function Home() {

  const [offerListings, setOfferListings] = useState([]);

  const [notifications, setNotifications] = useState([]);

  SwiperCore.use([Navigation]);
  console.log(offerListings);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?limit=6');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notification/get?limit=4');
        const data = await res.json();
        console.log(data);
        setNotifications(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
    fetchNotifications();

  }, []);

  return (
    <div>
      {/* top */}
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Discover your next <span className='text-slate-500'>great deal</span>
          <br />
          at our auction
        </h1>
        <div className='text-gray-400 text-xs sm:text-sm'>
          AuctionIt is the best place to find your next amazing deal.
          <br />
          We offer a wide variety of items for you to bid on.
        </div>
        <Link
          to={'/search'}
          className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'
        >
          Start bidding now...
        </Link>
      </div>


      
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className='h-[400px]'
                key={listing._id}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

     

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListings && offerListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Newest auctions</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?'}>Show more</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>

       {/* Notifications */}
      <div className='max-w-6xl mx-auto p-3 my-10'>
        <div className='bg-gray-100 p-6 rounded-lg shadow-md'>
          <h2 className='text-2xl font-semibold text-slate-600 mb-4'>Notifications</h2>
          <ul className='space-y-4'>
            {notifications.map(notification => (
              <li key={notification._id} className='bg-white p-4 rounded-lg shadow-sm'>
                <h3 className='text-xl font-medium text-slate-700'>{notification.auctionTitle}</h3>
                <p className='text-slate-600'>{notification.message}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
