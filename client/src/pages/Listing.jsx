import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import { FaShare } from 'react-icons/fa';
import Contact from '../components/Contact';

SwiperCore.use([Navigation]);

export default function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const { currentUser } = useSelector((state) => state.user);
  const [newMessage, setNewMessage] = useState('');
  const [remainingTime, setRemainingTime] = useState('');
  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();

        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:5000');
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.listingId === params.listingId) {
          setListing(prevListing => ({
            ...prevListing,
            bids: [
              ...prevListing.bids,
              { amount: message.bid }
            ]
          }));
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };
    return () => {
      ws.close();
    };
  }, [params.listingId]);

  useEffect(() => {
    if (listing) {
      const updateRemainingTime = () => {
        const endTime = new Date(listing.auctionEndDate).getTime();
        const now = new Date().getTime();
        const timeLeft = endTime - now;

        if (timeLeft <= 0) {
          setRemainingTime('Auction ended');
          return;
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        setRemainingTime(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      };

      const timer = setInterval(updateRemainingTime, 1000);
      return () => clearInterval(timer);
    }
  }, [listing]);

  const handleBid = async () => {
    const currentHighestBid = listing.bids.length > 0
      ? Math.max(...listing.bids.map(bid => bid.amount))
      : listing.startingPrice;

    if (bidAmount <= currentHighestBid) {
      alert('Bid amount must be higher than the current highest bid.');
      return;
    }

    try {
      const res = await fetch(`/api/listing/bid/${params.listingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bid: bidAmount, userId: currentUser._id }),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(true);
      }
      setBidAmount('');
    } catch (error) {
      alert('Error placing bid.');
    }
  };

  const handlePostMessage = async () => {
    try {
      const res = await fetch(`/api/listing/message/${params.listingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: newMessage, userId: currentUser._id }),
      });
      const data = await res.json();
      if (data.success) {
      
        setListing((prevListing) => ({
          ...prevListing,
          messages: [...prevListing.messages, { titleRef: prevListing.title, writer: currentUser._id, message: newMessage }],
        }));
        setNewMessage('');
      } else {
        setError(true);
      }
    } catch (error) {
      alert('Error posting message.');
    }
  };

  return (
    <main>
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && (
        <p className='text-center my-7 text-2xl'>Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className='h-[550px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}
          <div className='flex flex-col max-w-4xl mx-auto p-6 my-10 bg-gray-100 rounded-lg shadow-md gap-6'>
            <p className='text-3xl font-bold text-slate-700'>{listing.title}</p>
            <div className='text-slate-800 space-y-2'>
              <p>
                <span className='font-semibold text-black'>Description - </span>
                {listing.description}
              </p>
              <p>
                <span className='font-semibold text-black'>Category - </span>
                {listing.category}
              </p>
              <p>
                <span className='font-semibold text-black'>Condition - </span>
                {listing.condition}
              </p>
              <p>
                <span className='font-semibold text-black'>Status - </span>
                {listing.status}
              </p>
              <p>
                <span className='font-semibold text-black'>Time left: </span>
                {remainingTime}
              </p>
            </div>
            <div className='flex flex-col md:flex-row gap-6 text-slate-800'>
              <p>
                <span className='font-semibold text-black'>Starting Price - </span>
                {listing.startingPrice ? listing.startingPrice.toLocaleString('en-US') : listing.startingPrice.toLocaleString('en-US')}
              </p>
              <p>
                <span className='font-semibold text-black'>Current Price - </span>
                {listing.bids.length > 0 ? Math.max(...listing.bids.map(bid => bid.amount)).toLocaleString('en-US') : listing.startingPrice.toLocaleString('en-US')}
              </p>
            </div>
            {currentUser && listing.userRef !== currentUser._id && currentUser.userType === 'buyer' && (
              <div className='flex flex-col md:flex-row items-center gap-4'>
                <input
                  type='number'
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className='border border-slate-300 p-3 rounded-lg w-full md:w-auto'
                  placeholder='Enter your bid'
                />
                <button
                  onClick={handleBid}
                  className='bg-red-500 text-white rounded-lg px-5 py-3 hover:bg-red-600 transition duration-200'
                >
                  Make Bid
                </button>
              </div>
            )}
            {currentUser && !contact && currentUser.userType === 'buyer' &&  (
              <button
                onClick={() => setContact(true)}
                className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'
              >
                Contact listing agent
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  );
}
