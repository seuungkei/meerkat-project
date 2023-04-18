import express from 'express';
import getMovieApi from '../utils/getMovieApi';

const router = express.Router();

const movieApiParse = new getMovieApi();

router.get('/api', movieApiParse.parseMovieDetailDataList);

export { router as movieRouter };
