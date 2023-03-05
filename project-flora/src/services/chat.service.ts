// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { ChatMessage } from 'src/app/models/chat.model';
// import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/compat/firestore';
// import { AngularFireDatabase } from '@angular/fire/compat/database';

// @Injectable({
//   providedIn: 'root'
// })
// export class ChatService {
//   user:any;
//   chatMessages: AngularFirestoreCollection<ChatMessage[]>;
//   chatMessage: ChatMessage;
//   userName: Observable<string>;


//   constructor(
//     private db: AngularFireDatabase,
//     private chat: ChatMessage
//   ) {}


//   sendMessage(msg: string){
//     const timestamp = this.getTimeStamp();
//     const email = this.user.email;
//     this.chatMessages = this.getMessages();
//     this.chatMessages.push({
//       message:msg,
//       timeSent: timestamp,
//       userName: this.userName,
//       email: email
//     })
//   }

//   getTimeStamp() {
//     const now = new Date();
//     const date = now.getUTCFullYear() + '/' +(now.getUTCMonth()+1) + '/' +  now.getUTCDate();
//     const time = now.getUTCHours() + ':' + now.getUTCMinutes() + ':' + now.getUTCSeconds();
//     return (date + ' ' + time);
//   }

//   getMessages(): AngularFirestoreCollection<ChatMessage[]>{
    
//     return this.db.list('messages', {
//       query: {
//         limitToLast: 25,
//         orderByKey: true
//       }
//     });
//   }

// }
