import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LoginComponent } from './features/auth/login/login.component';
import { IsLoggedInGuard } from './core/authentication/auth.guard';
import { RegisterComponent } from './features/auth/register/register.component';
import { ServicesComponent } from './features/services/services.component';
import { PetsComponent } from './features/pets/pets.component';
import { UsersComponent } from './features/users/users.component';
import { ServiceAttendanceComponent } from './features/service-attendance/service-attendance.component';
import { SchedulingComponent } from './features/scheduling/scheduling.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'auth', component: RegisterComponent },
  { path: '', component: LoginComponent },
  { path: 'home', component: DashboardComponent, canActivate: [IsLoggedInGuard]},
  { path: 'services', component: ServicesComponent, canActivate: [IsLoggedInGuard]},
  { path: 'pets', component: PetsComponent, canActivate: [IsLoggedInGuard]},
  { path: 'users', component: UsersComponent, canActivate: [IsLoggedInGuard]},
  { path: 'attendance', component: ServiceAttendanceComponent, canActivate: [IsLoggedInGuard]},
  { path: 'scheduling', component: SchedulingComponent, canActivate: [IsLoggedInGuard]}
];
