import { Component } from '@angular/core';
// import { ChatService } from 'src/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  message: string;

  // constructor(private chat: ChatService) {}

  // send(){
  //   this.chat.sendMessage(this.message);
  // }

  // handleSubmit(event){
  //   if (event.keyCode === 13) {
  //     this.send();
  //   }
  // }

}
