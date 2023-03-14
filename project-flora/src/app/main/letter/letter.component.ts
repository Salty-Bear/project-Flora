import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs';

interface userlist1{
  id:string;
}

@Component({
  selector: 'app-letter',
  templateUrl: './letter.component.html',
  styleUrls: ['./letter.component.css']
})




export class LetterComponent {
  constructor(public afs: AngularFirestore){};
  userlist: AngularFirestoreCollection<userlist1>;
  user: Observable<userlist1[]>;
  target:any;
  em=JSON.parse(localStorage.getItem('userData') || '{}').email;
  letter:string;

  gettar(res:any){
    this.target=Math.floor((Math.random()*res.length)%res.length);
    while(res[this.target].id == this.em) {
      this.target=Math.floor((Math.random()*res.length)%res.length);
    }

  }



  sendletter(){
    this.userlist = this.afs.collection('users');
    this.user = this.userlist.snapshotChanges()
      .pipe(map(actions => {
        return actions.map(a => {
          const id=a.payload.doc.id;
          return { id};
        })
      }));



     this.user.subscribe(res =>
      this.gettar(res))
  }

  }

