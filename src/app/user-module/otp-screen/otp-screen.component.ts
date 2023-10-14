import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharedServiceService } from 'src/app/services/shared-service/shared-service.service';

@Component({
  selector: 'app-otp-screen',
  templateUrl: './otp-screen.component.html',
  styleUrls: ['./otp-screen.component.scss'],
})
export class OtpScreenComponent {
  otp = Math.floor(100000 + Math.random() * 900000);
  otpForm!: FormGroup;
  forgotPasswordUserData = sessionStorage.getItem('forgotPasswordUser')
    ? JSON.parse(sessionStorage.getItem('forgotPasswordUser') || '')
    : null;
  otpMatch = sessionStorage.getItem('otpMatch')
    ? JSON.parse(sessionStorage.getItem('otpMatch') || '')
    : null;

  constructor(
    private otpFormBuilder: FormBuilder,
    private toster: ToastrService,
    private route: Router,
    private sharedService: SharedServiceService,
  ) {}

  ngOnInit() {
    this.otpForm = this.otpFormBuilder.group({
      otpNumber: ['', Validators.required],
    });
    this.route.navigate([
      this.forgotPasswordUserData && !this.otpMatch
        ? '/user-module/otp-screen'
        : '/user-module/login',
    ]);
  }

  submit(): void {
    if (this.otpForm.value.otpNumber === this.otp) {
      sessionStorage.setItem('otpMatch', JSON.stringify(true));
      this.toster.success('OTP match', 'OTP', { timeOut: 1100 });
      this.route.navigate(['/user-module/reset-password']);
    } else {
      this.toster.error('OTP does not match', 'OTP', { timeOut: 1100 });
    }
  }

  closePage(): void {
    this.sharedService.userModuleClosePage();
  }
}
