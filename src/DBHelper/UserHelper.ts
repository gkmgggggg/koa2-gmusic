import User from '../models/User'

interface IUser {
  account: String,
  password: String
}

export default class UserHelper {
  public static findUser = async () => {
    const user: any = await User.findOne()
    console.log(user)
    return {
      status: 10001,
      data: user
    }
  }
}