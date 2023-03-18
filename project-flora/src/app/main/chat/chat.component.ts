import { Component } from '@angular/core';
// import { ChatService } from 'src/services/chat.service';
import { AngularFireList } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, timeInterval } from 'rxjs';
import { map, take } from 'rxjs';
import { orderBy, limit } from 'firebase/firestore';

interface Post{
  message:string;
  email:string;
  timestamp: string;
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
  postsCol: AngularFirestoreCollection<Post>;
  posts: Observable<Post[]>;
  msg:string;
  // friends:string[]=[];
  friends:{email:string,f_name:string}[]=[];
  userlist: AngularFirestoreCollection<friends>;
  user: Observable<friends[]>;
  currentuser:string;
  messages:{message:string,email:string,timestamp:string}[]=[];


  constructor(public afs: AngularFirestore) {}
  em=JSON.parse(localStorage.getItem('userData') || '{}').email;

  ngOnInit() {
    this.userlist=this.afs.collection(`users/${this.em}/Friends`);


    this.user = this.userlist.snapshotChanges()
    .pipe(map(actions => {
      return actions.map(a => {
        const email=a.payload.doc.id;
        const f_name=a.payload.doc.data().f_name;
        return {email,f_name};
      })
    }))
    // console.log(this.friends);
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
    // })
    console.log(this.friends);






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

onContactClick(friend:any){
  this.currentuser=friend.email;
      this.postsCol=this.afs.collection(`users/${this.em}/Friends/${friend.email}/messages`, ref => ref.orderBy('timestamp').limit(25));
      this.posts=this.postsCol.snapshotChanges()
      .pipe(map(actions => {
        return actions.map( a=> {
          const message=a.payload.doc.data().message;
          const email=a.payload.doc.data().email;
          const timestamp=a.payload.doc.data().timestamp;
          console.log(a.payload.doc.data());
          return {message,email,timestamp};
        })
      }))
      // this.posts.pipe(take(1)).subscribe(res =>{
      //   res.forEach(i => {
      //     this.messages.push({message:i.message,email:i.email,timestamp:i.timestamp});
      //   });
      // })
}







  send(){
    if(this.msg!="" && this.msg !=null){
      const timestamp = new Date().getTime().toString();
      this.afs.collection(`users/${this.em}/Friends/${this.currentuser}/messages`).add({email:this.em,message:this.msg,timestamp: timestamp}).then();
      this.afs.collection(`users/${this.currentuser}/Friends/${this.em}/messages`).add({email:this.em,message:this.msg,timestamp: timestamp}).then();
      // this.messages.push({message:this.msg.toString(),email:this.em,timestamp: timestamp});
      this.msg="";
    }
  }
}




  // handleSubmit(event){
  //   if (event.keyCode === 13) {
  //     this.send();
  //   }
  
