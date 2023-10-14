import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainModuleComponent } from './main-module.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TransactionComponent } from './transaction/transaction.component';
import { MagloWalletComponent } from './maglo-wallet/maglo-wallet.component';
import { SettingComponent } from './setting/setting.component';
import { WalletComponent } from './wallet/wallet.component';
import { mainAuthGuard } from '../auth-guard/main-auth-guard/main-auth.guard';

const routes: Routes = [
  {
    path: '',
    component: MainModuleComponent,
    canActivate: [mainAuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'transaction', component: TransactionComponent },
      { path: 'maglo-wallet', component: MagloWalletComponent },
      { path: 'wallet', component: WalletComponent },
      { path: 'setting', component: SettingComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainModuleRoutingModule {}
