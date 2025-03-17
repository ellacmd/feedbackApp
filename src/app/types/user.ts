export interface AuthResponse extends User {
  user: User;
  token: string;
  message: string;
}

export interface User {
  _id: string;
  image: string;
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}
