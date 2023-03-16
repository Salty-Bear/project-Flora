import { Component } from '@angular/core';
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
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor (public afs: AngularFirestore) {}
  doc:any;
  uid:any;
  display=false;
  lettermessage="";
  target:any;
  targetuser:any;
  closePanel() {
    this.display=false;
  }

  userlist: AngularFirestoreCollection<message>;
  user: Observable<message[]>;
  userlist1: AngularFirestoreCollection<userlist1>;
  user1: Observable<userlist1[]>;
  em=JSON.parse(localStorage.getItem('userData') || '{}').email;

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


      this.afs.collection(`users/${this.targetuser}/letters`).add({message:this.lettermessage});
      this.display=false;
      
  }


show() {
  this.userlist = this.afs.collection(`users/${this.em}/Letters`);
  this.user = this.userlist.snapshotChanges()
  .pipe(map(actions => {
    return actions.map(a => {
      const content=a.payload.doc.id;
      console.log(content);
      return { content};
    })
  }));
  this.user.subscribe(res =>{
    this.uid=res[0].content;
    this.afs.doc(`users/${this.em}/Letters/${this.uid}`).get().subscribe( ref =>{
      if(!ref.exists){
        console.log("notfound")// //DOC DOES NOT EXIST
        }
        else{
        this.doc = ref.data();
        this.lettermessage = this.doc.message;
        console.log(this.lettermessage) //LOG ENTIRE DOC
          }
    })
  })

  this.display=true;
}

onAccept(){
  console.log(this.doc.sender);
  this.afs.collection(`users/${this.em}/Friends`).doc(this.doc.sender).set({});
  this.afs.collection(`users/${this.doc.sender}/Friends`).doc(this.em).set({});
  this.display=false;
}
}
