import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class LoggedInGuard implements CanActivate {
  constructor( private user: AuthenticationService, private router: Router ) {}

  canActivate() {
    let isloggedIn= this.user.login();
    if(!isloggedIn){
    this.router.navigate(['/login']);
  }
    return isloggedIn;
  }
}
