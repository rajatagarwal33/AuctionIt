import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Search() {
    const navigate = useNavigate();
    const [sidebardata, setSidebardata] = useState({
        searchTerm : '',
        category: 'all',
        condition: 'all',
        sort: 'created_at',
        order: 'desc',
    });

    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [showMore, setShowMore] = useState(false);
    console.log(listings);
  
    useEffect(() => {
      const urlParams = new URLSearchParams(location.search);
      const searchTermFromUrl = urlParams.get('searchTerm');
      const categoryFromUrl = urlParams.get('category');
      const conditionFromUrl = urlParams.get('condition');
      const sortFromUrl = urlParams.get('sort');
      const orderFromUrl = urlParams.get('order');
  
      if (
        searchTermFromUrl ||
        categoryFromUrl ||
        conditionFromUrl ||
        sortFromUrl ||
        orderFromUrl
      ) {
        setSidebardata({
          searchTerm: searchTermFromUrl || '',
          category: categoryFromUrl || 'all',
          condition: conditionFromUrl || 'all',
          sort: sortFromUrl || 'created_at',
          order: orderFromUrl || 'desc',
        });
      }
  
      const fetchListings = async () => {
        setLoading(true);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        if (data.length > 7){
          setShowMore(true);
        }
        setListings(data);
        setLoading(false);
      };
  
      fetchListings();
    }, [location.search]);
  
    const handleChange = (e) => {

        console.log('Clicked ID:', e.target.id);
        console.log('Sidebar Category:', sidebardata.category);

        if (
            e.target.id === 'Artifacts' ||
            e.target.id === 'Electronics' ||
            e.target.id === 'Wearables' ||
            e.target.id === 'Automotives' ||
            e.target.id === 'Sports' ||
            e.target.id === 'Books-and-media' ||
            e.target.id === 'Others'
          ) {
            setSidebardata({ ...sidebardata, category: e.target.id });
          }
          
          if (
            e.target.id === 'Mint' ||
            e.target.id === 'Fine' ||
            e.target.id === 'Worn-out' ||
            e.target.id === 'Damaged'
          ) {
            setSidebardata({ ...sidebardata, condition: e.target.id });
          }
          
      if (e.target.id === 'searchTerm') {
        setSidebardata({ ...sidebardata, searchTerm: e.target.value });
      }
  
  
      if (e.target.id === 'sort_order') {
        const sort = e.target.value.split('_')[0] || 'created_at';
        console.log(e.target.value);
  
        const order = e.target.value.split('_')[1] || 'desc';
  
        setSidebardata({ ...sidebardata, sort, order });
      }
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      const urlParams = new URLSearchParams();
      urlParams.set('searchTerm', sidebardata.searchTerm);
      urlParams.set('category', sidebardata.category);
      urlParams.set('condition', sidebardata.condition);
      urlParams.set('sort', sidebardata.sort);
      urlParams.set('order', sidebardata.order);
      const searchQuery = urlParams.toString();
      navigate(`/search?${searchQuery}`);
    };

    const onShowMoreClick = async () => {
      const numberOfListings = listings.length;
      const startIndex = numberOfListings;
      const urlParams = new URLSearchParams(location.search);
      urlParams.set('startIndex', startIndex);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length < 8) {
        setShowMore(false);
      }
      setListings([...listings, ...data]);
    };


  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7  border-b-2 md:border-r-2 md:min-h-screen w-full md:w-1/3'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>Search Term:</label>
            <input
              type='text'
              id='searchTerm'
              placeholder='Search...'
              className='border rounded-lg p-3 w-full'
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div> 
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Category:</label>
            <div className='flex gap-2'>
              <input type='checkbox' id='Artifacts' className='w-5' 
              onChange={handleChange}
              checked={sidebardata.category === 'Artifacts'}
              />
              <span>Artifacts</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='Wearables' className='w-5'
              onChange={handleChange}
              checked={sidebardata.category === 'Wearables'}
              />
              <span>Wearables</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='Electronics' className='w-5'
              onChange={handleChange}
              checked={sidebardata.category === 'Electronics'}
              />
              <span>Electronics</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='Automotives' className='w-5'
              onChange={handleChange}
              checked={sidebardata.category === 'Automotives'}
              />
              <span>Automotives</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='Sports' className='w-5'
              onChange={handleChange}
              checked={sidebardata.category === 'Sports'}
              />
              <span>Sports</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='Books-and-media' className='w-5'
              onChange={handleChange}
              checked={sidebardata.category === 'Books-and-media'}
              />
              <span>Books and Media</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='Others' className='w-5' 
              onChange={handleChange}
              checked={sidebardata.category === 'Others'}/>
              <span>Others</span>
            </div>
          </div>
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Condition:</label>
            <div className='flex gap-2'>
              <input type='checkbox' id='Mint' className='w-5'
              onChange={handleChange}
              checked={sidebardata.condition === 'Mint'}
              />
              <span>Mint</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='Fine' className='w-5'
              onChange={handleChange}
              checked={sidebardata.condition === 'Fine'}
              />
              <span>Fine</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='Worn-out' className='w-5'
              onChange={handleChange}
              checked={sidebardata.condition === 'Worn-out'}
              />
              <span>Worn out</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='Damaged' className='w-5' 
              onChange={handleChange}
              checked={sidebardata.condition === 'Damaged'}
              />
              <span>Damaged</span>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Sort:</label>
            <select onChange={handleChange} defaultValue={'created_at_desc'} id='sort_order' className='border rounded-lg p-3'>
              <option value={'createdAt_desc'}> Latest</option>
              <option value={'createdAt_asc'}>Oldest</option>
              <option value={'startingPrice_desc'}>Starting Price high to low</option>
              <option value={'startingPrice_asc'}>Starting Price low to hight</option>
            </select>
          </div>
          <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
            Search
          </button>
        </form>
      </div>
      <div className='flex-1'>
        <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Listing results:</h1>
        <div className='p-7 flex flex-wrap gap-4'>
        {!loading && listings.length === 0 && (
            <p className='text-xl text-slate-700'>No listing found!</p>
          )}
          {loading && (
          <p className='text-xl text-slate-700 text-center w-full'>
            Loading...
          </p>
        )}

        {!loading &&
          listings &&
          listings.map((listing) => (
            <ListingItem key={listing._id} listing={listing} />
          ))}
       {showMore && (
          <button
            onClick={onShowMoreClick}
            className='text-green-700 hover:underline p-7 text-center w-full'
          >
            Show more
          </button>
          )}
        </div>
      </div>

    </div>
  );
}