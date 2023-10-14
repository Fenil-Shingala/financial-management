import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedServiceService {
  userUrl = 'http://localhost:3000';
  passwordPattern = '((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[~!@#$%^&*()]).{8,20})';
  categoryData = new Subject();
  headerTitle = new Subject();
  sidebarCollapes = new Subject();
  cardId = new BehaviorSubject(1);

  constructor(private route: Router) {}

  userModuleClosePage(): void {
    sessionStorage.removeItem('forgotPasswordUser');
    sessionStorage.removeItem('otpMatch');
    this.route.navigate(['/user-module/login']);
  }
}
