export interface User {
  username: string;
  uid: string;
  roles: Array<string> | any;
  requestNo: number;
}

export interface UserModel {
  findById: (username: String) => any;
  updateRequest: (username: String, num: number) => any;
  createUser: (body: User) => any;
}
