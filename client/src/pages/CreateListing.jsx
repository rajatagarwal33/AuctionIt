
import React, { useState } from 'react';
import {getDownloadURL, getStorage, uploadBytesResumable, ref} from 'firebase/storage';
import {app} from '../firebase';
import {useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
  const {currentUser} = useSelector(state => state.user);
  const [files, setFiles] = useState([]);
  const [error , setError] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); 
  const [uploading, setUploading] = useState(false);
  const currentDate = new Date();
  const defaultEndDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7); // Setting default end date to 7 days from today
  const defaultEndDateString = defaultEndDate.toISOString().slice(0, 16);
  const [formData, setFormData] = useState({
    imageUrls: [],
    title: '',
    description: '',
    startingPrice: 0,
    auctionEndDate: defaultEndDateString,
    category: 'Artifacts',
    condition: 'Mint',
  });
  
  const [imageUploadError, setImageUploadError] = useState(false);
  console.log(formData);
  const handelImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for(let i = 0; i < files.length; i++){
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises).then((urls) => {
        setFormData({...formData, imageUrls: formData.imageUrls.concat(urls)});
        setImageUploadError(false);
        setUploading(false);
        
      }).catch((err) => {
        setImageUploadError('Image upload fail (2MB max per image)');
        setUploading(false);
        
      });
    }else {
      setImageUploadError(' You can only upload 6 images per listing');
      setUploading(false);

    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };
  const handleChange = (e) => {

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'||
       e.target.type === 'datetime-local' ||
       e.target.type === 'select-one'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }



  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');
      setLoading(true);
      setError(false);
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime()+file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}%`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });        
        }
      );
    });
  };
  return (
    
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Create an Auction Listing
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='Title'
            className='border p-3 rounded-lg'
            id='title'
            maxLength='62'
            minLength='5'
            required
            onChange={handleChange}
            value={formData.title}
          />
          <textarea
            placeholder='Description'
            className='border p-3 rounded-lg'
            id='description'
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type='number'
            placeholder='Starting Price'
            className='border p-3 rounded-lg'
            id='startingPrice'
            min='1'
            required
            onChange={handleChange}
            value={formData.startingPrice}
          />

          <input
            type='datetime-local'
            placeholder='Auction End Date' 
            className='border p-3 rounded-lg'
            id='auctionEndDate'
            required
            onChange={handleChange}
            value={formData.auctionEndDate}
          />


<select
      className='border p-3 rounded-lg'
      id='category'
      required
      type='text'
      onChange={handleChange}
      value={formData.category}
      
    >
      <option value=''>Select Category</option>
      {['Artifacts', 'Wearables', 'Electronics', 'Automotives', 'Sports', 'Books and Media', 'Others'].map((category) => (
        <option key={category} value={category}>{category}</option>
      ))}
    </select>
    <select
      className='border p-3 rounded-lg'
      id='condition'
      required
      type='text'
      onChange={handleChange}
      value={formData.condition}
      
    >
      <option value=''>Select Condition</option>
      {['Mint', 'Fine', 'Worn Out', 'Damaged'].map((condition) => (
        <option key={condition} value={condition}>{condition}</option>
      ))}
    </select>

          <div className='flex gap-4'>
            <input onChange={(e) =>setFiles(e.target.files)}
              className='p-3 border border-gray-300 rounded w-full'
              type='file'
              id='imageUrls'
              accept='image/*'
              multiple
            />
            <button disabled = {uploading} type= 'button' onClick={handelImageSubmit} className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          
          </div>
          <p className='text-red-700 text-sm'>
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className='flex justify-between p-3 border items-center'
              >
                <img
                  src={url}
                  alt='listing image'
                  className='w-20 h-20 object-contain rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                >
                  Delete
                </button>
              </div>
              ))}
          <button disabled= {loading || uploading} className='  w-80 h-12   p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Creating... ' : 'Create listing'}
          </button>
          {error && <p className='text-red-700'>{error}</p>}
        </div>
    
      </form>
    </main>
  );
}
