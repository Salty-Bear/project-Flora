import { Component } from '@angular/core';
// import { ChatService } from 'src/services/chat.service';
import { AngularFireList } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs';

interface Post{
  sender:string;
  content:string;
}

interface friends{
  email:string;
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

  constructor(public afs: AngularFirestore) {}

  em=JSON.parse(localStorage.getItem('userData') || '{}').email;
  id="orange@gmail.com"

  ngOnInit() {
    this.userlist=this.afs.collection(`users/${this.em}/Friends`);

    this.user = this.userlist.snapshotChanges()
    .pipe(map(actions => {
      return actions.map(a => {
        const email=a.payload.doc.id;
        return {email};
      })
    }))
    console.log(this.friends);
    this.user.subscribe(res =>{
      res.forEach( a =>{
        this.afs.doc(`users/${a.email}`).get().subscribe(ref =>{
          if(!ref.exists){
            console.log("notfound")// //DOC DOES NOT EXIST
          }
          else{
            const doc:any = ref.data();
            this.friends.push({email:a.email,f_name:doc.FIRST_NAME})
          }
          
      })
      }

      )
    })
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
  console.log("hogya entry")
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
  
