import { Response } from 'express';

export function setCacheHeaders(res: Response, maxAge: number = 3600) {
  res.set('Cache-Control', `public, max-age=${maxAge}, must-revalidate`);
  res.set('ETag', `"${Date.now()}"`);
}

export function setNoCacheHeaders(res: Response) {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
}

export function setCacheControl(maxAge: number = 3600, isPublic: boolean = false) {
  return (req: any, res: Response, next: any) => {
    setCacheHeaders(res, maxAge);
    if (isPublic) {
      res.set('Cache-Control', `public, max-age=${maxAge}`);
    }
    next();
  };
}
