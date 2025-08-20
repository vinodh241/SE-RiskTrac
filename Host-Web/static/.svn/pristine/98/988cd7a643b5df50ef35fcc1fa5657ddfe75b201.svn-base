import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundError } from 'rxjs';
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'landing', component: LandingComponent },
  // { path: 'profile', loadChildren: () => import('orm/Module').then(m => m.ProfileModule) },
  // { path: 'user-list', loadChildren: () => import('userManagement/Module').then(m => m.UserListModule) },
  { path: '**', component: NotFoundError }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
