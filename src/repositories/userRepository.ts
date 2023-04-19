import { PrismaClient } from "@prisma/client"

interface IgetSocialUser {
  "id": number,
  "nickname": string | null,
  "email": string | null,
  "social_id": string | null,
  "social_type_id": number | null
}

class userRepository {
  private readonly SOCIAL_TYPES = Object.freeze({
    kakao: 1,
    naver: 2,
    google: 3,
  });
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getSocialUser(socialId: string | undefined): Promise<IgetSocialUser | null> {
    const getSocialUser: IgetSocialUser | null = await this.prisma.user.findUnique({
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

  async createUser(nickname: string | undefined, email: string | undefined, socialId: string | undefined): Promise<number> {
    const createUser = await this.prisma.user.create({
      data : {
        nickname: nickname,
        email: email,
        social_id: socialId,
        social_type_id: this.SOCIAL_TYPES.kakao
      }
    })

    return createUser.id;
  };
  
  async getUserById(userId: number) {
    const result = await this.prisma.user.findUnique({
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