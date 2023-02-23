import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Signup } from '../signup-page/signup.model';
import { registerLocaleData } from '@angular/common';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css']
})
export class SignupPageComponent {
  f_name=''; //first name
  l_name =''; //last name
  u_name =''; //user_name
  email=''; //email
  password=''; // password
  constructor(private http: HttpClient){}
  signups : Signup =new Signup(this.f_name,this.l_name,this.u_name,this.email,this.password);
  post(){
    console.log("ok");
    alert("Signed in! Sucessfully")
    this.signups=new Signup(this.f_name,this.l_name,this.u_name,this.email,this.password);
    this.http.post('https://flora-fbf5b-default-rtdb.firebaseio.com/posts.json',this.signups).subscribe(responseData =>{console.log(responseData)});
    this.http.post('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCXDVFX6EdK1-4DpbEGrqocOgpPAEqN7DQ',{email: this.signups.email, password: this.signups.pass, returnSecureToken: true}).subscribe(error =>{console.log(error)});
  }
}
