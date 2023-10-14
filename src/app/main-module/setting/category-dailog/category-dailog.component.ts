import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/interface/category';
import { CategoryServiceService } from 'src/app/services/api-service/category-service/category-service.service';
import { noSpace } from 'src/app/validators/noSpace.validators';

@Component({
  selector: 'app-category-dailog',
  templateUrl: './category-dailog.component.html',
  styleUrls: ['./category-dailog.component.scss'],
})
export class CategoryDailogComponent {
  categoryForm!: FormGroup;

  constructor(
    private categoryFormBuilder: FormBuilder,
    private toster: ToastrService,
    private categoryService: CategoryServiceService,
    private dialogRef: MatDialogRef<CategoryDailogComponent>,
    @Inject(MAT_DIALOG_DATA) public categoryData: Category
  ) {}

  ngOnInit() {
    this.categoryForm = this.categoryFormBuilder.group({
      categoryName: ['', [Validators.required, noSpace.noSpaceValidator]],
    });
    this.categoryData
      ? this.categoryForm.controls['categoryName'].patchValue(
          this.categoryData.categoryName
        )
      : null;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  submit(): void {
    const updatedData = {
      ...this.categoryForm.value,
      categoryName: this.categoryForm.value.categoryName.trim(),
    };
    if (this.categoryData) {
      this.categoryService
        .updateCategory(this.categoryData.id, updatedData)
        .subscribe({
          next: () => {
            this.dialogRef.close();
            this.toster.success(
              'Category has edited successfully',
              'Category',
              { timeOut: 1000 }
            );
          },
          error: () => {},
        });
    } else {
      this.categoryService.addCategory(updatedData).subscribe({
        next: () => {
          this.dialogRef.close();
          this.toster.success('Category added', 'Category', {
            timeOut: 1000,
          });
        },
      });
    }
  }
}
