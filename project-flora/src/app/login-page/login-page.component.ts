import { Component, inject, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Login } from './login.model';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

  images = ['assets/ok.jpg','assets/ok1.png','assets/ok2.jpg']
  email='';
  password='';
  dict: any;
  errorMessage: any;
  constructor(private http: HttpClient){}

  login : Login =new Login(this.email,this.password);

  retrieve(){
    this.login=new Login(this.email,this.password);
    this.dict=this.http.post('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCXDVFX6EdK1-4DpbEGrqocOgpPAEqN7DQ',{email:this.login.email, password:this.login.pass, returnSecureToken:true}).
    subscribe(
      resData => {
        console.log(resData);
        this.errorMessage=null;
      },
      errorRes => {
        console.log(errorRes);
        if( !errorRes.error || !errorRes.error.error.message) {
          this.errorMessage = "UNKNOWN_ERROR";
        }
        else {
          this.errorMessage = "COMMON_ERROR";
        }
      }
    );
  }

}
