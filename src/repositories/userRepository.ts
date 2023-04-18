import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

const SOCIAL_TYPES = Object.freeze({
  kakao: 1,
  naver: 2,
  google: 3,
});

interface IgetSocialUser {
  "id": number,
  "nickname": string | null,
  "email": string | null,
  "social_id": string | null,
  "social_type_id": number | null
}

class userRepository {
  async createUser(nickname: string | undefined, email: string | undefined, socialId: string | undefined): Promise<number> {
    const createUser = await prisma.user.create({
      data : {
        nickname: nickname,
        email: email,
        social_id: socialId,
        social_type_id: SOCIAL_TYPES.kakao
      }
    })
    return createUser.id;
  };
  
  async getSocialUser(socialId: string | undefined): Promise<IgetSocialUser | null> {
    const getSocialUser: IgetSocialUser | null = await prisma.user.findUnique({
      where: {
        social_id: socialId,
      },
      select: {
        id: true,
        nickname: true,
        email: true,
        social_id: true,
        social_type_id: true,
      },
    })

    return getSocialUser;
  };
  
  async getUserById(userId: number) {
    const result = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
      },
    });

    return result;
  };
};

export {
  userRepository,
  IgetSocialUser,
}