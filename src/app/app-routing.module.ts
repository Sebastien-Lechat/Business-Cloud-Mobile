import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { BackGuard } from './guards/back.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'auth/login',
    loadChildren: () => import('./auth/login/login.module').then(m => m.LoginPageModule),
    canActivate: [BackGuard],
  },
  {
    path: 'auth/register',
    loadChildren: () => import('./auth/register/register.module').then(m => m.RegisterPageModule),
    canActivate: [BackGuard],
  },
  {
    path: 'auth/password-lost',
    loadChildren: () => import('./auth/password-lost/password-lost.module').then(m => m.PasswordLostPageModule),
    canActivate: [BackGuard],
  },
  {
    path: 'auth/verify-email',
    loadChildren: () => import('./auth/email-verify/email-verify.module').then(m => m.EmailVerifyPageModule),
    canActivate: [BackGuard],
  },
  {
    path: 'auth/double-auth',
    loadChildren: () => import('./auth/double-auth/double-auth.module').then(m => m.DoubleAuthPageModule),
    canActivate: [BackGuard],
  },
  {
    path: 'messages',
    loadChildren: () => import('./pages/messages/messages.module').then(m => m.MessagesPageModule),
    canActivate: [AuthGuard],
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
