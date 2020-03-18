import { Injectable, NgZone } from '@angular/core';
import { User } from "../user/user";
import { auth } from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { NotificationService } from '../notification/notification.service';

declare var $: any;

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  userData: any; // Save logged in user data
  isAdmin: boolean = false;

  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,  
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    public notification: NotificationService,
    public spinner: NgxSpinnerService
  ) {    
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        this.setIsAdminIn(user.uid);
        this.userData.isAdmin = this.isAdmin;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    })
  }

  // Sign in with email/password
  async signIn(email, password) {
    this.spinner.show();
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((result) => { 
        this.ngZone.run(() => {
          setTimeout(() => {
            this.spinner.hide();
            this.router.navigate(['dashboard']);
          }, 50);
        });
        this.setUserData(result.user);
      }).catch((error) => {
        // window.alert(error.message)
        this.spinner.hide();
        this.notification.showNotification('top', 'center', 'danger', 'warning', error.message);
      })
  }

  // Sign up with email/password
  async signUp(email, password) {
    try {
      this.spinner.show();
      const result = await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
      /* Call the SendVerificaitonMail() function when new user sign
      up and returns promise */
      this.spinner.hide();
      this.notification.showNotification('top', 'center', 'success', 'check', 'Register success!');
      this.sendVerificationMail();
      this.setUserData(result.user);
    }
    catch (error) {
      // window.alert(error.message);
      this.spinner.hide();
      this.notification.showNotification('top', 'center', 'danger', 'warning', error.message);

    }
  }

  // Send email verfificaiton when new user sign up
  async sendVerificationMail() {
    return this.afAuth.auth.currentUser.sendEmailVerification()
    .then(() => {
      // this.router.navigate(['verify-email-address']);
      this.notification.showNotification('top', 'center', 'success', 'check', 'Email sent. Check your inbox!');
      this.router.navigate(['login']);
    })
  }

  // Reset Forggot password
  async forgotPassword(passwordResetEmail) {
    return this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail)
    .then(() => {
      // window.alert('Password reset email sent, check your inbox.');
      this.notification.showNotification('top', 'center', 'success', 'check', 'Password reset email sent, check your inbox.');
      this.router.navigate(['login']);
    }).catch((error) => {
      // window.alert(error)
      this.notification.showNotification('top', 'center', 'danger', 'warning', error);
    })
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false && this.isAdmin !== false) ? true : false;
  }

  // Sign in with Google
  googleAuth() {
    return this.authLogin(new auth.GoogleAuthProvider());
  }

  // Sign in with Facebook
  facebookAuth() {
    return this.authLogin(new auth.FacebookAuthProvider());
  }

  // Auth logic to run auth providers
  async authLogin(provider) {
    this.spinner.show();
    return this.afAuth.auth.signInWithPopup(provider)
    .then((result) => {
       this.ngZone.run(() => {
         setTimeout(() => {
          this.spinner.hide();
          this.router.navigate(['dashboard']);
         }, 500);
        })
      this.setUserData(result.user);
    }).catch((error) => {
      // window.alert(error)
      this.spinner.hide();
      this.notification.showNotification('top', 'center', 'danger', 'warning', error.message);
    })
  }

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  setUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    this.setIsAdminIn(user.uid);
    // console.log(this.isAdmin);
    if(!this.isAdmin) 
    this.notification.showNotification('top', 'center', 'warning', 'warning', 'You are not allowed to access!' );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      isAdmin: this.isAdmin
    }
    return userRef.set(userData, {
      merge: true
    })
  }

  async setIsAdminIn(uid){
      const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${uid}`);
      const userD = userRef.valueChanges();
      userD.subscribe(value => {
        this.isAdmin = value.isAdmin;
      });
}

  // Sign out 
  async signOut() {
    return this.afAuth.auth.signOut().then(() => {
      localStorage.removeItem('user');
      setTimeout(() => {
        this.router.navigate(['login']);
      }, 500);

    })
  }

}