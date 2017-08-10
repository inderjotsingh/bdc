import { Component, OnInit } from '@angular/core';
import { UsermanagementService } from '../../../services/usermanagement/usermanagement.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ValidateService } from '../../../services/validate.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  Username: String;
  Password: String;

  UsernameErr: String;
  PasswordErr: String;

  UserRole: String;
  constructor(
    private usermanagementService: UsermanagementService,
    private router: Router,
    private route: ActivatedRoute,
    private flashMessages: FlashMessagesService,
    private validateService: ValidateService
  ) { }

  ngOnInit() {
    this.usermanagementService.logout();
  }

  onLoginSubmit(){
    var userInfo = {
          Username: this.Username,
          Password: this.Password
    }
    this.usermanagementService.authenticateUser(userInfo).subscribe(data => {
        if(data.success){

          this.usermanagementService.storeUserData(data.token, data.user);
          // this.flashMessages.show('Welcome', {cssClass: 'alert-success', timeout:5000}); 
          this.usermanagementService.getUserInfo().subscribe(result => {
            this.usermanagementService.UserRole = result.Role;
            if(result.Role == "ADMN"){
              this.router.navigate(['/Users']);    
            }
            else if(result.Role == "RECP"){
              this.router.navigate(['/Patients']);  
            }
            else if(result.Role == "TECH"){
              this.router.navigate(['/Tests'])
            }
            else if(result.Role == "OBSV"){
              this.router.navigate(['/Reports']);
            }
            this.flashMessages.show('Welcome', {cssClass: 'alert-success', timeout:5000}); 
          });
        }
        else{
          this.flashMessages.show(data.msg, {cssClass: 'alert-danger', timeout:5000});
          this.router.navigate(['']);
        }
    })
  }

}
