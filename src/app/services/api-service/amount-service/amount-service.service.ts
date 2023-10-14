import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedServiceService } from '../../shared-service/shared-service.service';
import { Transaction } from 'src/app/interface/transaction';
import { User } from 'src/app/interface/user';
import { Observable, mergeMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AmountServiceService {

  constructor(
    private http: HttpClient,
    private sharedService: SharedServiceService
  ) {}

  addCardAmount(
    userId: number,
    cardId: number,
    transactionDetails: Transaction
  ): Observable<User> {
    return this.http
      .get<User>(`${this.sharedService.userUrl}/userData/${userId}`)
      .pipe(
        mergeMap((user) => {
          const cardIndex = user.cards.findIndex((card) => card.id === cardId);
          if (cardIndex !== -1) {
            user.cards[cardIndex].cardAmount +=
              transactionDetails.amount as number;
          }
          user.cards[cardIndex].cardTransaction.unshift(transactionDetails);
          return this.http.put<User>(
            `${this.sharedService.userUrl}/userData/${userId}`,
            user
          );
        })
      );
  }

  addWalletAmount(
    userId: number,
    cardNumber: string,
    transactionDetails: Transaction
  ): Observable<User> {
    return this.http
      .get<User>(`${this.sharedService.userUrl}/userData/${userId}`)
      .pipe(
        mergeMap((user) => {
          user.walletAmout += transactionDetails.amount as number;
          const cardIndex = user.cards.findIndex(
            (card) => card.cardNumber === cardNumber
          );
          if (cardIndex !== -1) {
            user.cards[cardIndex].cardAmount -=
              transactionDetails.amount as number;
          }
          user.cards[cardIndex].cardTransaction.unshift(transactionDetails);
          const changeWalletTransactionData = {
            ...transactionDetails,
            title:
              '**** **** **** ' +
              transactionDetails.receivedFrom.substring(
                transactionDetails.receivedFrom.length - 4
              ),
            amountType: true,
          };
          user.walletTransaction.unshift(changeWalletTransactionData);
          return this.http.put<User>(
            `${this.sharedService.userUrl}/userData/${userId}`,
            user
          );
        })
      );
  }

  fromSendMoneyUser(
    userId: number,
    transactionDetails: Transaction
  ): Observable<User> {
    return this.http
      .get<User>(`${this.sharedService.userUrl}/userData/${userId}`)
      .pipe(
        mergeMap((user) => {
          if (transactionDetails.receivedFrom === 'maglo wallet') {
            user.walletAmout -= transactionDetails.amount as number;
            user.walletTransaction.unshift(transactionDetails);
          } else {
            const cardIndex = user.cards.findIndex(
              (value) => value.cardNumber === transactionDetails.receivedFrom
            );
            if (cardIndex !== -1) {
              user.cards[cardIndex].cardAmount -=
                transactionDetails.amount as number;
              user.cards[cardIndex].cardTransaction.unshift(transactionDetails);
            }
          }
          return this.http.put<User>(
            `${this.sharedService.userUrl}/userData/${userId}`,
            user
          );
        })
      );
  }

  toSendMoneyUser(
    userId: number,
    transactionDetails: Transaction
  ): Observable<User> {
    return this.http
      .get<User>(`${this.sharedService.userUrl}/userData/${userId}`)
      .pipe(
        mergeMap((user) => {
          user.walletAmout += transactionDetails.amount as number;
          const updateTransactionDetails = {
            ...transactionDetails,
            amountType: true,
          };
          user.walletTransaction.unshift(updateTransactionDetails);
          return this.http.put<User>(
            `${this.sharedService.userUrl}/userData/${userId}`,
            user
          );
        })
      );
  }
}
