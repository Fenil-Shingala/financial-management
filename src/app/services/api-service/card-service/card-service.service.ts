import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, mergeMap } from 'rxjs';
import { SharedServiceService } from '../../shared-service/shared-service.service';
import { User } from 'src/app/interface/user';
import { Card } from 'src/app/interface/card';
import { CryptoService } from '../../crypto/crypto.service';

@Injectable({
  providedIn: 'root',
})
export class CardServiceService {
  constructor(
    private http: HttpClient,
    private sharedService: SharedServiceService,
    private crypto: CryptoService
  ) {}

  private recomputeCardAmounts(user: User): void {
    if (!user || !Array.isArray(user.cards)) return;
    user.cards.forEach((card) => {
      let sum = 0;
      if (Array.isArray(card.cardTransaction)) {
        card.cardTransaction.forEach((tx) => {
          const amount = Number(tx.amount || 0);
          sum += tx.amountType ? amount : -amount;
        });
      }
      card.cardAmount = Number(sum.toFixed(2));
    });
  }

  getUserCards(id: number): Observable<User> {
    return this.http.get<User>(`${this.sharedService.userUrl}/userData/${id}`);
  }

  addCard(id: number, card: Card): Observable<User> {
    return this.http
      .get<User>(`${this.sharedService.userUrl}/userData/${id}`)
      .pipe(
        mergeMap((user) => {
          user.cards.push(card);
          this.recomputeCardAmounts(user);
          return this.http.put<User>(
            `${this.sharedService.userUrl}/userData/${id}`,
            user
          );
        })
      );
  }
}
