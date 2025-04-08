import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtService {
  constructor() {}

  sign(payload: object, secretKey: string, options?: jwt.SignOptions): string {
    return jwt.sign(payload, secretKey, options);
  }
}
