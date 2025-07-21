

import { inject } from "@angular/core";

import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

export enum Role{
    ADMIN = "Admin",
    CUSTOMER = "Customer",

}


export const hasRoleGuard: CanActivateFn = (route, state) => {
    const router: Router = inject(Router);
    const user = inject(AuthService)
    const userRole = user.getRole()
    const expectedRoles: Role[] = route.data['roles'];
    console.log('Expected Roles:', expectedRoles);
    console.log('User Role:', userRole);
    const hasRole: boolean = expectedRoles.every((role) => userRole?.includes(role));
  
    return hasRole || router.navigate(['unauthorized']);
  };