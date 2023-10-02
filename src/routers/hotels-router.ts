import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getAllHotels, getHotelId} from '@/controllers/hotels-controller';

const hotelsRouter = Router();

hotelsRouter
    //.all('/*', authenticateToken)
    .get('/', getAllHotels)
    .get('/:hotelId', getHotelId);

export { hotelsRouter };
