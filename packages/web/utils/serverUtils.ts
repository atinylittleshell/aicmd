import admin from 'firebase-admin';
import jwt from 'jsonwebtoken';
import { NextApiRequest } from 'next/types';

const firebaseCredentialsJson = Buffer.from(process.env.FIREBASE_CREDENTIALS_BASE64 || '', 'base64').toString('utf8');
const firebaseCredentials = JSON.parse(firebaseCredentialsJson);

export type User = {
  id: string;
  email: string;
};

export const firebase =
  admin.apps[0] ??
  admin.initializeApp({
    credential: admin.credential.cert(firebaseCredentials),
  });

export const createAccessToken = (user: User): string => {
  return jwt.sign(user, firebaseCredentials.client_id, {
    expiresIn: '365d',
  });
};

const verifyAccessTokenAsync = (token: string): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jwt.verify(token, firebaseCredentials.client_id, (err: any, decoded: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded as User);
      }
    });
  });
};

export const getUserAsync = async (request: NextApiRequest): Promise<User | null> => {
  const bearerToken = request.headers.authorization;
  if (!bearerToken) {
    return null;
  }

  const [_bearer, source, token] = bearerToken.split(' ');

  switch (source) {
    default:
    case 'FIREBASE': {
      const decodedToken = await firebase.auth().verifyIdToken(token);
      return {
        id: decodedToken.uid,
        email: decodedToken.email || '',
      };
    }
    case 'AICMD':
      return verifyAccessTokenAsync(token);
  }
};
