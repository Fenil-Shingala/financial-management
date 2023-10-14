import { Component } from '@angular/core';
import { AddAmountDialogComponent } from '../wallet/add-amount-dialog/add-amount-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Transaction } from 'src/app/interface/transaction';
import { Router } from '@angular/router';
import { SharedServiceService } from 'src/app/services/shared-service/shared-service.service';
import { Card } from 'src/app/interface/card';
import { ToastrService } from 'ngx-toastr';
import { CardServiceService } from 'src/app/services/api-service/card-service/card-service.service';

@Component({
  selector: 'app-maglo-wallet',
  templateUrl: './maglo-wallet.component.html',
  styleUrls: ['./maglo-wallet.component.scss'],
})
export class MagloWalletComponent {
  magloWalletAmount = 0;
  displayedColumns: string[] = ['DATE', 'NAME', 'AMOUNT'];
  magloWalletTransaction: Transaction[] = [];
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
    this.updateWalletDetails();
    !this.currentLoginUser
      ? this.route.navigate(['/user-module/login'])
      : this.route.navigate(['/main-module/maglo-wallet']);
    this.sharedService.headerTitle.next('Maglo wallet');
  }

  updateWalletDetails(): void {
    this.cardService.getUserCards(this.currentLoginUser.id).subscribe({
      next: (value) => {
        this.magloWalletAmount = value.walletAmout;
        this.magloWalletTransaction = value.walletTransaction;
        this.userAllCards = value.cards;
      },
      error: () => {},
    });
  }

  openAddAmountDialog(): void {
    if (this.userAllCards.length > 0) {
      const dialogRef = this.dialog.open(AddAmountDialogComponent, {
        width: '500px',
      });
      dialogRef.afterClosed().subscribe(() => {
        this.updateWalletDetails();
      });
    } else {
      this.toastr.warning('Please create card first', 'Maglo wallet');
      this.route.navigate(['/main-module/wallet']);
    }
  }
}
