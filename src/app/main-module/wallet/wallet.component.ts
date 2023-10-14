import { Component } from '@angular/core';
import { CardDialogComponent } from './card-dialog/card-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Card } from 'src/app/interface/card';
import { AddAmountDialogComponent } from './add-amount-dialog/add-amount-dialog.component';
import { Transaction } from 'src/app/interface/transaction';
import { Router } from '@angular/router';
import { SharedServiceService } from 'src/app/services/shared-service/shared-service.service';
import { ToastrService } from 'ngx-toastr';
import { CardServiceService } from 'src/app/services/api-service/card-service/card-service.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent {
  selectedCard!: Card;
  displayedColumns: string[] = ['DATE', 'NAME', 'AMOUNT'];
  selectedCardTransaction: Transaction[] = [];
  userAllCards: Card[] = [];
  currentLoginUser = localStorage.getItem('loginUser')
    ? JSON.parse(localStorage.getItem('loginUser') || '')
    : null;

  constructor(
    private cardService: CardServiceService,
    private sharedService: SharedServiceService,
    private route: Router,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.cardService.getUserCards(this.currentLoginUser.id)?.subscribe({
      next: (value) => {
        if (value.cards.length >= 0) {
          this.userAllCards = value.cards;
          this.selectedCard = value.cards[0];
          this.selectedCardTransaction = value.cards[0]?.cardTransaction;
        }
      },
      error: () => {},
    });
    !this.currentLoginUser
      ? this.route.navigate(['/user-module/login'])
      : this.route.navigate(['/main-module/wallet']);

    this.sharedService.headerTitle.next('Wallet');
  }

  getAllCards(): void {
    this.cardService.getUserCards(this.currentLoginUser.id)?.subscribe({
      next: (value) => {
        this.userAllCards = value.cards;
        this.selectedCard =
          value.cards[value.cards.length === 1 ? 0 : this.selectedCard.id - 1];
      },
      error: () => {},
    });
  }

  openDialog(): void {
    if (this.userAllCards.length < 3) {
      const dialogRef = this.dialog.open(CardDialogComponent, {
        width: '600px',
      });

      dialogRef.afterClosed().subscribe(() => {
        this.getAllCards();
      });
    } else {
      this.toastr.info('You only create max 3 cards', 'Wallet');
    }
  }

  openAddAmountDialog(): void {
    if (this.selectedCard) {
      const dialogRef = this.dialog.open(AddAmountDialogComponent, {
        width: '500px',
        data: this.selectedCard,
      });

      dialogRef.afterClosed().subscribe(() => {
        this.cardService.getUserCards(this.currentLoginUser.id)?.subscribe({
          next: (value) => {
            this.selectedCard = value.cards[this.selectedCard.id - 1];
            this.selectedCardTransaction =
              value.cards[this.selectedCard.id - 1].cardTransaction;
          },
          error: () => {},
        });
        this.getAllCards();
      });
    }
  }

  selectCard(id: number): void {
    this.selectedCard = this.userAllCards[id];
    this.selectedCardTransaction = this.userAllCards[id].cardTransaction;
  }
}
