import jwt from "jsonwebtoken";

export const generateToken = (
  payload: jwt.JwtPayload,
  secret: jwt.Secret,
  options?: jwt.SignOptions
): string => jwt.sign(payload, secret, options);

export const verifyToken = (
  token: string,
  secret: jwt.Secret
): jwt.JwtPayload => jwt.verify(token, secret) as jwt.JwtPayload;
