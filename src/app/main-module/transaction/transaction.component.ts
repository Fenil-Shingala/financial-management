import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Transaction } from 'src/app/interface/transaction';
import { CardServiceService } from 'src/app/services/api-service/card-service/card-service.service';
import { SharedServiceService } from 'src/app/services/shared-service/shared-service.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent {
  cardIdDataDestroy!: Subscription;
  cardHolderName!: string;
  displayedColumns: string[] = ['NAME', 'TYPE', 'AMOUNT', 'DATE', 'INVOICE ID'];
  cardTransactions: Transaction[] = [];
  currentLoginUser = localStorage.getItem('loginUser')
    ? JSON.parse(localStorage.getItem('loginUser') || '')
    : null;

  constructor(
    private cardService: CardServiceService,
    private sharedService: SharedServiceService,
    private route: Router
  ) {}

  ngOnInit() {
    this.cardIdDataDestroy = this.sharedService.cardId.subscribe(
      (cardIndex) => {
        this.getUserAllCards(cardIndex);
      }
    );
    !this.currentLoginUser
      ? this.route.navigate(['/user-module/login'])
      : this.route.navigate(['/main-module/transaction']);

    this.sharedService.headerTitle.next('Transacction');
  }

  getUserAllCards(cardId: number): void {
    this.cardService.getUserCards(this.currentLoginUser.id).subscribe({
      next: (value) => {
        if (value.cards.length >= 0) {
          this.cardHolderName = value.cards[cardId - 1]?.holderName;
          this.cardTransactions = value.cards[cardId - 1]?.cardTransaction;
        }
      },
      error: () => {},
    });
  }

  ngOnDestroy() {
    this.cardIdDataDestroy.unsubscribe();
  }
}
