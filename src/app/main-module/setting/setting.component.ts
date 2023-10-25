import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/interface/user';
import { CategoryDailogComponent } from './category-dailog/category-dailog.component';
import { MatDialog } from '@angular/material/dialog';
import { Category } from 'src/app/interface/category';
import Swal from 'sweetalert2';
import { SharedServiceService } from 'src/app/services/shared-service/shared-service.service';
import { Subscription } from 'rxjs';
import { UserServiceService } from 'src/app/services/api-service/user-service/user-service.service';
import { CategoryServiceService } from 'src/app/services/api-service/category-service/category-service.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent {
  oldPasswordVisible = false;
  newPasswordVisible = false;
  confirmPasswordVisible = false;
  oldPasswordType!: string;
  newPasswordType!: string;
  confirmPasswordType!: string;
  passwordPattern = this.sharedService.passwordPattern;
  displayedColumns: string[] = ['category', 'action'];
  categoryDataSource = ['mobile', 'electronics', 'friend'];
  allUserData: User[] = [];
  allCategoryName: Category[] = [];
  changePasswordForm!: FormGroup;
  categoryDataDestroy!: Subscription;
  loginUser = localStorage.getItem('loginUser')
    ? JSON.parse(localStorage.getItem('loginUser') || '')
    : null;
  currentLoginUser!: User;

  constructor(
    private changePasswordFormBuilder: FormBuilder,
    private toster: ToastrService,
    private route: Router,
    private userService: UserServiceService,
    private sharedService: SharedServiceService,
    private categoryService: CategoryServiceService,
    private dialog: MatDialog
  ) {
    this.changePasswordForm = this.changePasswordFormBuilder.group({
      oldPassword: [
        '',
        [Validators.required, Validators.pattern(this.passwordPattern)],
      ],
      newPassword: [
        '',
        [Validators.required, Validators.pattern(this.passwordPattern)],
      ],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.oldPasswordType = 'password';
    this.newPasswordType = 'password';
    this.confirmPasswordType = 'password';
    this.getUserData();
    this.getCategoryData();
    this.getLoginUSerData();
    this.categoryDataDestroy = this.sharedService.categoryData.subscribe({
      next: () => {
        this.getCategoryData();
      },
      error: () => {},
    });
    !this.loginUser
      ? this.route.navigate(['/user-module/login'])
      : this.route.navigate(['/main-module/setting']);
    this.sharedService.headerTitle.next('Setting');
  }

  getLoginUSerData(): void {
    this.userService.getAllUserData().subscribe({
      next: (value) => {
        this.currentLoginUser = value.find(
          (item) => item.id === this.loginUser.id
        ) as User;
      },
      error: () => {},
    });
  }

  getUserData(): void {
    this.userService.getAllUserData().subscribe({
      next: (value) => {
        this.allUserData = value;
      },
      error: () => {},
    });
  }

  getCategoryData(): void {
    this.categoryService.getCategory().subscribe({
      next: (value) => {
        this.allCategoryName = value;
      },
      error: () => {},
    });
  }

  togglePasswordVisibility(field: string): void {
    if (field === 'oldPassword') {
      this.oldPasswordType = this.togglePasswordType(this.oldPasswordType);
      this.oldPasswordVisible = !this.oldPasswordVisible;
    } else if (field === 'newPassword') {
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
    if (
      this.changePasswordForm.value.oldPassword ===
      this.currentLoginUser.password
    ) {
      if (
        this.changePasswordForm.value.newPassword ===
        this.changePasswordForm.value.confirmPassword
      ) {
        const updatedData = {
          ...this.currentLoginUser,
          password: this.changePasswordForm.value.newPassword,
        };
        this.userService
          .updateUserData(this.currentLoginUser.id, updatedData)
          .subscribe({
            next: () => {
              this.toster.success('Password change', 'Change password', {
                timeOut: 1100,
              });
              localStorage.removeItem('loginUser');
              this.route.navigate(['/user-module/login']);
            },
            error: () => {},
          });
      } else {
        this.toster.error('Please check both password', 'Change password', {
          timeOut: 1100,
        });
      }
    } else {
      this.toster.error('Old password was wrong', 'Change password', {
        timeOut: 1100,
      });
    }
  }

  openDialog(category?: Category): void {
    const dialogRef = this.dialog.open(CategoryDailogComponent, {
      width: '600px',
      data: category,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getCategoryData();
    });
  }

  deletCategory(id: number): void {
    Swal.fire({
      title: 'Delete',
      text: 'Do you want to delete this?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Deleted!', 'Your category has been deleted.', 'success');
        this.categoryService.deletCagetory(id).subscribe({
          next: () => {
            this.sharedService.categoryData.next(true);
          },
          error: () => {},
        });
      }
    });
  }

  ngOnDestroy() {
    this.categoryDataDestroy.unsubscribe();
  }
}
