import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'user-module',
    loadChildren: () =>
      import('./user-module/user-module.module').then(
        (user) => user.UserModuleModule
      ),
  },
  {
    path: 'main-module',
    loadChildren: () =>
      import('./main-module/main-module.module').then(
        (main) => main.MainModuleModule
      ),
  },
  { path: '**', redirectTo: 'user-module', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
