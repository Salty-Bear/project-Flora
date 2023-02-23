import { Component, inject, Input } from '@angular/core';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  images = ['assets/ok.jpg','assets/ok1.png','assets/ok2.jpg']
  email='';
  password='';

  retrieve(){

  }
}
