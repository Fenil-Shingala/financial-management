import { ChangeDetectorRef, Component } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexFill,
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
import { CryptoService } from 'src/app/services/crypto/crypto.service';

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
  selectedYear!: number;
  years: number[] = [];
  filteredMonths: string[] = [];
  mode: 'expense' | 'income' | 'net' = 'net';
  includeWallet = false;
  graphAmount: number[] = [];
  months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
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
  fill!: ApexFill;
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
    private crypto: CryptoService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.graphDetails();
    this.getAllCards();
    this.getAllCategory();

    const transactionDate = new Date();
    const dayOfMonth = transactionDate.getMonth() + 1;
    this.selectedMonth = this.months[dayOfMonth - 1];
    this.selectedYear = transactionDate.getFullYear();

    for (let y = 2023; y <= this.selectedYear; y++) this.years.push(y);
    this.computeFilteredMonths();
    this.updateRange();
    !this.currentLoginUser
      ? this.route.navigate(['/user-module/login'])
      : this.route.navigate(['/main-module/dashboard']);
    this.sharedService.headerTitle.next('Dashboard');
  }

  getAllCards(): void {
    this.cardService.getUserCards(this.currentLoginUser.id).subscribe({
      next: (value) => {
        this.userAllCards = (value.cards || []).map((c) => ({
          ...c,
          cardNumber: this.crypto.decrypt(c.cardNumber),
          cvv: this.crypto.decrypt(c.cvv),
        }));
        // @ts-ignore - runtime property exists on API response for walletTransaction
        this.walletTransactions = (value as any).walletTransaction || [];

        // Initialize active card and graph on first load to avoid blank chart
        if (this.userAllCards.length > 0 && !this.currentActiveCard) {
          this.currentActiveCard = this.userAllCards[0];
          this.totalAddAmount = 0;
          this.totalSpendAmount = 0;
          this.currentActiveCardTransaction = [];
          this.currentActiveCard.cardTransaction?.forEach(
            (tx: Transaction, index: number) => {
              if (index < 3) this.currentActiveCardTransaction.push(tx);
              tx.amountType
                ? (this.totalAddAmount += tx.amount as number)
                : (this.totalSpendAmount += tx.amount as number);
            }
          );
          this.graphDataUpdate(
            this.currentActiveCard.cardTransaction,
            this.userAllCards.length
          );
          this.changeDetectorRef.detectChanges();
          this.fakeResize();
        }
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
      type: 'area',
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
    this.fill = {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
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
      const monthIndex = this.months.indexOf(this.selectedMonth);
      const start = new Date(this.selectedYear, monthIndex, 1, 0, 0, 0, 0);
      const end = new Date(
        this.selectedYear,
        monthIndex + 1,
        0,
        23,
        59,
        59,
        999
      );
      const daysInMonth = end.getDate();
      const bucketSize = 5;
      const numBuckets = Math.ceil(daysInMonth / bucketSize);

      const makeLabels = () => {
        const labels: string[] = [];
        for (let i = 0; i < numBuckets; i++) {
          const from = i * bucketSize + 1;
          const to = Math.min((i + 1) * bucketSize, daysInMonth);
          labels.push(`${from} - ${to}`);
        }
        return labels;
      };

      const walletList: Transaction[] = (this as any).walletTransactions || [];
      const allTx: Transaction[] = this.includeWallet
        ? [...transaction, ...walletList]
        : [...transaction];

      const monthTx = allTx.filter((t) => {
        const d = new Date(t.time);
        return d >= start && d <= end;
      });

      const expenseSums = Array(numBuckets).fill(0);
      const incomeSums = Array(numBuckets).fill(0);
      monthTx.forEach((tx) => {
        const d = new Date(tx.time);
        const day = d.getDate();
        const idx = Math.min(
          Math.floor((day - 1) / bucketSize),
          numBuckets - 1
        );
        const amt = Number(tx.amount || 0);
        if (tx.amountType) incomeSums[idx] += amt;
        else expenseSums[idx] += amt;
      });

      const fix2 = (arr: number[]) =>
        arr.map((v) => Number((v || 0).toFixed(2)));
      const exp = fix2(expenseSums);
      const inc = fix2(incomeSums);
      const net = fix2(inc.map((v, i) => v - exp[i]));

      this.xaxis = { ...this.xaxis, categories: makeLabels() } as ApexXAxis;

      if (this.mode === 'income') {
        this.series = [{ name: 'Income', data: inc }];
      } else if (this.mode === 'net') {
        this.series = [{ name: 'Net (Income - Expense)', data: net }];
      } else {
        this.series = [{ name: 'Expense', data: exp }];
      }
      this.changeDetectorRef.detectChanges();
    }
  }

  slide(e: Swiper): void {
    this.cardService.getUserCards(this.currentLoginUser.id).subscribe({
      next: (value) => {
        if (value.cards.length >= 0) {
          const cards = (value.cards || []).map((c) => ({
            ...c,
            cardNumber: this.crypto.decrypt(c.cardNumber),
            cvv: this.crypto.decrypt(c.cvv),
          }));
          this.currentActiveCard = cards[e.activeIndex];
          this.currentActiveCardTransaction = [];
          cards[e.activeIndex]?.cardTransaction.map(
            (value: Transaction, index: number) => {
              index < 3 ? this.currentActiveCardTransaction.push(value) : null;
            }
          );
          cards[e.activeIndex]?.cardTransaction.map((value: Transaction) => {
            value.amountType
              ? (this.totalAddAmount += value.amount as number)
              : (this.totalSpendAmount += value.amount as number);
          });
          this.graphDataUpdate(
            cards[e.activeIndex]?.cardTransaction,
            cards.length
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
        const cards = (value.cards || []).map((c) => ({
          ...c,
          cardNumber: this.crypto.decrypt(c.cardNumber),
          cvv: this.crypto.decrypt(c.cvv),
        }));
        this.currentActiveCard = cards[toObject?.activeIndex as number];
        this.currentActiveCardTransaction = [];
        cards[toObject?.activeIndex as number].cardTransaction.map(
          (value: Transaction, index: number) => {
            index < 3 ? this.currentActiveCardTransaction.push(value) : null;
          }
        );
        cards[toObject?.activeIndex as number].cardTransaction.map(
          (value: Transaction) => {
            value.amountType
              ? (this.totalAddAmount += value.amount as number)
              : (this.totalSpendAmount += value.amount as number);
          }
        );
        this.graphDataUpdate(
          cards[toObject?.activeIndex as number].cardTransaction,
          cards.length
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
              const cards = (value.cards || []).map((c) => ({
                ...c,
                cardNumber: this.crypto.decrypt(c.cardNumber),
                cvv: this.crypto.decrypt(c.cvv),
              }));
              const cardIndex = cards.findIndex((v) => v.cardNumber === result);
              this.currentActiveCard = cards[cardIndex];
              this.currentActiveCardTransaction = [];

              cards[cardIndex].cardTransaction.map(
                (value: Transaction, index: number) => {
                  index < 3
                    ? this.currentActiveCardTransaction.push(value)
                    : null;
                }
              );
              cards[cardIndex].cardTransaction.map((value: Transaction) => {
                value.amountType
                  ? (this.totalAddAmount += value.amount as number)
                  : (this.totalSpendAmount += value.amount as number);
              });
              this.graphDataUpdate(
                cards[cardIndex].cardTransaction,
                cards.length
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
    this.updateRange();
    this.refreshGraph();
  }

  goToTransaction(): void {
    this.userAllCards.length > 0
      ? this.sharedService.cardId.next(this.currentActiveCard?.id)
      : null;
    this.route.navigate(['/main-module/transaction']);
  }

  setYear(year: number): void {
    this.selectedYear = year;
    this.computeFilteredMonths();
    // Ensure selectedMonth is within filtered list
    if (!this.filteredMonths.includes(this.selectedMonth)) {
      this.selectedMonth = this.filteredMonths[this.filteredMonths.length - 1];
    }
    this.updateRange();
    this.refreshGraph();
  }

  setMode(mode: 'expense' | 'income' | 'net'): void {
    this.mode = mode;
    this.refreshGraph();
  }

  toggleIncludeWallet(): void {
    this.includeWallet = !this.includeWallet;
    this.refreshGraph();
  }

  updateRange(): void {
    const monthIndex = this.months.indexOf(this.selectedMonth);
    const start = new Date(this.selectedYear, monthIndex, 1);
    const end = new Date(this.selectedYear, monthIndex + 1, 0);
    const mm = (val: number) =>
      val + 1 < 10 ? '0' + (val + 1) : String(val + 1);
    const dd = (val: number) => (val < 10 ? '0' + val : String(val));
    this.startDate = `${this.selectedYear}-${mm(monthIndex - 0 - 1)}-01`; // legacy not used in filter now
    this.endDate = `${this.selectedYear}-${mm(monthIndex)}-${dd(
      end.getDate()
    )}`;
  }

  private computeFilteredMonths(): void {
    const now = new Date();
    const isCurrentYear = this.selectedYear === now.getFullYear();
    if (isCurrentYear) {
      const currentMonthIdx = now.getMonth(); // 0-based
      // Show months from Jan up to and including current month
      this.filteredMonths = this.months.slice(0, currentMonthIdx + 1);
    } else {
      this.filteredMonths = [...this.months];
    }
  }

  refreshGraph(): void {
    if (this.userAllCards.length > 0 && this.currentActiveCard) {
      this.graphDataUpdate(
        this.currentActiveCard.cardTransaction,
        this.userAllCards.length
      );
    }
  }

  fakeResize(): void {
    // Dispatch a resize event to force reflow of the chart after updates
    setTimeout(() => {
      try {
        window.dispatchEvent(new Event('resize'));
      } catch {}
    }, 50);
  }
}
