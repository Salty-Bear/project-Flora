import { Component } from '@angular/core';
// import { ChatService } from 'src/services/chat.service';
import { AngularFireList } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';


interface Post{
  title: string;
  content: string;
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
  posts: any;
  title:string;
  content:string;


  constructor(public afs: AngularFirestore) {}



  ngOnInit() {
    this.postsCol = this.afs.collection('posts');
    // this.posts = this.postsCol.valueChanges();
    // this.posts = this.postsCol.snapshotChanges()
    // .map( actions => {
    //   return actions.map(a =>{
    //     const data=a.payload.doc.data() as Post;
    //     const id = a.payload.doc.id;
    //     return {id,data};
    //   })
    // }
  }
  

  // send(){
  //   this.chat.sendMessage(this.message);
  // }

  // handleSubmit(event){
  //   if (event.keyCode === 13) {
  //     this.send();
  //   }
  // }

}
