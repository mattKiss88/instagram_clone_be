import { Request, Response, NextFunction } from "express";
import { accessLog } from "../helpers/logger";
const jwt = require("jsonwebtoken");

interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
}

declare global {
  namespace Express {
    export interface Request {
      user: User;
    }
  }
}

function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err: Error, user: { user: User }) => {
      if (err) return res.sendStatus(403);
      req.user = { ...user.user };
      next();
    }
  );
}

export { authenticateToken };
