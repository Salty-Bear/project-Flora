import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AngularFireStorage} from '@angular/fire//compat/storage';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  constructor(public afs: AngularFirestore,public af: AngularFireStorage){}
  loader=false;
  name:string;
  password:string;
  website:string;
  bio:string;
  email:string;
  gender:string;

  em=JSON.parse(localStorage.getItem('userData') || '{}').email;











  ngOnInit(){
    this.load();
  }

  submit(){
    this.afs.doc(`users/${this.em}`).update({FIRST_NAME:this.name,PASSWORD:this.password,BIO:this.bio,GENDER:this.gender,WEBSITE:this.website})
    console.log("ok")
  }
  
  load(){
    this.loader=true;
    setTimeout(() =>{
      this.loader=false;
    },1000)
  }
}
