import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CreditCardValidators } from 'angular-cc-library';
import { ToastrService } from 'ngx-toastr';
import { Card } from 'src/app/interface/card';
import { CardServiceService } from 'src/app/services/api-service/card-service/card-service.service';
import { noSpace } from 'src/app/validators/noSpace.validators';
import { CryptoService } from 'src/app/services/crypto/crypto.service';

@Component({
  selector: 'app-card-dialog',
  templateUrl: './card-dialog.component.html',
  styleUrls: ['./card-dialog.component.scss'],
})
export class CardDialogComponent {
  userAllCards: Card[] = [];
  cardForm!: FormGroup;
  currentLoginUser = localStorage.getItem('loginUser')
    ? JSON.parse(localStorage.getItem('loginUser') || '')
    : null;

  constructor(
    private cardFormBuilder: FormBuilder,
    private toster: ToastrService,
    private cardService: CardServiceService,
    private dialogRef: MatDialogRef<CardDialogComponent>,
    private crypto: CryptoService
  ) {}

  ngOnInit() {
    this.cardForm = this.cardFormBuilder.group({
      holderName: ['', [Validators.required, noSpace.noSpaceValidator]],
      cardNumber: [
        '',
        [
          CreditCardValidators.validateCCNumber,
          Validators.required,
          this.checkDuplicateCard(),
        ],
      ],
      expiryDate: ['', [CreditCardValidators.validateExpDate]],
      cvv: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(4)],
      ],
    });
    this.getAllCards();
  }

  getAllCards(): void {
    this.cardService.getUserCards(this.currentLoginUser.id).subscribe({
      next: (value) => {
        this.userAllCards = (value.cards || []).map((c) => ({
          ...c,
          cardNumber: this.crypto.decrypt(c.cardNumber),
          cvv: this.crypto.decrypt(c.cvv),
        }));
      },
      error: () => {},
    });
  }

  onSubmit(): void {
    const updatedCardValue = {
      ...this.cardForm.value,
      holderName: this.cardForm.value.holderName.trim(),
      cardNumber: this.crypto.encrypt(this.cardForm.value.cardNumber),
      cvv: this.crypto.encrypt(this.cardForm.value.cvv),
      cardAmount: 0,
      cardTransaction: [],
      id: this.userAllCards.length + 1,
    };
    this.cardService
      .addCard(this.currentLoginUser.id, updatedCardValue)
      .subscribe({
        next: () => {
          this.toster.success('Card added successfully', 'Card', {
            timeOut: 1000,
          });
          this.dialogRef.close();
        },
        error: () => {},
      });
  }

  closeCardDialog(): void {
    this.dialogRef.close();
  }

  checkDuplicateCard(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const uniqueCardNumber = this.userAllCards.find(
        (card) => card.cardNumber === control.value
      );
      return uniqueCardNumber ? { cardDuplicate: true } : null;
    };
  }
}
