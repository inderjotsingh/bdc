import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

//Modules
import { FlashMessagesModule } from 'angular2-flash-messages';
import { AuthGuard } from './guards/auth.guard';
import { CryptoJS } from 'crypto-js';
import { MyDatePickerModule } from 'mydatepicker';
//Modules

//Services
import { UsermanagementService } from './services/usermanagement/usermanagement.service';
import { PatientinfoService } from './services/patientinfo/patientinfo.service';
import { ValidateService } from './services/validate.service';
import { TestinfoService } from './services/testinfo/testinfo.service';
//Services

//Components
import { AppComponent } from './app.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { LoginComponent } from './Components/UserManagement/login/login.component';
import { UserinfoComponent } from './Components/UserManagement/userinfo/userinfo.component';
import { ProfileComponent } from './Components/UserManagement/profile/profile.component';
import { RegisterComponent } from './Components/UserManagement/register/register.component';
import { PatientinfoComponent } from './Components/Patients/patientinfo/patientinfo.component';
import { NewtestComponent } from './components/Patients/newtest/newtest.component';
import { TestlistComponent } from './Components/Technicians/testlist/testlist.component';
import { TestprocessingComponent } from './Components/Technicians/testprocessing/testprocessing.component';
import { ObserverlistComponent } from './components/Observers/observerlist/observerlist.component';
import { ReportverificationComponent } from './components/observers/reportverification/reportverification.component';
import { PatienthistoryComponent } from './Components/Patients/patienthistory/patienthistory.component';
import { ChangepasswordComponent } from './Components/UserManagement/changepassword/changepassword.component';
//Components

const appRoutes : Routes = [
  { path: 'Navbar', component: NavbarComponent }, 
  { path: '', component: LoginComponent},
  { path: 'Users', component: UserinfoComponent, canActivate:[AuthGuard]},
  { path: 'Profile', component: ProfileComponent, canActivate:[AuthGuard]},
  { path: 'Register', component: RegisterComponent, canActivate:[AuthGuard]},
  { path: 'ChangePassword', component: ChangepasswordComponent, canActivate:[AuthGuard]},

  { path: 'Patients', component: PatientinfoComponent, canActivate:[AuthGuard]},
  { path: 'NewTest', component: NewtestComponent, canActivate:[AuthGuard]},
  { path: 'PatientHistory', component: PatienthistoryComponent, canActivate:[AuthGuard]},

  { path: 'Tests', component: TestlistComponent, canActivate:[AuthGuard]},
  { path: 'TestProcessing', component: TestprocessingComponent, canActivate:[AuthGuard]},

  { path: 'Reports', component: ObserverlistComponent, canActivate:[AuthGuard]},
  { path: 'ReportVerification', component: ReportverificationComponent, canActivate:[AuthGuard]},

]

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    UserinfoComponent,
    ProfileComponent,
    RegisterComponent,
    PatientinfoComponent,
    NewtestComponent,
    TestlistComponent,
    TestprocessingComponent,
    ObserverlistComponent,
    ReportverificationComponent,
    PatienthistoryComponent,
    ChangepasswordComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot( appRoutes ),
    FlashMessagesModule,
    MyDatePickerModule,
  ],
  providers: [
    UsermanagementService,
    PatientinfoService,
    TestinfoService,
    ValidateService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
