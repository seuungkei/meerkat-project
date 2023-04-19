import MyCustomError from '../utils/customError';
import { userRepository } from '../repositories/userRepository';

export class userService {
  constructor(private Repository: userRepository) {}

  public emailCheck = async (email: string) => {
    const userExists = await this.Repository.emailCheck(email);

    if (userExists) {
      throw new MyCustomError('이메일이 이미 존재합니다.', 409);
    }

    return userExists;
  };
}
