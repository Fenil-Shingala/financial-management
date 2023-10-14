import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/interface/user';
import { SharedServiceService } from '../../shared-service/shared-service.service';

@Injectable({
  providedIn: 'root',
})
export class UserServiceService {
  constructor(
    private http: HttpClient,
    private sharedService: SharedServiceService
  ) {}

  getAllUserData(): Observable<User[]> {
    return this.http.get<User[]>(`${this.sharedService.userUrl}/userData`);
  }

  addUser(userData: User): Observable<User> {
    return this.http.post<User>(
      `${this.sharedService.userUrl}/userData`,
      userData
    );
  }

  updateUserData(id: number, userData: User): Observable<User> {
    return this.http.put<User>(
      `${this.sharedService.userUrl}/userData/${id}`,
      userData
    );
  }
}
