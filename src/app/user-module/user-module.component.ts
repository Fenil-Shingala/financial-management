import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-module',
  templateUrl: './user-module.component.html',
  styleUrls: ['./user-module.component.scss'],
})
export class UserModuleComponent {
  currentLoginUser = localStorage.getItem('loginUser')
    ? JSON.parse(localStorage.getItem('loginUser') || '')
    : null;

  constructor(private route: Router) {}

  ngOnInit() {
    !this.currentLoginUser
      ? this.route.navigate(['/user-module/login'])
      : this.route.navigate(['/main-module/dashboard']);
  }
}
