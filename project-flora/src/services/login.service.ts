import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../app/models/user.model';
import { catchError } from 'rxjs/operators';
import { throwError,Subject, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class LoginService {


  constructor(private http: HttpClient,private router:Router) { }
  isUserLoggedIn = new BehaviorSubject<boolean>(false);


  signup(email: string,pass:string){
    return this.http.post('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCXDVFX6EdK1-4DpbEGrqocOgpPAEqN7DQ',
      {email: email,
      password: pass,
      returnSecureToken: true
    }
    )
  }

  login(email: string,pass:string){
    this.isUserLoggedIn.next(true);
    return this.http.post('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCXDVFX6EdK1-4DpbEGrqocOgpPAEqN7DQ',
    { email:email,
      password:pass,
      returnSecureToken:true
    })
  }
}