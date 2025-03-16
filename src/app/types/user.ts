export interface User {
  user: {
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
  };
  token: string;
  message: string;
}
