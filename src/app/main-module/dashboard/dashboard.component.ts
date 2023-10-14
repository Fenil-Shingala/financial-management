import { ChangeDetectorRef, Component } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexGrid,
  ApexTitleSubtitle,
  ApexXAxis,
} from 'ng-apexcharts';
import { Card } from 'src/app/interface/card';
import { TransactionDialogComponent } from './transaction-dialog/transaction-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Transaction } from 'src/app/interface/transaction';
import { Router } from '@angular/router';
import { SharedServiceService } from 'src/app/services/shared-service/shared-service.service';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/interface/category';
import Swiper from 'swiper';
import { CardServiceService } from 'src/app/services/api-service/card-service/card-service.service';
import { CategoryServiceService } from 'src/app/services/api-service/category-service/category-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  totalAddAmount = 0;
  totalSpendAmount = 0;
  startDate = '';
  endDate = '';
  selectedMonth!: string;
  graphAmount: number[] = [];
  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  displayedColumns: string[] = ['NAME', 'TYPE', 'AMOUNT', 'DATE', 'INVOICE ID'];
  userAllCards: Card[] = [];
  currentActiveCardTransaction!: Transaction[];
  allCategory: Category[] = [];
  series!: ApexAxisChartSeries;
  chart!: any;
  title!: ApexTitleSubtitle;
  xaxis!: ApexXAxis;
  grid!: ApexGrid;
  currentActiveCard!: Card;
  currentLoginUser = localStorage.getItem('loginUser')
    ? JSON.parse(localStorage.getItem('loginUser') || '')
    : null;

  constructor(
    private cardService: CardServiceService,
    private categoryService: CategoryServiceService,
    private sharedService: SharedServiceService,
    private route: Router,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.graphDetails();
  }

  ngOnInit() {
    this.getAllCards();
    this.getAllCategory();
    const transactionDate = new Date();
    const dayOfMonth = transactionDate.getMonth() + 1;
    this.selectedMonth = this.months[dayOfMonth - 1];
    this.startDate = `2023-${
      dayOfMonth > 9 ? dayOfMonth : '0' + dayOfMonth
    }-01`;
    this.endDate = `2023-${dayOfMonth > 9 ? dayOfMonth : '0' + dayOfMonth}-${
      transactionDate.getDate() + 1
    }`;
    !this.currentLoginUser
      ? this.route.navigate(['/user-module/login'])
      : this.route.navigate(['/main-module/dashboard']);
    this.sharedService.headerTitle.next('Dashboard');
  }

  getAllCards(): void {
    this.cardService.getUserCards(this.currentLoginUser.id).subscribe({
      next: (value) => {
        this.userAllCards = value.cards;
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

  graphDetails(): void {
    this.series = [
      {
        name: 'Total expense amount',
        data: [],
      },
    ];
    this.chart = {
      height: 250,
      type: 'line',
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    };
    this.title = {
      text: '',
    };
    this.xaxis = {
      categories: [
        '1 - 5',
        '6 - 10',
        '11 - 15',
        '16 - 20',
        '21 - 25',
        '26 - 30',
      ],
    };
    this.grid = {
      row: {
        colors: ['#f3f3f3', 'transparent'],
        opacity: 0.5,
      },
    };
  }

  graphDataUpdate(transaction: Transaction[], cardsLength: number): void {
    if ((cardsLength as number) > 0) {
      const filterDate: Transaction[] = [];
      transaction.filter((value) => {
        if (
          !value.amountType &&
          value.time >= this.startDate &&
          value.time <= this.endDate
        ) {
          filterDate.unshift(value);
        }
      });
      const groupSums = Array(Math.ceil(30 / 5)).fill(0);
      filterDate.map((transaction) => {
        const transactionDate = new Date(transaction.time);
        const dayOfMonth = transactionDate.getDate();
        const groupIndex = Math.floor((dayOfMonth - 1) / 5);
        groupSums[groupIndex] += transaction.amount;
      });

      for (let i = 0; i < groupSums.length; i++) {
        !groupSums[i]
          ? (groupSums[i] = 0)
          : (groupSums[i] = groupSums[i].toFixed(2));
      }

      this.series = [
        {
          name: 'Total expense amount',
          data: groupSums,
        },
      ];
    }
  }

  slide(e: Swiper): void {
    this.cardService.getUserCards(this.currentLoginUser.id).subscribe({
      next: (value) => {
        if (value.cards.length >= 0) {
          this.currentActiveCard = value.cards[e.activeIndex];
          this.currentActiveCardTransaction = [];
          value.cards[e.activeIndex]?.cardTransaction.map(
            (value: Transaction, index: number) => {
              index < 3 ? this.currentActiveCardTransaction.push(value) : null;
            }
          );
          value.cards[e.activeIndex]?.cardTransaction.map(
            (value: Transaction) => {
              value.amountType
                ? (this.totalAddAmount += value.amount as number)
                : (this.totalSpendAmount += value.amount as number);
            }
          );
          this.graphDataUpdate(
            value.cards[e.activeIndex]?.cardTransaction,
            value.cards.length
          );
        }
      },
      error: () => {},
    });
  }

  onSlideChange(e: Swiper[]): void {
    this.totalAddAmount = 0;
    this.totalSpendAmount = 0;
    const toObject = e.find((value) => value);
    this.cardService.getUserCards(this.currentLoginUser.id).subscribe({
      next: (value) => {
        this.currentActiveCard = value.cards[toObject?.activeIndex as number];
        this.currentActiveCardTransaction = [];
        value.cards[toObject?.activeIndex as number].cardTransaction.map(
          (value: Transaction, index: number) => {
            index < 3 ? this.currentActiveCardTransaction.push(value) : null;
          }
        );
        value.cards[toObject?.activeIndex as number].cardTransaction.map(
          (value: Transaction) => {
            value.amountType
              ? (this.totalAddAmount += value.amount as number)
              : (this.totalSpendAmount += value.amount as number);
          }
        );
        this.graphDataUpdate(
          value.cards[toObject?.activeIndex as number].cardTransaction,
          value.cards.length
        );
        this.changeDetectorRef.detectChanges();
      },
      error: () => {},
    });
  }

  openDialog(expense?: boolean): void {
    if (this.userAllCards.length > 0 && this.allCategory.length > 0) {
      const dialogRef = this.dialog.open(TransactionDialogComponent, {
        width: '600px',
        data: expense,
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (
          result !== 'maglo wallet' &&
          result &&
          this.currentActiveCard.cardNumber === result
        ) {
          this.totalAddAmount = 0;
          this.totalSpendAmount = 0;
          this.cardService.getUserCards(this.currentLoginUser.id).subscribe({
            next: (value) => {
              const cardIndex = value.cards.findIndex(
                (value) => value.cardNumber === result
              );
              this.currentActiveCard = value.cards[cardIndex];
              this.currentActiveCardTransaction = [];

              value.cards[cardIndex].cardTransaction.map(
                (value: Transaction, index: number) => {
                  index < 3
                    ? this.currentActiveCardTransaction.push(value)
                    : null;
                }
              );
              value.cards[cardIndex].cardTransaction.map(
                (value: Transaction) => {
                  value.amountType
                    ? (this.totalAddAmount += value.amount as number)
                    : (this.totalSpendAmount += value.amount as number);
                }
              );
              this.graphDataUpdate(
                value.cards[cardIndex].cardTransaction,
                value.cards.length
              );
            },
            error: () => {},
          });
        }
      });
    } else {
      if (this.userAllCards.length <= 0) {
        this.toastr.warning('Please create card first', 'Dashboard');
        this.route.navigate(['/main-module/wallet']);
      } else {
        this.toastr.warning('Please create category', 'Dashboard');
        this.route.navigate(['/main-module/setting']);
      }
    }
  }

  filterGraphData(month: string): void {
    this.selectedMonth = month;
    const index = this.months.indexOf(month) + 1;
    this.startDate = `2023-${index < 10 ? '0' + index : index}-01`;
    this.endDate = `2023-${index < 10 ? '0' + index : index}-30`;
    this.userAllCards.length > 0
      ? this.graphDataUpdate(
          this.currentActiveCard.cardTransaction,
          this.userAllCards.length
        )
      : null;
  }

  goToTransaction(): void {
    this.userAllCards.length > 0
      ? this.sharedService.cardId.next(this.currentActiveCard?.id)
      : null;
    this.route.navigate(['/main-module/transaction']);
  }
}
