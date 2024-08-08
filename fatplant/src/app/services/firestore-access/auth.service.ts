import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loginStatus = new Subject();
  constructor(public afAuth: AngularFireAuth, private router: Router, private afs: AngularFirestore){
  }

  googleLogin() {
    console.log('google!!!!');
    return this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  emailLogin(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  emailRegister(email, password) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  getUsers() {
    return this.afs.collection('users').get();
  }

  findUser(email) {
    return this.afs.collection('users', ref =>
        ref.where('email', '==', email)
      ).get();
  }

  addUser(user) {
    return this.afs.collection('users').add(user);
  }

  updateUser(user, id) {
    return this.afs.collection('users').doc(id).update(user);
  }

  assignAdmin(uid) {
    return this.afs.collection('users', ref =>
        ref.where('uid', '==', uid)
      ).get();
  }

  doLogout() {
    return this.afAuth.auth.signOut();
  }

  checkUser() {
    return this.afAuth.user;
  }

  watchLogin() {
    return this.loginStatus;
  }

  resetPassword(email) {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  getAdmins() {
    return this.afs.collection('users', ref =>
      ref.where('admin', '<=', 1)
    ).get();
  }


}
