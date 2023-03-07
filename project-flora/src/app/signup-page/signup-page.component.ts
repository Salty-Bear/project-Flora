import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Signup } from '../signup-page/signup.model';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoginService } from 'src/services/login.service';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css']
})
export class SignupPageComponent {
  u_id:string;
  isLoginMode = true;
  errorMessage: string;
  f_name: string;
  l_name: string;
  u_name: string;
  email: string;
  password: string;
  rePassword: string;
  object: any;

  constructor(private loginService: LoginService,private router: Router,private http: HttpClient){}


  onSubmit(form: NgForm){
    const email=form.value.email;
    const password =  form.value.password;

    if(this.password!=this.rePassword) {
      this.errorMessage = "Password does not match";
    }
    else {
      this.loginService.signup(email, password).
      subscribe(
        respondData => {
          alert("Sign Up sucessful!!!")
          this.http.post('https://flora-fbf5b-default-rtdb.firebaseio.com/users.json',{email: this.email}).subscribe(respondData => {console.log(respondData)});


          this.http.post('https://flora-fbf5b-default-rtdb.firebaseio.com/profiles.json',{firstName:this.f_name,lastName:this.l_name,userName:this.u_name,email: this.email,password:this.password}).subscribe(respondData => {console.log(respondData)});


          this.http.get('https://flora-fbf5b-default-rtdb.firebaseio.com/profiles.json').subscribe(respondData =>{ console.log(respondData) });
          console.log(respondData); 
          this.router.navigate(['/']);
        },
        errorRes => {
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
}
