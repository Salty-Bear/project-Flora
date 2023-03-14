import { Component } from '@angular/core';
import { LoginService } from 'src/services/login.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';



@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  constructor (private loginService: LoginService,public afs: AngularFirestore) {}
  usertype: any='Home';
  postsCol: AngularFirestoreCollection<{name:string}>;
  email:any;
  name:string;

  onLogOut() {
    this.loginService.logOut();
  }
  // JSON.parse(localStorage.getItem('userData') || '{}').email
  em=JSON.parse(localStorage.getItem('userData') || '{}').email;
  ngOnInit() {
    this.afs.doc(`users/${this.em}`).get().subscribe(ref => {
      console.log(ref);
      if(!ref.exists){
      
      console.log("notfound")// //DOC DOES NOT EXIST
      
      }else{
      
      const doc:any = ref.data();
      
      this.name = doc.FIRST_NAME;
      
      console.log(this.name) //LOG ENTIRE DOC
      
      }
      
      });
      
      }
  }
