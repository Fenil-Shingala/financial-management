import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserModuleRoutingModule } from './user-module-routing.module';
import { UserModuleComponent } from './user-module.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { OtpScreenComponent } from './otp-screen/otp-screen.component';
import { MatIconModule } from '@angular/material/icon';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { MainModuleModule } from '../main-module/main-module.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    UserModuleComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    OtpScreenComponent,
    ResetPasswordComponent,
  ],
  imports: [
    CommonModule,
    UserModuleRoutingModule,
    MatIconModule,
    MainModuleModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
  ],
})
export class UserModuleModule {}
