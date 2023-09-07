import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { REGISTRATIONComponent } from './Components/registration/registration.component';
import { LoginComponent } from './Components/login/login.component';
import { CodeeditorComponent } from './Components/codeeditor/codeeditor.component';
import { HomeComponent } from './Components/home/home.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path:"login",component:LoginComponent},
  { path: "registration", component: REGISTRATIONComponent},
  { path:"code-editordashboard",component:CodeeditorComponent},
  {path: 'home', component: HomeComponent},
  {path:"dashboard",component:DashboardComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }



