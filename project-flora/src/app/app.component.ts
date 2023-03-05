import { Component } from '@angular/core';


const config = {
  apiKey: 'AIzaSyCXDVFX6EdK1-4DpbEGrqocOgpPAEqN7DQ',
  databaseURL: 'https://flora-fbf5b-default-rtdb.firebaseio.com'
};


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'project-flora';



  loader=true; //initialising loader variable for loading animation trigger



ngonInit():void{
  //loader variable set to false after page loads
  setTimeout(() => {
    this.loader =false;
  }, 3000);
}
}
