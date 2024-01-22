import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { FirebaseError } from 'firebase/app';

import { AuthService } from 'src/app/services/auth.service';

import { IUser } from 'src/app/models/user.model';

import { RegisterValidators } from '../validators/register-validators';
import { EmailTaken } from '../validators/email-taken';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(private auth: AuthService, private emailTaken: EmailTaken) {}

  loading = false;
  /** Some validation can be added as HTML5 attributes in the template file. */
  name = new FormControl('', [Validators.required, Validators.minLength(3)]);
  email = new FormControl(
    '',
    [Validators.required, Validators.email],
    [this.emailTaken.validate]
  );
  age = new FormControl('', [
    Validators.required,
    Validators.min(18),
    Validators.max(120),
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm),
  ]);
  confirmPassword = new FormControl('', [Validators.required]);
  phoneNumber = new FormControl('', [
    Validators.minLength(14),
    Validators.maxLength(14),
  ]);

  showAlert = false;
  alertMessage = 'Your account is being created. Please wait...';
  alertColor = 'blue';

  registerForm = new FormGroup(
    {
      name: this.name,
      email: this.email,
      age: this.age,
      password: this.password,
      confirmPassword: this.confirmPassword,
      phoneNumber: this.phoneNumber,
    },
    [RegisterValidators.match('password', 'confirmPassword')]
  );

  /** This method is called when the form is submitted. */
  async register() {
    this.loading = true;
    this.showAlert = true;
    this.alertMessage = 'Your account is being created. Please wait...';
    this.alertColor = 'blue';

    const { email, password, name, age, phoneNumber } = this.registerForm.value;

    try {
      await this.auth.createUser({
        email,
        password,
        name,
        age,
        phoneNumber,
      } as IUser);
    } catch (error) {
      switch ((error as FirebaseError).code) {
        case 'auth/email-already-in-use':
          this.alertMessage =
            'The email address is already in use by another account.';
          break;
        case 'auth/invalid-email':
          this.alertMessage = 'The email address is not valid.';
          break;
        case 'auth/operation-not-allowed':
          this.alertMessage =
            'The email/password accounts are not enabled. Enable them in the Firebase console, under the Auth tab.';
          break;
        case 'auth/weak-password':
          this.alertMessage = 'The password is not strong enough.';
          break;
        default:
          this.alertMessage =
            'An unexpected error occured. Please try again later.';
          break;
      }

      this.loading = false;
      this.showAlert = true;
      this.alertColor = 'red';

      console.error(error);
      return;
    }

    this.loading = false;
    this.showAlert = true;
    this.alertMessage = 'Your account was created successfully.';
    this.alertColor = 'green';
  }
}
