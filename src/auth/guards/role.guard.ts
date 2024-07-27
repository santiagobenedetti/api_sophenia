import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  /**
   * Protege una ruta con roles
   *
   * @param context
   */
  canActivate(context: ExecutionContext): boolean {
    const endpointRoles: string[] = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    // If endpoint is public or not need roles
    if (!endpointRoles) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    console.log(req, req.user);
    const { user } = req;
    const userRoles = user.role.split(',');

    const hasRoles = endpointRoles.some((endpointRole) =>
      userRoles.includes(endpointRole),
    );
    return user && user.role && hasRoles;
  }
}
