import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 1. Dapatkan objek request dari context
    const request = context.switchToHttp().getRequest();

    // 2. Ambil header 'x-user-id' dari request
    const userId = request.headers['x-user-id'];

    // 3. Jika header tidak ada atau kosong, lempar error 401
    if (!userId) {
      throw new UnauthorizedException('Header x-user-id is missing');
    }

    // 4. Jika header ada, izinkan request untuk melanjutkan
    return true;
  }
}
