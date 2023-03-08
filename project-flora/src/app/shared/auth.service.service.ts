import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private fireauth : AngularFireAuth,private router : Router) { }




  googleSignIn(){
    return this.fireauth.signInWithPopup( new GoogleAuthProvider).then(res => {
      
      this.router.navigate(['/main']);
      
    },err =>{
      alert(err.message);
    })
  }
}
