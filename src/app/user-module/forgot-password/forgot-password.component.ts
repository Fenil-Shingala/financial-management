import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/interface/user';
import { UserServiceService } from 'src/app/services/api-service/user-service/user-service.service';
import { SharedServiceService } from 'src/app/services/shared-service/shared-service.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  allUserData: User[] = [];
  forgotPasswordForm!: FormGroup;
  forgotPasswordUserData = sessionStorage.getItem('forgotPasswordUser')
    ? JSON.parse(sessionStorage.getItem('forgotPasswordUser') || '')
    : null;

  constructor(
    private forgotPasswordFormBuilder: FormBuilder,
    private toster: ToastrService,
    private route: Router,
    private userService: UserServiceService,
    private sharedService: SharedServiceService
  ) {}

  ngOnInit() {
    this.forgotPasswordForm = this.forgotPasswordFormBuilder.group({
      email: ['', [Validators.required]],
    });
    this.route.navigate([
      this.forgotPasswordUserData
        ? '/user-module/login'
        : '/user-module/forgot-password',
    ]);
    this.userService.getAllUserData().subscribe({
      next: (value) => {
        this.allUserData = value;
      },
      error: () => {},
    });
  }

  submit(): void {
    const checkEmailAvability = this.allUserData.find(
      (value) => value.email === this.forgotPasswordForm.value.email
    );
    if (checkEmailAvability) {
      this.toster.success('OTP send', 'Forgot password', { timeOut: 1100 });
      this.route.navigate(['/user-module/otp-screen']);
      sessionStorage.setItem(
        'forgotPasswordUser',
        JSON.stringify(checkEmailAvability)
      );
    } else {
      this.toster.error('Email does not exist', 'Forgot password', {
        timeOut: 1100,
      });
    }
  }

  closePage(): void {
    this.sharedService.userModuleClosePage();
  }
}
