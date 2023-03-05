import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../app/models/user.model';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class LoginService {
  isUserLoggedIn = new BehaviorSubject<boolean>(false); 
  constructor(private http: HttpClient, private router: Router) { }

  signup(email: string,pass:string){
    return this.http.post('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCXDVFX6EdK1-4DpbEGrqocOgpPAEqN7DQ',
      {email: email,
      password: pass,
      returnSecureToken: true
    }
    )
  }

  login(email: string,pass:string){
    return this.http.post('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCXDVFX6EdK1-4DpbEGrqocOgpPAEqN7DQ',
    { email:email,
      password:pass,
      returnSecureToken:true
    },
    {
      observe: 'response'
    }).
    subscribe((result) => {
      this.isUserLoggedIn.next(true); 
      this.router.navigate(['/main']);
      // console.log(result);
    } 
    )
  }
}