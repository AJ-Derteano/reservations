import { Request } from 'express';

export interface RequestExpress extends Request {
  user: {
    username: string;
    role: string;
    sub: string;
    iat: number;
    exp: number;
  };
}
