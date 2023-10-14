import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, mergeMap } from 'rxjs';
import { SharedServiceService } from '../../shared-service/shared-service.service';
import { User } from 'src/app/interface/user';
import { Card } from 'src/app/interface/card';

@Injectable({
  providedIn: 'root',
})
export class CardServiceService {
  constructor(
    private http: HttpClient,
    private sharedService: SharedServiceService
  ) {}

  getUserCards(id: number): Observable<User> {
    return this.http.get<User>(`${this.sharedService.userUrl}/userData/${id}`);
  }

  addCard(id: number, card: Card): Observable<User> {
    return this.http
      .get<User>(`${this.sharedService.userUrl}/userData/${id}`)
      .pipe(
        mergeMap((user) => {
          user.cards.push(card);
          return this.http.put<User>(
            `${this.sharedService.userUrl}/userData/${id}`,
            user
          );
        })
      );
  }
}
