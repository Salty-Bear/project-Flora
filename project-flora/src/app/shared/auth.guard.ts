import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { map, Observable, take, tap } from 'rxjs';
import { LoginService } from 'src/services/login.service';


@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private userService: LoginService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
      return this.userService.user.pipe(
        take(1),
        map( user => {
          const isAuth = !!user;
          if(isAuth) {
            return true;
          }
        return this.router.createUrlTree(['/']);
        })
      );
    }



}
