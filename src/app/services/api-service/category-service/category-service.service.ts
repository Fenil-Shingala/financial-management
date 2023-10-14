import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedServiceService } from '../../shared-service/shared-service.service';
import { Category } from 'src/app/interface/category';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryServiceService {
  constructor(
    private http: HttpClient,
    private sharedService: SharedServiceService
  ) {}

  getCategory(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.sharedService.userUrl}/category`);
  }

  addCategory(categoryName: Category): Observable<Category> {
    return this.http.post<Category>(
      `${this.sharedService.userUrl}/category`,
      categoryName
    );
  }

  updateCategory(id: number, updateCategory: Category): Observable<Category> {
    return this.http.put<Category>(
      `${this.sharedService.userUrl}/category/${id}`,
      updateCategory
    );
  }

  deletCagetory(id: number): Observable<Category> {
    return this.http.delete<Category>(
      `${this.sharedService.userUrl}/category/${id}`
    );
  }
}
