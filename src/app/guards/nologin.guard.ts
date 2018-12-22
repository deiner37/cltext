import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../services/auth.service'


@Injectable()
export class NoLoginGuard implements CanActivate {
 
    constructor(private router: Router, private authservice: AuthService) { }
 
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        /*if (this.authservice.hasSession()){
            //this.router.navigate(['admin']); 
            return false;
        }*/
        return true;
    }
}
