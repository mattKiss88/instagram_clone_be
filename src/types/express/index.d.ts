import { Request } from "express";

interface User {
  id: number;
  username: string;
  email: string;
}

declare global {
  namespace Express {
    export interface Request {
      user: User;
    }
  }
}
