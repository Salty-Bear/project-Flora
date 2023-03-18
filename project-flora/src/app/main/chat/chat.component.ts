import { Component, AfterViewChecked, ViewChild } from '@angular/core';
// import { ChatService } from 'src/services/chat.service';
import { AngularFireList } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, timeInterval } from 'rxjs';
import { map, take } from 'rxjs';
import { orderBy, limit } from 'firebase/firestore';
import { EmailAuthProvider } from 'firebase/auth';

interface Post{
  message: string;
  email: string;
  timestamp: string;
  time: string;
}

interface friends{
  email:string;
  f_name:string;
}


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})



export class ChatComponent {
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

  showTextField: boolean = false;

  element = document.getElementsByClassName('message-window'); // Replace 'myElement' with the ID of your element


  month: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

  loader=true;
  constructor(public afs: AngularFirestore) {}
  em=JSON.parse(localStorage.getItem('userData') || '{}').email;

  // ngAfterViewChecked() {
  //   console.log(1);
  //   this.toScroll.nativeElement.scrollTop = this.toScroll.nativeElement.scrollHeight;
  // }

  // load(){
  //   this.loader=true;
    
  // }

  ngOnInit() {
    this.load();
    this.userlist=this.afs.collection(`users/${this.em}/Friends`);
    this.user= this.userlist.snapshotChanges()
    .pipe(map(action=>{
      return action.map(a=> {
        const email=a.payload.doc.id;
        const f_name=a.payload.doc.data().f_name;
        return {
          email, f_name
        }
      })
    }))
    console.log(this.user);
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


  load(){
    this.loader=true;
    setTimeout(() =>{
      this.loader=false;
    },3000)
  }

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
          console.log(a.payload.doc.data());
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
    setTimeout(() =>{
      console.log("1");
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
      const timestamp = now.getTime().toString();
      this.afs.collection(`users/${this.em}/Friends/${this.currentuser}/messages`).add({email:this.em, message:this.msg, timestamp: timestamp, time: this.getTimeStamp(now)}).then();
      this.afs.collection(`users/${this.currentuser}/Friends/${this.em}/messages`).add({email:this.em, message:this.msg, timestamp: timestamp, time: this.getTimeStamp(now)}).then();
      this.msg="";
    }
  }
}




  // handleSubmit(event){
  //   if (event.keyCode === 13) {
  //     this.send();
  //   }
  
