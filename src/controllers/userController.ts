import { Request, Response } from 'express';
import { userService } from '../services/userService';

class userController {
  constructor(private Service: userService) {
  }

  kakaoLogin = async (req: Request, res: Response) => {
    const kakaoToken = req.headers.authorization;
  
    // if (!kakaoToken) throw new Error("KEY_ERROR");
  
    // const { accessToken, userNickname, status } = await this.Service.kakaoLogin(kakaoToken);

    const { accessToken, userNickname, status } = await this.Service.kakaoLogin(kakaoToken);
  
    res.status(status).json({ accessToken, userNickname });
  };
}

export {
  userController,
}