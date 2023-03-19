import { Component } from '@angular/core';
import { LoginService } from 'src/services/login.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage} from '@angular/fire//compat/storage';
import { Observable } from 'rxjs';
import { map } from 'rxjs';



@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})




export class MainComponent {
  constructor (private loginService: LoginService,public afs: AngularFirestore,private af: AngularFireStorage) {}
  usertype: any='Home';
  postsCol: AngularFirestoreCollection<{name:string}>;
  email:any;
  name:string;
  display=false;
  lettermessage="";
  target:any;
  targetuser:any;
  img:any;

  onLogOut() {
    this.loginService.logOut();
  }
  // JSON.parse(localStorage.getItem('userData') || '{}').email
  em=JSON.parse(localStorage.getItem('userData') || '{}').email;
  
  ngOnInit() {
    this.afs.doc(`users/${this.em}`).get().subscribe(ref => {
      if(!ref.exists){
      console.log("notfound")// //DOC DOES NOT EXIST
      }
      else{
      const doc:any = ref.data();
      this.name = doc.FIRST_NAME;
      console.log(this.name) //LOG ENTIRE DOC
        }
      });
      this.fetchimg();

      }

      fetchimg(){
        this.af.ref(`users/${this.em}/[object File]`).getDownloadURL().subscribe(url =>{
          console.log(url);
          this.img=url;
          console.log(this.img);
        });
    }
  }
