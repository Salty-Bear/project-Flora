import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../app/models/user.model';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';


interface LoginResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

interface refreshTokenResData {
  expires_in: string;
  id_token: string;
}

interface post{
  EMAIL_ADD: string;
  FIRST_NAME: string;
  LAST_NAME: string;
  PASSWORD: string | null;
  USERNAME: string;
}

@Injectable({
  providedIn: 'root'
})

export class LoginService {
  user = new BehaviorSubject<User | boolean>(false);
  tokenExpirationTimer: any;
  model: post;
  productsRef: AngularFirestoreCollection<post>;
  posts: Observable<post[]>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private fireauth : AngularFireAuth,
    private afs: AngularFirestore
  ) {this.productsRef = this.afs.collection<post>('users');}

  signup(email: string, pass:string) {
    return this.http.post<LoginResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCXDVFX6EdK1-4DpbEGrqocOgpPAEqN7DQ',
    { email: email,
      password: pass,
      returnSecureToken: true
    }
    ).pipe(
        catchError(
          errorRes => {
            console.log(errorRes);
            if (!errorRes.error || !errorRes.error.error.message){
              return throwError("UNKNOWN_ERROR");
            }
            else {
              switch(errorRes.error.error.message) {
                case 'EMAIL_EXISTS': {
                  return throwError("EMAIL_EXISTS");
                  break;
                }
                case 'WEAK_PASSWORD : Password should be at least 6 characters': {
                  return throwError("WEAK_PASSWORD : Password should be at least 6 characters");
                  break;
                }
                default: {
                  return throwError("UNKNOWN_ERROR");
                }
              }
            }
          }
        ),
        tap(
          resData => {
            const expirationDate = new Date(new Date().getTime() + +resData.expiresIn*1000);
            const user = new User(resData.email, resData.localId, resData.idToken, expirationDate);
            this.user.next(user);
            localStorage.setItem("userData", JSON.stringify(user));
          }
        ) 
      )
  }

  login(email: string,pass:string) {
    return this.http.post<LoginResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCXDVFX6EdK1-4DpbEGrqocOgpPAEqN7DQ',
    { email:email,
      password:pass,
      returnSecureToken:true
    }
    ).pipe(
      catchError(
        errorRes => {
          console.log(errorRes);
          if( !errorRes.error || !errorRes.error.error.message) {
            return throwError("UNKNOWN_ERROR");
          }
          else {
            return throwError("COMMON_ERROR");
          }
        }
      ),
      tap(
        resData => {
          const expirationDate = new Date(new Date().getTime() + +resData.expiresIn*1000);
          const user = new User(resData.email, resData.localId, resData.idToken, expirationDate);
          this.user.next(user);
          this.autoLogout(+resData.expiresIn*1000);
          localStorage.setItem("userData", JSON.stringify(user));
        }
      ) 
    )
  }

  googleSignIn(){
    return this.fireauth.signInWithPopup(new GoogleAuthProvider).then(
      res => {
        console.log(res);
        if(res.additionalUserInfo!.isNewUser) {
          this.model={
            EMAIL_ADD: res.user!.email!,
            FIRST_NAME: res.user!.displayName!.split(" ")[0],
            LAST_NAME: res.user!.displayName!.split(" ")[res.user!.displayName!.split(" ").length-1],
            PASSWORD: null,
            USERNAME: res.user!.displayName!
          }
          this.productsRef.doc(res.user!.email!).set(this.model); //.then( _ => alert("hogya send"));
        }
        this.http.post<refreshTokenResData>('https://securetoken.googleapis.com/v1/token?key=AIzaSyCXDVFX6EdK1-4DpbEGrqocOgpPAEqN7DQ',
        { grant_type: "refresh_token",
          refresh_token: res.user!.refreshToken
        }).subscribe(
          resData=> {
            
            const expirationDate = new Date(new Date().getTime() + +resData.expires_in*1000);
            const user = new User(res.user!.email!, res.user!.uid!, resData.id_token, expirationDate);
            this.user.next(user);
            this.autoLogout(+resData.expires_in*1000);
            localStorage.setItem("userData", JSON.stringify(user));
            this.router.navigate(['/main']);
          }
        )
      },
      err =>{
        alert(err.message);
      }
    )
  }

  logOut() {
    this.user.next(null!);
    localStorage.removeItem('userData');
    this.router.navigate(['/']);
    if(this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer=null;
  }

  autoLogin() {
    const userData: {
      email: string, 
      id: string,
      _token: string,
      _tokenExpirationDate: string}=JSON.parse(localStorage.getItem('userData') || '{}');

    if(!userData) {
      return;
    }

    const loadedUser=new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration=new Date(userData._tokenExpirationDate).getTime()-new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(()=>{
      this.logOut();
    }, expirationDuration);
  }

}