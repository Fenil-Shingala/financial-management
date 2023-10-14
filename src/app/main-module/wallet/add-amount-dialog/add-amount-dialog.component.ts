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
import { AmountServiceService } from 'src/app/services/api-service/amount-service/amount-service.service';
import { CardServiceService } from 'src/app/services/api-service/card-service/card-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-amount-dialog',
  templateUrl: './add-amount-dialog.component.html',
  styleUrls: ['./add-amount-dialog.component.scss'],
})
export class AddAmountDialogComponent {
  allCards: Card[] = [];
  currentTime = new Date();
  addAmountForm!: FormGroup;
  currentLoginUser = localStorage.getItem('loginUser')
    ? JSON.parse(localStorage.getItem('loginUser') || '')
    : null;

  constructor(
    private cardService: CardServiceService,
    private amountService: AmountServiceService,
    private dialogref: MatDialogRef<AddAmountDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public cardData: Card
  ) {}

  ngOnInit() {
    this.addAmountForm = new FormGroup(
      {
        receivedFrom: new FormControl(''),
        amount: new FormControl('', [Validators.required, this.negativeNumber]),
      },
      { validators: this.checkSelectedCardAmout }
    );
    this.getAllCards();
    if (!this.cardData) {
      this.addAmountForm.controls['receivedFrom'].setValidators(
        Validators.required
      );
      this.addAmountForm.updateValueAndValidity();
    }
  }

  getAllCards(): void {
    this.cardService.getUserCards(this.currentLoginUser.id).subscribe({
      next: (value) => {
        this.allCards = value.cards;
      },
      error: () => {},
    });
  }

  uuid(): string {
    return (((1 + Math.random()) * 0x10000) | 0)
      .toString(16)
      .toUpperCase()
      .substring(1);
  }

  submit(): void {
    const changedData = {
      ...this.addAmountForm.value,
      receivedFrom: this.cardData
        ? 'Added amount in card'
        : this.addAmountForm.value.receivedFrom,
      title: this.cardData ? 'Card' : 'Maglo wallet',
      time: this.currentTime,
      amount: +this.addAmountForm.value.amount.toFixed(2),
      id: `${this.uuid()}${this.uuid()}`,
      amountType: this.cardData ? true : false,
      category: this.cardData ? 'In card' : 'In wallet',
    };
    Swal.fire({
      title: 'Add amount',
      text: 'Do you want to add an amount?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.cardData) {
          this.amountService
            .addCardAmount(
              this.currentLoginUser.id,
              this.cardData.id,
              changedData
            )
            .subscribe({
              next: () => {
                this.dialogref.close();
              },
              error: () => {},
            });
        } else {
          this.amountService
            .addWalletAmount(
              this.currentLoginUser.id,
              this.addAmountForm.value.receivedFrom,
              changedData
            )
            .subscribe({
              next: () => {
                this.dialogref.close();
              },
              error: () => {},
            });
        }
        Swal.fire('Done 👍', 'Amount added successfully.', 'success');
      }
    });
  }

  closeDialog(): void {
    this.dialogref.close();
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
    const selectedCardAmount = selectedCard ? selectedCard.cardAmount : 0;
    return selectedCardAmount < enterAmount && !this.cardData
      ? { checkCardAmount: true }
      : null;
  };
}
