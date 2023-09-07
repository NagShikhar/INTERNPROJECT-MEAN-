import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { REGISTRATIONComponent } from './Components/registration/registration.component';
import { LoginComponent } from './Components/login/login.component';
import { CodeeditorComponent } from './Components/codeeditor/codeeditor.component';
import { HomeComponent } from './Components/home/home.component';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { TemplateService } from './template.service';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import {MatDialogModule} from '@angular/material/dialog';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CreateTemplateDialogComponent } from './Components/create-template-dialog/create-template-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute } from '@angular/router'
@NgModule({
  declarations: [
    AppComponent,
    REGISTRATIONComponent,
    LoginComponent,
    CodeeditorComponent,
    HomeComponent,
    DashboardComponent,
    CreateTemplateDialogComponent,
    
    
    
    
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule,
    MatFormFieldModule,
    
    
    
    
    
    
    
    
  ],
  providers: [UserService,TemplateService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
