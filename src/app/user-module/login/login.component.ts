import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/interface/user';
import { UserServiceService } from 'src/app/services/api-service/user-service/user-service.service';
import { CryptoService } from 'src/app/services/crypto/crypto.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  passwordVisible = false;
  passwordType!: string;
  allUserData: User[] = [];
  loginFrom!: FormGroup;
  forgotPasswordUserData = sessionStorage.getItem('forgotPasswordUser')
    ? JSON.parse(sessionStorage.getItem('forgotPasswordUser') || '')
    : null;
  otpMatch = sessionStorage.getItem('otpMatch')
    ? JSON.parse(sessionStorage.getItem('otpMatch') || '')
    : null;

  constructor(
    private loginFormBuilder: FormBuilder,
    private toster: ToastrService,
    private route: Router,
    private userService: UserServiceService,
    private crypto: CryptoService
  ) {}

  ngOnInit() {
    this.loginFrom = this.loginFormBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.passwordType = 'password';
    this.userService.getAllUserData().subscribe({
      next: (value) => {
        this.allUserData = value;
      },
    });
    if (this.forgotPasswordUserData) {
      this.route.navigate([
        !this.otpMatch
          ? '/user-module/otp-screen'
          : this.otpMatch
          ? 'user-module/reset-password'
          : 'user-module/login',
      ]);
    }
  }

  submit(): void {
    const email = String(this.loginFrom.value.email || '').trim();
    const password = String(this.loginFrom.value.password || '');
    const checkLoginDetails = this.allUserData.find((data) => {
      if (data.email !== email) return false;
      const stored = data.password || '';
      const decrypted = this.crypto.decrypt(stored);
      return decrypted === password;
    });

    if (checkLoginDetails) {
      this.route.navigate(['/main-module/dashboard']);
      this.toster.success('Login successfully', 'Login', { timeOut: 1100 });
      localStorage.setItem('loginUser', JSON.stringify(checkLoginDetails));
    } else {
      this.toster.error('Your credential are wrong', 'Login', {
        timeOut: 1100,
      });
    }
  }

  passwordShowHide(): void {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
      this.passwordVisible = true;
    } else {
      this.passwordType = 'password';
      this.passwordVisible = false;
    }
  }
}
