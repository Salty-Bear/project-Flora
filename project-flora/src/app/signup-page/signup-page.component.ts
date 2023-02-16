import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Signup } from '../signup-page/signup.model';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css']
})
export class SignupPageComponent {
  f_name='';
  l_name ='';
  u_name ='';
  email='';
  password='';
  constructor(private http: HttpClient){}
  signups : Signup =new Signup(this.f_name,this.l_name,this.u_name,this.email,this.password);
  post(){
    console.log("ok");
    this.signups=new Signup(this.f_name,this.l_name,this.u_name,this.email,this.password);
    this.http.post('https://flora-fbf5b-default-rtdb.firebaseio.com/posts.json',this.signups).subscribe(responseData =>{console.log(responseData)});
  }
}
