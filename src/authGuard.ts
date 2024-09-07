import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const requestUrl = request.url;

    // Example condition: Check if URL matches specific pattern
    if (requestUrl.startsWith('/log') && !request.query.userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return true;
  }
}
