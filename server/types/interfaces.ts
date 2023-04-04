export interface User {
  username: string;
  subscribedIn: string;
  expiresIn: string;
  requestNo: number;
}

export interface UserModel {
  findById: (username: String) => any;
  updateRequest: (username: String, num: number) => any;
  subscribeUser: (username: String) => any;
  createUser: (body: User) => any;
  findAll: () => any;
}
