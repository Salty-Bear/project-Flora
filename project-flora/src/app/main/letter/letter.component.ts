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
  constructor(public afs: AngularFirestore){



  };
  userlist: AngularFirestoreCollection<userlist1>;
  user: Observable<userlist1[]>;
  target:any;
  targetuser:any;
  em=JSON.parse(localStorage.getItem('userData') || '{}').email;
  letter:any;
  receivername:string;

  gettar(res:any){
    this.target=Math.floor(Math.random() * (res.length) );
    while(res[this.target].id == this.em) {
      this.target=Math.floor(Math.random()*res.length);
    }
    console.log(this.target);
    this.targetuser=res[this.target].id;
    console.log(this.targetuser,this.target);
    
    if(this.letter!="" && this.letter!=null ) {
      const letterindata:any=this.letter;
      this.afs.collection(`users/${this.targetuser}/Letters`).add({message:this.letter,sender:this.em})
      alert("sent successfully")

      this.afs.doc(`users/${this.targetuser}`).get().subscribe( res =>{
        const doc:any=res.data();
        this.receivername=doc.FIRST_NAME;
        console.log("ok")
        console.log(this.letter);
        this.afs.collection(`users/${this.em}/myletters`).add({message:letterindata,where:this.receivername});
      });
    }
    this.letter="";
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

