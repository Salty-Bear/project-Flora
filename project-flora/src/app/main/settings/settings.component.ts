import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  loader=false;
  ngOnInit(){
    this.load();
  }

  
  load(){
    this.loader=true;
    setTimeout(() =>{
      this.loader=false;
    },1000)
  }
}
