import { Component, inject, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Login } from './login.model';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoginService } from 'src/services/login.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

  images = ['assets/ok.jpg','assets/ok1.png','assets/r2.jpg']
  email='';
  password='';
  dict: any;
  errorMessage: any;

  constructor(private router:Router, private loginService: LoginService){}

  login: Login=new Login(this.email,this.password);




  retrieve(form: NgForm){
    const email=form.value.email;
    const password =  form.value.password;
    this.loginService.login(email, password).
    subscribe(
      resData => {
        // console.log(resData);
        this.errorMessage=null;
        this.router.navigate(['/main']);
      },
      errorMessage => {
        // console.log(errorMessage);
        this.errorMessage = errorMessage;
      }
    );
  }

  signInWithGoogle() {
    this.loginService.googleSignIn();
  }

}
