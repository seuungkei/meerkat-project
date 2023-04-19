import { Response, Request } from 'express';
import MyCustomError from '../utils/customError';
import { catchAsync } from '../middlewares/error';
import { userService } from '../services/userService';

class userController {
  constructor(private Service: userService) {}

  emailCheck = catchAsync(async (req: Request, res: Response) => {
    const email: string = req.body.email;

    if (!email) throw new MyCustomError('KEY_ERROR', 400);

    await this.Service.emailCheck(email);
    return res.status(200).json({ message: '사용 가능한 이메일입니다.' });
  });
}

export { userController };
