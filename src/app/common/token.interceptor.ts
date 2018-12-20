import { Injectable, Injector } from '@angular/core';
import {HttpEvent, HttpHeaders, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse} from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private inj: Injector, private router: Router) {}
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let me = this;
        let started = Date.now();
        let header = {};
        if((!req.headers.has('Content-Type') || req.headers.get('Content-Type') != 'multipart/form-data') && !(req.body instanceof FormData)){
            header['Content-Type'] = 'application/json';
        }
        let auth = this.inj.get(AuthService);
        req = req.clone({
            setHeaders: header,
            withCredentials: true
        });
        return next.handle(req).do(event => {
            if (event instanceof HttpResponse) {
                const elapsed = Date.now() - started;
            }
        }, (err: any) => {
            if (err instanceof HttpErrorResponse) {
                if (err.status === 401) {
                    auth.logout(false).then(function(){
                        me.router.navigate(['']);
                    });
                }
            }
        });
    }
}