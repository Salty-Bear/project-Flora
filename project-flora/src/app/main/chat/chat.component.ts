import { Component } from '@angular/core';
// import { ChatService } from 'src/services/chat.service';
import { AngularFireList } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';


interface Post{
  sender:string;
  content:string;
}

interface PostId extends Post{
  id: string;
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



  constructor(public afs: AngularFirestore) {}

  em=JSON.parse(localStorage.getItem('userData') || '{}').email;
  id="orange@gmail.com"

  ngOnInit() {
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

  retrievechat(){
    // this.afs.doc(`users/${this.em}/Friends/${this.id}/`).get().subscribe(ref => {
    //   console.log(ref);
    //   if(!ref.exists){
      
    //     console.log("notfound")// //DOC DOES NOT EXIST
        
    //     }else{
        
    //     const doc:any = ref.data();

    //     console.log("hello")
    //     this.posts=doc;
    //     console.log(doc) //LOG ENTIRE DOC
        
    //     }
    //   });
  }


  send(){
    if(this.msg!="" || this.msg !=null){
    this.afs.collection(`users/${this.em}/Friends/orange@gmail.com/messages`).add({email:this.em,message:this.msg,timestamp:new Date().getTime()}).then( _ => alert("hogya send"));
    this.msg="";
    console.log(Math.floor(Date.now() / 1000));
    }
  }
}




  // handleSubmit(event){
  //   if (event.keyCode === 13) {
  //     this.send();
  //   }
  
