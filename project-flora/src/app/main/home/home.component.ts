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
  loader=true;
  count:number;
  sender:string;

  load(){
    this.loader=true;
    setTimeout(() =>{
      this.loader=false;
    },5500)
  }



  closePanel() {
    this.display=false;
  }

  userlist: AngularFirestoreCollection<message>;
  user: Observable<message[]>;
  userlist1: AngularFirestoreCollection<userlist1>;
  user1: Observable<userlist1[]>;
  em=JSON.parse(localStorage.getItem('userData') || '{}').email;

  ngOnInit(){
    this.load(); //calling loader in home page


    this.userlist = this.afs.collection(`users/${this.em}/letters`);
    this.user = this.userlist.snapshotChanges()
    .pipe(map(actions => {
      return actions.map(a => {
        const content=a.payload.doc.id;
        return { content};
      })
    }));
  }


  gettar(res:any){
    // console.log(res);
    this.target=Math.floor((Math.random()*res.length)%res.length);
    while(res[this.target].id == this.sender) {
      this.target=Math.floor((Math.random()*res.length)%res.length);
    }
    this.targetuser=res[this.target].id;
    // console.log(this.count)
    // console.log(this.targetuser)
    this.afs.doc(`users/${this.em}/letters/${this.uid}`).delete();
    // alert("sucess")
    if(this.count!=0) {
      this.afs.collection(`users/${this.targetuser}/letters`).add({message:this.lettermessage,count:(this.count-1),sender:this.sender});
    }
    // console.log(this.uid);
    this.display=false;
  }


  sendletter(){
    this.userlist1 = this.afs.collection('users');
    this.user1 = this.userlist1.snapshotChanges()
      .pipe(map(actions => {
        return actions.map(a => {
          const id=a.payload.doc.id;
          return { id};
        })
      }));

     this.user1.subscribe(res =>
      this.gettar(res))      
  }


show() {
  // this.userlist = this.afs.collection(`users/${this.em}/letters`);
  // this.user = this.userlist.snapshotChanges()
  // .pipe(map(actions => {
  //   return actions.map(a => {
  //     const content=a.payload.doc.id;
  //     return { content};
  //   })
  // }));
  this.user.subscribe(res =>{
    this.uid=res[0].content;
    this.afs.doc(`users/${this.em}/letters/${this.uid}`).get().subscribe( ref =>{
      if(!ref.exists) {
        // console.log("notfound")// //DOC DOES NOT EXIST
      }
      else {
        this.doc = ref.data();
        this.lettermessage = this.doc.message;
        this.count=this.doc.count;
        this.sender=this.doc.sender;

        // console.log(this.sender) //LOG ENTIRE DOC
      }
    })
  })

  this.display=true;
}

  getSenderFname(email: string, epoch: any) {
    this.afs.doc(`users/${email}`).get().subscribe(ref => {
      const doc:any = ref.data();
      this.afs.collection(`users/${this.em}/Friends`).doc(this.doc.sender).set({f_name: doc.FIRST_NAME, epoch: epoch});
    })
  }

  getUserFname(email: string, epoch: any) {
    this.afs.doc(`users/${email}`).get().subscribe(ref => {
      const doc:any = ref.data();
      this.afs.collection(`users/${this.doc.sender}/Friends`).doc(this.em).set({f_name: doc.FIRST_NAME, epoch: epoch});
    })
  }

  onAccept(){
    const now = new Date().getTime();
    this.getSenderFname(this.doc.sender, now);
    this.getUserFname(this.em, now);
    this.display=false;
    this.afs.doc(`users/${this.em}/letters/${this.uid}`).delete();
    this.lettermessage="";
  }
}
