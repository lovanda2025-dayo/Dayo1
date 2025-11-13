import { Request, Response, NextFunction } from 'express';
import { supabase } from '../supabase.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export async function verifyAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No authorization token' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = {
      id: user.id,
      email: user.email || '',
    };

    next();
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed' });
  }
}

export async function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (token) {
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) {
        req.user = {
          id: user.id,
          email: user.email || '',
        };
      }
    }

    next();
  } catch (error) {
    next();
  }
}
