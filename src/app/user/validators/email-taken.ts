import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AbstractControl,
  ValidationErrors,
  AsyncValidator,
} from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class EmailTaken implements AsyncValidator {
  constructor(private auth: AngularFireAuth) {}

  /** The fetchSignInMethodsForEmail is now broken after a Google update of September 15th, 2023. */
  validate = (control: AbstractControl): Promise<ValidationErrors | null> => {
    return this.auth
      .fetchSignInMethodsForEmail(control.value)
      .then((signInMethods) => {
        return signInMethods.length > 0 ? { emailTaken: true } : null;
      });
  };
}
