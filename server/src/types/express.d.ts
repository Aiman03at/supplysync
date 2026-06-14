<<<<<<< HEAD
import { JwtPayload } from 'jsonwebtoken';
=======
import { JwtPayload } from "jsonwebtoken";
>>>>>>> aecb8f6a7eb0193a1bdb117e8337d9919992da4c

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { id: string; email: string; role: string };
    }
  }
}
