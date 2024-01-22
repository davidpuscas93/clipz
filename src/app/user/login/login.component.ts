import { Component } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  showAlert = false;
  alertMessage = 'Please wait...';
  alertColor = 'blue';
  loading = false;

  credentials = {
    email: '',
    password: '',
  };

  constructor(private auth: AuthService) {}

  async login() {
    this.loading = true;
    this.showAlert = true;
    this.alertMessage = 'Please wait...';
    this.alertColor = 'blue';

    const { email, password } = this.credentials;

    try {
      await this.auth.login(email, password);
      this.alertMessage = 'Login successful!';
      this.alertColor = 'green';
    } catch (error) {
      console.error(error);
      this.alertMessage =
        'An unexpected error occurred. Please try again later.';
      this.alertColor = 'red';
    }

    this.loading = false;
  }
}
