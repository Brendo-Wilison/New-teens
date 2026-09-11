import { Routes } from '@angular/router';
import { authGuard, adminGuard, guestGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'visitantes' },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/shell/shell.component').then((m) => m.ShellComponent),
    children: [
      {
        path: 'visitantes',
        loadComponent: () =>
          import('./pages/visitors/visitors.component').then((m) => m.VisitorsComponent),
      },
      {
        path: 'ranking',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./pages/ranking/ranking.component').then((m) => m.RankingComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'visitantes' },
];
