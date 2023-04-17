import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

const SOCIAL_TYPES = Object.freeze({
  kakao: 1,
  naver: 2,
  google: 3,
});

interface IgetSocialUser {
  "id": number,
  "nickname": string,
  "email": string,
  "social_id": number,
  "social_type_id": number
}

class userRepository {
  async createUser(nickname : string, email : string, socialId : number): Promise<number | null> {
    const createUser = await prisma.users.create({
      data : {
        nickname: nickname,
        email: email,
        social_id: socialId,
        social_type_id: SOCIAL_TYPES.kakao
      }
    })
    return createUser.insertId;
  };
  
  async getSocialUser(socialId : number): Promise<IgetSocialUser | null> {
    const getSocialUser: IgetSocialUser | null = await prisma.users.findUnique({
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

    console.log("getSocialUser: ",getSocialUser);
    // const [getSocialUser] = await appDataSource.query(
    //   `SELECT
    //     id,
    //     nickname,
    //     email,
    //     social_id,
    //     social_type_id
    //   FROM users
    //   WHERE social_id = ?;
    //   `,
    //   [socialId]
    // );
    return getSocialUser;
  };
  
  async getUserById(userId : number) {
    const result = await prisma.users.findUnique({
      where: {
        id: userId
      },
      select: {
        id: true,
      },
    })
    console.log("result: ",result)
    return result;
  //   const [result] = await appDataSource.query(
  //     `SELECT
  //           id userId
  //         FROM
  //           users
  //         WHERE
  //           id = ?;`,
  //     [userId]
  //   );
  //   return result;
  // };
  }
}

export {
  userRepository,
}