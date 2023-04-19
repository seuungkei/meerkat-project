import { Prisma, PrismaClient } from '@prisma/client';

export class userRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  exists = async (args: Prisma.UserCountArgs) => {
    const count = await this.prisma.user.count(args);
    return Boolean(count);
  };

  emailCheck = async (email: string) => {
    const userExists = await this.exists({
      where: {
        email: email,
      },
    });
    return userExists;
  };
}
