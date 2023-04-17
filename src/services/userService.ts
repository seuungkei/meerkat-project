import axios from 'axios';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/userRepository';

import dotenv from 'dotenv';
dotenv.config();

class userService {
  private readonly JWT_SECRET: any;
  constructor (private Repository: userRepository) {
    this.JWT_SECRET = process.env.JWT_SECRET;
  }

  kakaoLogin = async (kakaoToken : string) => {
    const { data } = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        authorization: `Bearer ${kakaoToken}`,
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });
  
    const nickname = data.properties.nickname;
    const email = data.kakao_account.email;
    const socialId = data.id;
  
    const user = await this.Repository.getSocialUser(socialId);
  
    if (!user) {
      const userId = await this.Repository.createUser(nickname, email, socialId);
      const jsonwebtoken = jwt.sign({ id: userId }, this.JWT_SECRET);
  
      return { accessToken: jsonwebtoken, status: 201 };
    }
  
    const userId = user.id;
    const userNickname = user.nickname;
    const jsonwebtoken = jwt.sign({ id: userId }, this.JWT_SECRET);
  
    return { accessToken: jsonwebtoken, userNickname: userNickname, status: 200 };
  };
}

export {
  userService,
}