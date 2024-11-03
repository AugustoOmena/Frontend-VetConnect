import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LoginComponent } from './features/auth/login/login.component';
import { IsLoggedInGuard } from './core/authentication/auth.guard';
import { Component } from '@angular/core';
import { RegisterComponent } from './features/auth/register/register.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'auth', component: RegisterComponent },
  { path: '', component: LoginComponent },
  { path: 'home', component: DashboardComponent, canActivate: [IsLoggedInGuard]},
];
