import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})



export class AboutComponent {
  constructor(public afs: AngularFirestore){};

  loader=false;
  em=JSON.parse(localStorage.getItem('userData') || '{}').email;
  name:string;
  username:string;

  ngOnInit() {
    this.load();
    this.afs.doc(`users/${this.em}`).get().subscribe(ref => {
      // console.log(ref);
      if(!ref.exists){
      
      // console.log("notfound")// //DOC DOES NOT EXIST
      
      }else{
      
      const doc:any = ref.data();
      
      this.name = doc.FIRST_NAME;
      this.username = "@"+doc.USERNAME;
      
      // console.log(this.name) //LOG ENTIRE DOC
      
      }
      
      });


      
      }
      load(){
        this.loader=true;
        setTimeout(() =>{
          this.loader=false;
        },1000)
      }      
}
