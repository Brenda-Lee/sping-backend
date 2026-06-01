import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../features/users/pages/users-list/users-list.page').then((m) => m.UsersListPage)
  },
  { path: '**', redirectTo: '' }
];
