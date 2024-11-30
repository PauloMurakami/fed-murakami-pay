import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { CalendarComponent } from './calendar/calendar.component';
import { ErrorComponent } from './error/error.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'calendario', component: CalendarComponent, canActivate: [AuthGuard] },
  { path: 'error', component: ErrorComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Uncomment this line
];