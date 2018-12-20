import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../services/auth.service'


@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
 
    constructor(private router: Router, private authservice: AuthService) { }
 
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (!this.authservice.hasSession()){
            this.router.navigate(['']);
            return false;
        }
        if(this.router.url.split("/").length > 2){
            //return this.authservice.hasPermissionForAction(this.router.url);
        }
        return true; 
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.canActivate(route, state);
    }
}
