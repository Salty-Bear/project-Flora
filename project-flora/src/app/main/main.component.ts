import { Component } from '@angular/core';
import { LoginService } from 'src/services/login.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  constructor (private loginService: LoginService) {}
  usertype: any='Home';
  count=0;
  onLogOut() {
    this.loginService.logOut();
  }

}
