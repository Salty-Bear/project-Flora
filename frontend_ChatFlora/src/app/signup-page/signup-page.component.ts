import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Signup } from '../signup-page/signup.model';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoginService } from 'src/services/login.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AngularFireStorage} from '@angular/fire//compat/storage';

interface post{
  EMAIL_ADD:string;
  FIRST_NAME:string;
  LAST_NAME:string;
  PASSWORD:string;
  USERNAME:string;
}



@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css']
})




export class SignupPageComponent {

  model: post;
  u_id:string;
  isLoginMode = true;
  errorMessage: string;
  f_name: string;
  l_name: string;
  u_name: string;
  email: string;
  password: string;
  rePassword: string;
  object: any;




  productsRef: AngularFirestoreCollection<post>;
  posts: Observable<post[]>;
  constructor(private loginService: LoginService,private router: Router,private http: HttpClient,private afs: AngularFirestore,private af: AngularFireStorage){
    this.productsRef = this.afs.collection<post>('users');

 
  }





  onSubmit(form: NgForm){
    const email=form.value.email;
    const password =  form.value.password;

    if(this.password!=this.rePassword) {
      this.errorMessage = "Password does not match";
    }
    else {
      this.loginService.signup(email, password).
      subscribe(
        respondData => {
          //making user ready for authentication
          this.http.post('https://flora-fbf5b-default-rtdb.firebaseio.com/users.json',{email: this.email}).subscribe(respondData => {console.log(respondData)});
          //Creating model to add it later in the firestore
          this.model={
            EMAIL_ADD:this.email,
            FIRST_NAME:this.f_name,
            LAST_NAME:this.l_name,
            PASSWORD:this.password, 
            USERNAME:this.u_name
          }


          this.productsRef.doc(this.email).set(this.model).then( _ => alert("Signed up Successfully!!"));     //adding data to firestore
          // this.http.post('https://flora-fbf5b-default-rtdb.firebaseio.com/profiles.json',{firstName:this.f_name,lastName:this.l_name,userName:this.u_name,email: this.email,password:this.password}).subscribe(respondData => {console.log(respondData)});
          this.router.navigate(['/']);  //navigating to login page
        },
        errorMessage => {
          this.errorMessage = errorMessage;
        }
      );
    }
  }
}
