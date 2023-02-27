import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Signup } from '../signup-page/signup.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css']
})
export class SignupPageComponent {

  page: string='/signup';

  f_name: string=''; //first name
  l_name: string=''; //last name
  u_name: string=''; //user_name
  email: string=''; //email
  password: string=''; // password
  errorMessage: any = null;
  constructor(private http: HttpClient){}
  signup : Signup =new Signup(this.f_name,this.l_name,this.u_name,this.email,this.password);
  post(){
    console.log("ok");
    this.signup=new Signup(this.f_name,this.l_name,this.u_name,this.email,this.password);
    this.http.post('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCXDVFX6EdK1-4DpbEGrqocOgpPAEqN7DQ',
      {email: this.signup.email, password: this.signup.pass, returnSecureToken: true}
    ).
    subscribe(
      resData => { 
        console.log(resData);
        this.page="/";
        alert("Signed up! Successfully");
        this.http.post('https://flora-fbf5b-default-rtdb.firebaseio.com/posts.json',this.signup).subscribe(responseData =>{console.log(responseData)});
      }, 
      errorRes =>{
        console.log(errorRes);
        if (!errorRes.error || !errorRes.error.error.message){
          this.errorMessage = "UNKNOWN_ERROR";
        }
        else {
          switch(errorRes.error.error.message) {
            case 'EMAIL_EXISTS': {
              this.errorMessage = "EMAIL_EXISTS";
              break;
            }
            case 'WEAK_PASSWORD : Password should be at least 6 characters': {
              this.errorMessage = "WEAK_PASSWORD : Password should be at least 6 characters"
              break;
            }
            default: {
              this.errorMessage = "UNKNOWN_ERROR";
            }
          }
        }
      }
    );
  }
}
