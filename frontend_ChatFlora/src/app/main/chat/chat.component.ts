import { Component, AfterViewChecked, ViewChild } from '@angular/core';
// import { ChatService } from 'src/services/chat.service';
import { AngularFireList } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, timeInterval } from 'rxjs';
import { map, take } from 'rxjs';
import { orderBy, limit } from 'firebase/firestore';
import { EmailAuthProvider } from 'firebase/auth';
import { AngularFireStorage} from '@angular/fire//compat/storage';

interface Post{
  message: string;
  email: string;
  timestamp: string;
  time: string;
}

interface friends{
  email: string;
  f_name: string;
  last_message: string;
  time: string;
}


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})



export class ChatComponent {
  constructor(public afs: AngularFirestore, private af: AngularFireStorage) {}
  @ViewChild("toScroll") toScroll: any;
  postsCol: AngularFirestoreCollection<Post>;
  posts: Observable<Post[]>;
  msg:string;

  friends: { email:string, f_name:string } [] = [];

  userlist: AngularFirestoreCollection<friends>;
  user: Observable<friends[]>;
  currentuser:string;
  currentUserFname: string;
  currentUserUname: string;
  messages:{message:string,email:string,timestamp:string}[]=[];
  f: string;
  img: string;

  showTextField: boolean = false;
  showError: boolean = true;
  flag: boolean = true;

  element = document.getElementsByClassName('message-window'); // Replace 'myElement' with the ID of your element


  month: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

  loader: boolean=true;

  em=JSON.parse(localStorage.getItem('userData') || '{}').email;

  ngOnInit() {
    this.userlist=this.afs.collection(`users/${this.em}/Friends`, ref => ref.orderBy('epoch', "desc"));
    this.user= this.userlist.snapshotChanges()
    .pipe(map(action=>{
      return action.map(a=> {
        if(a.payload.doc.exists) {
          this.showError = false;
        }
        const email=a.payload.doc.id;
        const f_name=a.payload.doc.data().f_name;
        const last_message=a.payload.doc.data().last_message;
        const time=a.payload.doc.data().time;
        // this.af.ref(`users/${this.em}/[object File]`).getDownloadURL().subscribe(url =>{
        //   this.img=url;
        // });
        return {
          email, f_name, last_message, time
        }
      })
    }))
    this.user.subscribe(res=>{
      // console.log(res[0]);
      if(this.flag) {
        this.loader=false;
        this.flag=false;
      }
    })
    // this.user.subscribe(res=>{
    //   console.log(res.length);
    //   if(res.length==0||res.length==null) {
    //     this.showErrorMessage=true;
    //   }
    // })
    // this.user.subscribe(res =>{
    //   res.forEach( a =>{
    //     this.afs.doc(`users/${a.email}`).get().subscribe(ref =>{
    //       if(!ref.exists){
    //         console.log("notfound")// //DOC DOES NOT EXIST
    //       }
    //       else{
    //         const doc:any = ref.data();
    //         this.friends.push({email:a.email,f_name:doc.FIRST_NAME})
    //       }
          
    //   })
    //   }

    //   )
    //  })
    // console.log(this.friends);





    // this.afs.doc(`users/${this.em}/Friends/${this.id}/`).get().subscribe(ref => {
    //   console.log(ref);
    //   if(!ref.exists){
      
    //     console.log("notfound")// //DOC DOES NOT EXIST
        
    //     }else{
        
    //     this.posts = ref.data();

    //     console.log("hello")
    //     console.log(this.posts) //LOG ENTIRE DOC
        
    //     }
    //   });
  }

  // load(){
  //   this.loader=true;
  //   setTimeout(() =>{
  //     this.loader=false;
  //   },3000)
  // }

  onContactClick(friend: any){
    this.currentuser=friend.email;
    this.postsCol=this.afs.collection(`users/${this.em}/Friends/${friend.email}/messages`, ref => ref.orderBy('timestamp').limitToLast(25));
    this.posts=this.postsCol.snapshotChanges()
      .pipe(map(actions => {
        return actions.map( a=> {
          const message=a.payload.doc.data().message;
          const email=a.payload.doc.data().email;
          const timestamp=a.payload.doc.data().timestamp;
          const time=a.payload.doc.data().time;
          // console.log(a.payload.doc.data());
          this.toScroll.nativeElement.scrollTop = this.toScroll.nativeElement.scrollHeight;
          return {message,email,timestamp,time};
        })
      }))
    this.afs.doc(`users/${friend.email}`).get().subscribe(ref => {
      const doc: any = ref.data();
      this.currentUserFname = doc.FIRST_NAME;
      this.currentUserUname = "@"+doc.USERNAME;
      this.showTextField = true;
    })
    this.af.ref(`users/${friend.email}/[object File]`).getDownloadURL().subscribe(url =>{
        this.img=url;
    });
    
    setTimeout(() =>{
      // console.log("1");
      this.toScroll.nativeElement.scrollTop = this.toScroll.nativeElement.scrollHeight;
    },2000)
  }

  getTimeStamp(now: any) {
    const date = now.getDate();
    const month = this.month[now.getMonth()];
    const year = now.getFullYear();
    const hours = now.getHours();
    const minutes = now.getMinutes() < 3 ? ("0" + now.getMinutes()) : (now.getMinutes());
    return (month+" "+date+", "+year+", "+hours+":"+minutes);
  }

  send(){
    if(this.msg!="" && this.msg !=null){
      const now = new Date();
      const timeStamp = now.getTime().toString();
      this.afs.collection(`users/${this.em}/Friends/${this.currentuser}/messages`).add({email:this.em, message:this.msg, timestamp: timeStamp, time: this.getTimeStamp(now)}).then();
      this.afs.collection(`users/${this.currentuser}/Friends/${this.em}/messages`).add({email:this.em, message:this.msg, timestamp: timeStamp, time: this.getTimeStamp(now)}).then();
      this.afs.collection(`users/${this.em}/Friends`).doc(this.currentuser).update({last_message: this.msg, time: this.getTimeStamp(now), epoch: timeStamp});
      this.afs.collection(`users/${this.currentuser}/Friends`).doc(this.em).update({last_message: this.msg, time: this.getTimeStamp(now), epoch: timeStamp});
      this.msg="";
    }
  }


  deletechat(){
    console.log(this.currentuser);
    this.afs.doc(`users/${this.em}/Friends/${this.currentuser}`).delete();
    this.afs.doc(`users/${this.currentuser}/Friends/${this.em}`).delete();
  }
}




  // handleSubmit(event){
  //   if (event.keyCode === 13) {
  //     this.send();
  //   }
  
