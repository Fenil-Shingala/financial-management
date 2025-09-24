import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/interface/user';
import { UserServiceService } from 'src/app/services/api-service/user-service/user-service.service';
import { SharedServiceService } from 'src/app/services/shared-service/shared-service.service';
import { CryptoService } from 'src/app/services/crypto/crypto.service';
import { noSpace } from 'src/app/validators/noSpace.validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  passwordVisible = false;
  passwordType!: string;
  passwordPattern = this.sharedService.passwordPattern;
  emailPattern = '[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
  allUserData: User[] = [];
  registerFrom!: FormGroup;
  forgotPasswordUserData = sessionStorage.getItem('forgotPasswordUser')
    ? JSON.parse(sessionStorage.getItem('forgotPasswordUser') || '')
    : null;

  constructor(
    private registerFormBuilder: FormBuilder,
    private toster: ToastrService,
    private route: Router,
    private userService: UserServiceService,
    private sharedService: SharedServiceService,
    private crypto: CryptoService
  ) {}

  ngOnInit() {
    this.registerFrom = this.registerFormBuilder.group({
      firstName: ['', [Validators.required, noSpace.noSpaceValidator]],
      lastName: ['', [Validators.required, noSpace.noSpaceValidator]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(this.emailPattern),
          this.checkDuplicateEmail(),
          noSpace.noSpaceValidator,
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(this.passwordPattern),
          noSpace.noSpaceValidator,
        ],
      ],
    });
    this.passwordType = 'password';
    this.route.navigate([
      this.forgotPasswordUserData
        ? '/user-module/login'
        : '/user-module/register',
    ]);
    this.userService.getAllUserData().subscribe({
      next: (value) => {
        this.allUserData = value;
      },
    });
  }

  submit(): void {
    const plainPassword = String(this.registerFrom.value.password || '').trim();
    const updateData = {
      ...this.registerFrom.value,
      firstName: this.registerFrom.value.firstName.trim(),
      lastName: this.registerFrom.value.lastName.trim(),
      email: this.registerFrom.value.email.trim(),
      password: this.crypto.encrypt(plainPassword),
      walletAmout: 0,
      cards: [],
      walletTransaction: [],
    };
    this.userService.addUser(updateData).subscribe({
      next: () => {
        this.toster.success('Register successfully', 'Registration', {
          timeOut: 1100,
        });
        this.route.navigate(['/user-module/login']);
      },
      error: () => {},
    });
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

  checkDuplicateEmail(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const uniqueEmail = this.allUserData.find(
        (checkEmail) => checkEmail.email.trim() === control.value.trim()
      );
      return uniqueEmail ? { duplicateEmailError: true } : null;
    };
  }
}
