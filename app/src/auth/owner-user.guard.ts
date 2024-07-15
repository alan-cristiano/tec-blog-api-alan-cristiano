import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export class OwnerUserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const userIdFromParams = request.params.userId;

    if (user.id !== userIdFromParams) {
      throw new UnauthorizedException(
        'You are not allowed to perform this action',
        {
          cause: new Error(),
        },
      );
    }

    return true;
  }
}
