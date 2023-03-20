import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs';


interface message{
  message:string;
  where:string;
}


@Component({
  selector: 'app-my-letters',
  templateUrl: './my-letters.component.html',
  styleUrls: ['./my-letters.component.css']
})



export class MyLettersComponent {
  constructor (public afs: AngularFirestore) {}
  userlist: AngularFirestoreCollection<message>;
  user: Observable<message[]>;
  em=JSON.parse(localStorage.getItem('userData') || '{}').email;
  loader: boolean=true;
  flag: boolean=true;

  
  ngOnInit(){
    this.load();
    this.userlist = this.afs.collection(`users/${this.em}/myletters`);
    this.user = this.userlist.snapshotChanges()
    .pipe(map(actions => {
      return actions.map(a => {
        const message=a.payload.doc.data().message;
        const where=a.payload.doc.data().where;
        return { message, where };
      })
    }));
    this.user.subscribe(res => {
      if(this.flag) {
        this.loader=false;
        this.flag=false;
      }
      // console.log(res);
    });
  }


  load(){
    this.loader=true;
    setTimeout(() =>{
      this.loader=false;
    },3000)
  }



}
