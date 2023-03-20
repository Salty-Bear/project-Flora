import { Component } from '@angular/core';
import { LoginService } from 'src/services/login.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage} from '@angular/fire//compat/storage';
import { Observable } from 'rxjs';
import { map } from 'rxjs';


interface userlist1{
  id:string;
}

interface message{
  content:string;
}

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
  userlist1: AngularFirestoreCollection<userlist1>;
  user1: Observable<userlist1[]>;
  userlist: AngularFirestoreCollection<message>;
  user: Observable<message[]>;
  uid:any;
  em=JSON.parse(localStorage.getItem('userData') || '{}').email;
  count:number;
  sender:string;
  doc:any;


  gettar(res:any){
    this.userlist = this.afs.collection(`users/${this.em}/letters`);
    this.user = this.userlist.snapshotChanges()
    .pipe(map(actions => {
      return actions.map(a => {
        const content=a.payload.doc.id;
        return { content};
      })
    }))

    this.user.subscribe(res =>{
      console.log(res);
      this.uid=res[0].content;
      console.log(this.uid)
      this.afs.doc(`users/${this.em}/letters/${this.uid}`).get().subscribe( ref =>{
        if(!ref.exists) {
          console.log("notfound")// //DOC DOES NOT EXIST
        }
        else {
          this.doc=ref.data();
          this.sender=this.doc.sender;
          this.count=this.doc.count;
          console.log(this.count);
          console.log(this.sender) //LOG ENTIRE DOC
        }
      })
    })
    

    console.log(res);
    this.target=Math.floor((Math.random()*res.length)%res.length);
    while(res[this.target].id == this.sender) {
      this.target=Math.floor((Math.random()*res.length)%res.length);
    }
    this.targetuser=res[this.target].id;
    console.log(this.count)
    console.log(this.targetuser)
    console.log(this.uid);
    this.afs.doc(`users/${this.em}/letters/${this.uid}`).delete();
    alert("sucess")
    if(this.count!=0) this.afs.collection(`users/${this.targetuser}/letters`).add({message:this.lettermessage,count:(this.count-1),sender:this.sender});
    console.log(this.uid);
    this.display=false;
  }




  onLogOut() {
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
    //this.loginService.logOut();
  }
  // JSON.parse(localStorage.getItem('userData') || '{}').email
  
  
  ngOnInit() {
    this.afs.doc(`users/${this.em}`).get().subscribe(ref => {
      if(!ref.exists){
      console.log("notfound")// //DOC DOES NOT EXIST
      }
      else{
      const doc:any = ref.data();
      this.name = doc.FIRST_NAME;
        }
      });
      this.fetchimg();

      }

      fetchimg(){
        this.af.ref(`users/${this.em}/[object File]`).getDownloadURL().subscribe(url =>{
          this.img=url;
        });
    }
  }

