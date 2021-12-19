import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export default {
  signin(id: string) {
    return jwt.sign({ id }, String(process.env.APP_SECRET), {
      expiresIn: '15 days',
    });
  },
  isAuthenticated(req: Request, res: Response, next: NextFunction) {
    const { authorization }: any = req.headers;
    if (!authorization)
      return res.status(401).json({ message: 'Unauthorized' });
    const [method, token] = authorization.split(' ');
    const decoded: any = jwt.verify(token, String(process.env.APP_SECRET));
    req.headers.id = decoded.id;
    next();
  },
};
