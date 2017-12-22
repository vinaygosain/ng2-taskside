'use strict';
import { Injectable } from '@angular/core';
import { Router} from '@angular/router';

@Injectable()
export class AuthenticationService{
  private isLoggedIn: boolean;
  constructor( public router: Router ){
  }

  login():boolean{
    this.isLoggedIn= !!localStorage.getItem('permanent_Token');
    return this.isLoggedIn;
  }

  logout(){
    localStorage.removeItem('permanent_Token');
    this.isLoggedIn= false;
     this.router.navigate(['/login']);
  }
}
