import { Component } from '@angular/core';
import { LoginService } from 'src/services/login.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs';

interface message{
  content:string;
}

interface userlist1{
  id:string;
}


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
  display=false;
  lettermessage="";
  target:any;
  targetuser:any;

  userlist: AngularFirestoreCollection<message>;
  user: Observable<message[]>;
  userlist1: AngularFirestoreCollection<userlist1>;
  user1: Observable<userlist1[]>;



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
      }

      closePanel() {
        this.display=false;
      }

      gettar(res:any){
        this.target=Math.floor((Math.random()*res.length)%res.length);
        while(res[this.target].id == this.em) {
          this.target=Math.floor((Math.random()*res.length)%res.length);
        }
        this.targetuser=res[this.target].id;
      }


      sendletter(){
        this.userlist1 = this.afs.collection('users');
        this.user1 = this.userlist.snapshotChanges()
          .pipe(map(actions => {
            return actions.map(a => {
              const id=a.payload.doc.id;
              return { id};
            })
          }));
    
         this.user.subscribe(res =>
          this.gettar(res))
    

          this.afs.collection(`users/${this.targetuser}/letters`).add({message:this.lettermessage})
          console.log(this.targetuser);
          this.display=false;
          
      }


    show() {
      this.userlist = this.afs.collection(`users/${this.em}/Letters`);
      console.log("ok")
      this.user = this.userlist.snapshotChanges()
      .pipe(map(actions => {
        return actions.map(a => {
          console.log("okok");
          const content=a.payload.doc.id;
          return { content};
        })
      }));
      this.user.subscribe(res =>{
        const uid=res[0].content;
        this.afs.doc(`users/${this.em}/Letters/${uid}`).get().subscribe( ref =>{
          if(!ref.exists){
            console.log("notfound")// //DOC DOES NOT EXIST
            }
            else{
            const doc:any = ref.data();
            this.lettermessage = doc.message;
            console.log(this.name) //LOG ENTIRE DOC
              }
        })
      })

      this.display=true;
    }
  }
