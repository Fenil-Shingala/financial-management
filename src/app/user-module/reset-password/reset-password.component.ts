import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserServiceService } from 'src/app/services/api-service/user-service/user-service.service';
import { SharedServiceService } from 'src/app/services/shared-service/shared-service.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  newPasswordVisible = false;
  confirmPasswordVisible = false;
  newPasswordType!: string;
  confirmPasswordType!: string;
  passwordPattern = this.sharedService.passwordPattern
  resetPasswordForm!: FormGroup;
  forgotPasswordUserData = sessionStorage.getItem('forgotPasswordUser')
    ? JSON.parse(sessionStorage.getItem('forgotPasswordUser') || '')
    : null;
  otpMatch = sessionStorage.getItem('otpMatch')
    ? JSON.parse(sessionStorage.getItem('otpMatch') || '')
    : null;

  constructor(
    private resetPasswordFormBuilder: FormBuilder,
    private toster: ToastrService,
    private route: Router,
    private userService: UserServiceService,
    private sharedService: SharedServiceService
  ) {}

  ngOnInit() {
    this.resetPasswordForm = this.resetPasswordFormBuilder.group({
      newPassword: [
        '',
        [Validators.required, Validators.pattern(this.passwordPattern)],
      ],
      confirmPassword: ['', Validators.required],
    });
    this.newPasswordType = 'password';
    this.confirmPasswordType = 'password';

    this.route.navigate([
      this.forgotPasswordUserData && this.otpMatch
        ? '/user-module/reset-password'
        : '/user-module/login',
    ]);
  }

  togglePasswordVisibility(field: string): void {
    if (field === 'newPassword') {
      this.newPasswordType = this.togglePasswordType(this.newPasswordType);
      this.newPasswordVisible = !this.newPasswordVisible;
    } else if (field === 'confirmPassword') {
      this.confirmPasswordType = this.togglePasswordType(
        this.confirmPasswordType
      );
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
    }
  }

  togglePasswordType(type: string): string {
    return type === 'password' ? 'text' : 'password';
  }

  submit(): void {
    if (this.resetPasswordForm.valid) {
      if (
        this.resetPasswordForm.value.newPassword ===
        this.resetPasswordForm.value.confirmPassword
      ) {
        const updatedData = {
          ...this.forgotPasswordUserData,
          password: this.resetPasswordForm.value.newPassword.trim(),
        };

        this.userService
          .updateUserData(this.forgotPasswordUserData.id, updatedData)
          .subscribe({
            next: () => {
              this.toster.success(
                'Password reset successfully',
                'Reset passeord',
                {
                  timeOut: 1100,
                }
              );
              sessionStorage.removeItem('forgotPasswordUser');
              sessionStorage.removeItem('otpMatch');
              this.route.navigate(['/user-module/login']);
            },
          });
      } else {
        this.toster.error('Please check both password', 'Reset password', {
          timeOut: 1100,
        });
      }
    }
  }

  closePage(): void {
    this.sharedService.userModuleClosePage();
  }
}
