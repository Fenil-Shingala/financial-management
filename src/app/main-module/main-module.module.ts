import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainModuleRoutingModule } from './main-module-routing.module';
import { MainModuleComponent } from './main-module.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartModule } from 'angular-highcharts';
import { TransactionComponent } from './transaction/transaction.component';
import { MagloWalletComponent } from './maglo-wallet/maglo-wallet.component';
import { SettingComponent } from './setting/setting.component';
import { MatTableModule } from '@angular/material/table';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MatTabsModule } from '@angular/material/tabs';
import { TopBarComponent } from './top-bar/top-bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CategoryDailogComponent } from './setting/category-dailog/category-dailog.component';
import { CardDialogComponent } from './wallet/card-dialog/card-dialog.component';
import { CreditCardDirectivesModule } from 'angular-cc-library';
import { WalletComponent } from './wallet/wallet.component';
import { TransactionDialogComponent } from './dashboard/transaction-dialog/transaction-dialog.component';
import { SwiperModule } from 'swiper/angular';
import { MatDialogModule } from '@angular/material/dialog';
import { AddAmountDialogComponent } from './wallet/add-amount-dialog/add-amount-dialog.component';

@NgModule({
  declarations: [
    MainModuleComponent,
    DashboardComponent,
    TransactionComponent,
    MagloWalletComponent,
    WalletComponent,
    SettingComponent,
    TopBarComponent,
    SidebarComponent,
    CategoryDailogComponent,
    CardDialogComponent,
    TransactionDialogComponent,
    AddAmountDialogComponent,
  ],
  imports: [
    CommonModule,
    MainModuleRoutingModule,
    MatIconModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatSelectModule,
    NgApexchartsModule,
    ChartModule,
    MatTableModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    SwiperModule,
    CreditCardDirectivesModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MainModuleModule {}
