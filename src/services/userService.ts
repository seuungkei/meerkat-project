import axios from 'axios';
import jwt from 'jsonwebtoken';
import { userRepository, IgetSocialUser } from '../repositories/userRepository';

import dotenv from 'dotenv';
dotenv.config();

class userService {
  private readonly JWT_SECRET: string | undefined;
  constructor (private Repository: userRepository) {
    this.JWT_SECRET = process.env.JWT_SECRET;
  }

  public kakaoLogin = async (kakaoToken: string | undefined): Promise<{accessToken: string; userNickname: string | null; status: number;}> => {
    if(!this.JWT_SECRET) throw new Error('JWT_SECRET must be defined');

    const {nickname, email, socialId} = await this._getKakaoUserData(kakaoToken);
    const user = await this.Repository.getSocialUser(socialId);

    return user? await this._ifExistUser(user, this.JWT_SECRET) : await this._ifNotExistUser(nickname, email, socialId, this.JWT_SECRET);
  };

  private _getKakaoUserData = async (kakaoToken: string | undefined): Promise<{nickname: string; email: string; socialId: string;}> => {
    const { data } = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        authorization: `Bearer ${kakaoToken}`,
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });
  
    const nickname: string = data.properties.nickname;
    const email: string = data.kakao_account.email;
    const socialId: string = data.id;

    return {nickname, email, socialId};
  }

  private async _ifExistUser(user: IgetSocialUser, JWT_SECRET: string) {
    const userId = user.id;
    const userNickname = user.nickname;
    const jsonwebtoken = jwt.sign({ id: userId }, JWT_SECRET);
  
    return { accessToken: jsonwebtoken, userNickname: userNickname, status: 200 };
  }

  private async _ifNotExistUser(nickname: string, email: string, socialId: string, JWT_SECRET: string): Promise<{accessToken: string; userNickname: string; status: number;}> {
    const userId = await this.Repository.createUser(nickname, email, socialId);
    const jsonwebtoken = jwt.sign({ id: userId }, JWT_SECRET);

    return { accessToken: jsonwebtoken, userNickname: nickname, status: 201 };
  }
}

export {
  userService,
}