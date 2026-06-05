import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/appError';
import { User } from '../modules/user/user.model';
import { TUserRole } from '../modules/user/user.interface';
import catchAsync from '../utils/catchAsync';

// accepts both "Bearer <token>" and a raw token in the Authorization header
export const extractToken = (authHeader?: string) => {
  if (!authHeader) return null;
  return authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
};

export const isAdminRole = (role?: string) =>
  role === 'admin' || role === 'superAdmin';

const verifyAndLoadUser = async (token: string) => {
  let decoded: JwtPayload;
  try {
    decoded = jwt.verify(
      token,
      config.jwt_access_token as string,
    ) as JwtPayload;
  } catch {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token!');
  }

  // special-purpose tokens (e.g. password reset) are not login sessions
  if (decoded.type) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token type!');
  }

  // load the user fresh so role/premium changes take effect immediately
  const user = await User.findById(decoded.id);

  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not found!');
  }

  return {
    ...decoded,
    id: String(user._id),
    email: user.email,
    role: user.role,
    premium: user.premium,
  } as JwtPayload;
};

// requires a valid logged-in user; optionally restricts access to specific roles
const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const token = extractToken(req.headers.authorization);

      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
      }

      req.user = await verifyAndLoadUser(token);

      if (
        requiredRoles.length &&
        !requiredRoles.includes(req.user.role as TUserRole)
      ) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          'You have no access to this route!',
        );
      }

      next();
    },
  );
};

// identifies the user when a valid token is present, but never rejects the request
export const optionalAuth = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = extractToken(req.headers.authorization);

    if (token) {
      try {
        req.user = await verifyAndLoadUser(token);
      } catch {
        // invalid/expired token on a public route -> treat as anonymous
      }
    }

    next();
  },
);

export default auth;
