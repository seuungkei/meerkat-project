import { Request, Response, NextFunction } from 'express';
import HttpException from '../utils/httpException';

const errorMiddleware = (error: HttpException, request: Request, response: Response, next: NextFunction) => {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';

  response.status(status).json({ status, message });
};

export default errorMiddleware;
