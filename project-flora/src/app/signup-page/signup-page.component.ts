import { Component } from '@angular/core';
import { Signup } from './signup.model';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css']
})
export class SignupPageComponent {
  signup: Signup = new Signup('Ayush', 'Kumar', 'Salty Hulk', 'idono@okok.com', 'pass');
}
