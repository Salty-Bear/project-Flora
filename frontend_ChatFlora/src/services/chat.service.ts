import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatMessage } from 'src/app/models/chat.model';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/compat/firestore';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { orderByKey } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  user:any;
  chatMessages: Observable<ChatMessage[]>
  chatMessage: ChatMessage;
  userName: Observable<string>;


  constructor(
    private db: AngularFireDatabase,
    private adAuth: AngularFireAuth
  ) {
    this.adAuth.authState.subscribe(auth =>{
        if(auth !== undefined && auth !==null){
            this.user = auth;

        }
    });
  }





}
