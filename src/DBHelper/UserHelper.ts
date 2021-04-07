// import User from '../models/index'
import { User } from '../models/index'

interface IUser {
  account: String,
  password: String
}

export default class UserHelper {
  public static findUser = async () => {
    const user: any = await User.find()
    // const testUser = new User({
    //   account: '65465465454',
    //   password: '123456',
    // })
    // testUser.save(function (err: any, doc: any) {
    //   if (err) {
    //     console.log('save error:' + err);
    //   }
    //   console.log('save sucess \n' + doc);
    // })
    return {
      status: 10001,
      data: user
    }
  }
}