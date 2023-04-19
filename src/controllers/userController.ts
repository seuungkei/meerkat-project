import { Response, Request } from 'express';
import HttpException from '../utils/httpException';
import { userService } from '../services/userService';

export class userController {
  constructor(private Service: userService) {}

  public signUp = async (req: Request, res: Response) => {
    const email: string = req.body.email;

    if (!email) throw new HttpException('KEY_ERROR', 400);
  };
}
