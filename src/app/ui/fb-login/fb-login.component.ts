import { Component } from '@angular/core';
import { FacebookService} from 'ngx-facebook';
import { UserService } from '../../Services';
import { Observable } from 'rxjs/Rx';
import { Router} from '@angular/router';

@Component({
selector: 'ts-fb-login',
styleUrls: ['fb-login.component.css'],
templateUrl: './fb-login.component.html'
})

export class FbLoginComponent {
    loadr = false;
   constructor( private fb: FacebookService , private userService: UserService, private router: Router ) {}

   loginBtnClick(): void {
     const me = this;
     me.fb.login( { scope: 'email' }).then(registerApi,
       (error: any) => console.error(error)
     );

     function registerApi(response) {
     localStorage.setItem('fbInfo', JSON.stringify(response.authResponse));

      const responsefrmServer: Observable<Object>= me.userService.registerUser(response.authResponse.accessToken);

      responsefrmServer.subscribe(funcSuccess, funcError);

      function funcSuccess(response){
      console.log(response);
      localStorage.setItem('userInfo', JSON.stringify(response.user));
      localStorage.setItem('permanent_Token', response.permanentToken);
      me.router.navigate(['/home']);
      }

      function funcError(error){
      console.log(error);
      }
    }
    this.loadr = true;
   }
}
