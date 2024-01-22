import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';

import { Observable, of } from 'rxjs';
import { map, delay, filter, switchMap } from 'rxjs/operators';

import { IUser } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public isAuthenticated$: Observable<boolean>;
  public isAuthenticatedWithDelay$: Observable<boolean>;
  public redirect: boolean = false;

  private usersCollection: AngularFirestoreCollection<IUser>;

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.usersCollection = this.firestore.collection('users');
    this.isAuthenticated$ = this.auth.user.pipe(map((user) => !!user));
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(delay(1000));
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute.firstChild),
        switchMap((route) => route?.data ?? of({ authOnly: false }))
      )
      .subscribe((data) => {
        this.redirect = data.authOnly ?? false;
      });
  }

  public async createUser(data: IUser) {
    const { email, password, name, age, phoneNumber } = data;

    if (!password) {
      throw new Error('Password is required.');
    }

    const userCredentials = await this.auth.createUserWithEmailAndPassword(
      email,
      password
    );

    if (!userCredentials.user) {
      throw new Error('User credentials not found.');
    }

    await this.usersCollection.doc(userCredentials.user.uid).set({
      name,
      email,
      age,
      phoneNumber,
    });

    await userCredentials.user.updateProfile({
      displayName: name,
    });
  }

  public async login(email: string, password: string) {
    await this.auth.signInWithEmailAndPassword(email, password);
  }

  public async logout() {
    await this.auth.signOut();
    if (this.redirect) {
      await this.router.navigateByUrl('/');
    }
  }
}
