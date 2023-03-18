import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';

interface Letter{
  message: string;
  sender: string;
}

@Component({
  selector: 'app-my-letters',
  templateUrl: './my-letters.component.html',
  styleUrls: ['./my-letters.component.css']
})

export class MyLettersComponent {
  lettersCol: AngularFirestoreCollection<Letter>;
  letters: Observable<Letter[]>;

  constructor(public afs: AngularFirestore) {}
  em=JSON.parse(localStorage.getItem('userData') || '{}').email;


  retrieveLetters() {
    this.lettersCol=this.afs.collection(`users/${this.em}/Letters`);
    this.letters=this.lettersCol.snapshotChanges()
    .pipe(map(actions => {
      return actions.map( a=> {
        const message=a.payload.doc.data().message;
        const sender=a.payload.doc.data().sender;
        console.log(a.payload.doc.data());
        return {message, sender};
      })
    }))
  }
  
 ngOnInit() {
  console.log(this.em);
  this.retrieveLetters();
 }

}
