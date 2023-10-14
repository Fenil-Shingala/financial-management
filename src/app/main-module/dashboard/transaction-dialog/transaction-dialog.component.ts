import { Component, Inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Card } from 'src/app/interface/card';
import { Category } from 'src/app/interface/category';
import { User } from 'src/app/interface/user';
import { AmountServiceService } from 'src/app/services/api-service/amount-service/amount-service.service';
import { CardServiceService } from 'src/app/services/api-service/card-service/card-service.service';
import { CategoryServiceService } from 'src/app/services/api-service/category-service/category-service.service';
import { UserServiceService } from 'src/app/services/api-service/user-service/user-service.service';
import { noSpace } from 'src/app/validators/noSpace.validators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-transaction-dialog',
  templateUrl: './transaction-dialog.component.html',
  styleUrls: ['./transaction-dialog.component.scss'],
})
export class TransactionDialogComponent {
  userWalletAmount = 0;
  selectedCardAmount!: number;
  allUser: User[] = [];
  allCategory: Category[] = [];
  allCards: Card[] = [];
  currentTime = new Date();
  transactionForm!: FormGroup;
  currentLoginUser = localStorage.getItem('loginUser')
    ? JSON.parse(localStorage.getItem('loginUser') || '')
    : null;

  constructor(
    private userService: UserServiceService,
    private cardService: CardServiceService,
    private categoryService: CategoryServiceService,
    private amountService: AmountServiceService,
    private dialogRef: MatDialogRef<TransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public expense: boolean
  ) {}

  ngOnInit() {
    this.transactionForm = new FormGroup(
      {
        title: new FormControl(''),
        category: new FormControl('', Validators.required),
        amount: new FormControl('', [Validators.required, this.negativeNumber]),
        receivedFrom: new FormControl('', [
          Validators.required,
          this.getAmountOfSelectedCard,
        ]),
        paidTo: new FormControl(),
      },
      { validators: this.checkSelectedCardAmout }
    );
    if (this.expense) {
      this.transactionForm.controls['title'].setValidators([
        Validators.required,
        noSpace.noSpaceValidator,
      ]);
      this.transactionForm.updateValueAndValidity();
    } else {
      this.transactionForm.controls['paidTo'].setValidators(
        Validators.required
      );
      this.transactionForm.updateValueAndValidity();
    }
    this.getAllUser();
    this.getAllCards();
    this.getAllCategory();
  }

  uuid(): string {
    return (((1 + Math.random()) * 0x10000) | 0)
      .toString(16)
      .toUpperCase()
      .substring(1);
  }

  getAllUser(): void {
    this.userService.getAllUserData().subscribe({
      next: (value) => {
        this.allUser = value;
      },
      error: () => {},
    });
  }

  getAllCategory(): void {
    this.categoryService.getCategory().subscribe({
      next: (value) => {
        this.allCategory = value;
      },
      error: () => {},
    });
  }

  getAllCards(): void {
    this.cardService.getUserCards(this.currentLoginUser.id).subscribe({
      next: (value) => {
        this.allCards = value.cards;
        this.userWalletAmount = value.walletAmout;
      },
      error: () => {},
    });
  }

  selectedCardAmountShow(selectedCardNumber: string): void {
    if (selectedCardNumber === 'maglo wallet') {
      const loginUse = this.allUser.find(
        (value) => value.id === this.currentLoginUser.id
      );
      this.selectedCardAmount = loginUse ? loginUse.walletAmout : 0;
    } else {
      const selectedCardObject = this.allCards.find(
        (value) => value.cardNumber === selectedCardNumber
      );
      this.selectedCardAmount = selectedCardObject
        ? selectedCardObject?.cardAmount
        : 0;
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  submit(): void {
    const updateData = {
      ...this.transactionForm.value,
      amount: +this.transactionForm.value.amount.toFixed(2),
      time: this.currentTime,
      id: `${this.uuid()}${this.uuid()}`,
      amountType: false,
      title: this.expense
        ? this.transactionForm.value.title.trim()
        : this.transactionForm.value.paidTo,
    };

    const toTransferUserIndex = this.allUser.findIndex(
      (value) => value.email === this.transactionForm.value.paidTo
    );
    Swal.fire({
      title: 'Transaction',
      text: 'Do you want to confirm this transaction?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm',
    }).then((result) => {
      if (result.isConfirmed) {
        this.amountService
          .fromSendMoneyUser(this.currentLoginUser.id, updateData)
          .subscribe({
            next: () => {
              if (!this.expense) {
                const changeUpdateData = {
                  ...updateData,
                  title: `${this.currentLoginUser.email}`,
                  amount: +this.transactionForm.value.amount.toFixed(2),
                };
                this.amountService
                  .toSendMoneyUser(toTransferUserIndex + 1, changeUpdateData)
                  .subscribe({
                    next: () => {
                      this.dialogRef.close(
                        this.transactionForm.value.receivedFrom
                      );
                    },
                    error: () => {},
                  });
              }
              this.dialogRef.close(this.transactionForm.value.receivedFrom);
            },
            error: () => {},
          });

        Swal.fire(
          'Done 👍',
          'Your transaction completed successfully.',
          'success'
        );
      }
    });
  }

  negativeNumber(control: AbstractControl): ValidationErrors | null {
    return control.value <= 0 ? { negative: true } : null;
  }

  checkSelectedCardAmout: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const selectedCardNumber = control.get('receivedFrom')?.value;
    const enterAmount = control.get('amount')?.value;
    const selectedCard = this.allCards.find(
      (value) => value.cardNumber === selectedCardNumber
    );
    const selectedCardAmount =
      selectedCardNumber === 'maglo wallet'
        ? this.userWalletAmount
        : selectedCard
        ? selectedCard.cardAmount
        : 0;
    return selectedCardAmount < enterAmount ? { checkCardAmount: true } : null;
  };

  getAmountOfSelectedCard: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const selectedCardNumber = control.get('receivedFrom')?.value;
    const selectedCard = this.allCards.find(
      (value) => value.cardNumber === selectedCardNumber
    );
    const getAmount = selectedCard?.cardAmount;
    return selectedCard ? { getAmount } : null;
  };
}
