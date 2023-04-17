class userRepository {
 
  async createUser(nickname : string, email : string, socialId : number) {
    // const createUser = await appDataSource.query(
    //   `INSERT INTO users(
    //     nickname,
    //     email,
    //     social_id,
    //     social_type_id
    //   ) VALUES (?, ?, ?, ?);
    //   `,
    //   [nickname, email, socialId, SOCIAL_TYPES.kakao]
    // );
  
    // return createUser.insertId;
  };
  
  async getSocialUser(socialId : number) {
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
    // return getSocialUser;
  };
  
  async getUserById(userId : number) {
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