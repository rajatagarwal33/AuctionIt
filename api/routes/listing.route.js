import express from 'express';
import { deleteListing, updateListing, getListing, getListings, makeBid, createMessage} from '../controllers/listing.controller.js';
import { createListing } from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteListing);
router.post('/update/:id', verifyToken, updateListing);
router.get('/get/:id', getListing);
router.get('/get', getListings);
router.post('/bid/:id', makeBid);
router.post('/api/listing/message/:id', createMessage);

export default router;