import { Component, OnInit } from '@angular/core';
import { UsermanagementService } from '../../../services/usermanagement/usermanagement.service'; 
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ValidateService } from '../../../services/validate.service';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit {
  CurrentPassword: String;
  NewPassword: String;
  ConfirmPassword: String;

  CurrentPasswordErr: String;
  NewPasswordErr: String;
  ConfirmPasswordErr: String;
  isFormValid: Boolean;
  constructor(
    private usermanagementService: UsermanagementService,
    private router: Router,
    private route: ActivatedRoute,
    private flashMessages: FlashMessagesService,
    private validateService: ValidateService
  ) { }

  ngOnInit() {
  }

  onChangePasswordSubmit(){
    this.isFormValid = true;
    this.validateForm('all'); 
    if(this.isFormValid){
      var changePasswordInfo = {
          NewPassword: this.NewPassword
      }

      this.usermanagementService.updatePassword(changePasswordInfo).subscribe(data => {
        if(data.success){
          this.flashMessages.show("Password has been updated. Kindly login again.", {cssClass: 'alert-success', timeout: 3000});
          this.usermanagementService.logout();
          this.router.navigate(['']);
        }
        else{
          this.flashMessages.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});
          //this.router.navigate(['/ChangePassword']);
        }
      })
    }
  }
  
  validateForm(ctr){

    if(!this.validateService.validateRequiredTextField(this.CurrentPassword)){
      this.CurrentPasswordErr = "Please enter Current Password";
      this.isFormValid = false;
    }
    else{
      this.CurrentPasswordErr = "";
    }


    if(!this.validateService.validateRequiredTextField(this.NewPassword)){
      this.NewPasswordErr = "Please enter New Password";
      this.isFormValid = false;
    }
    else{
      this.NewPasswordErr = "";
    }

    if(!this.validateService.validateRequiredTextField(this.ConfirmPassword)){
      this.ConfirmPasswordErr = "Please enter Confirm Password";
      this.isFormValid = false;
    }
    else{
      this.ConfirmPasswordErr = "";
    }

    if(!this.validateService.passwordStrength(this.NewPassword)){
      this.NewPasswordErr = "Password should contain at least one number, one lowercase and one uppercase letter and at least six characters";
      this.isFormValid = false;
    }
    else{
      this.NewPasswordErr = "";
    }
    if(!this.validateService.confirmPassword(this.NewPassword, this.ConfirmPassword)){
      this.ConfirmPasswordErr = "Password and Confirm Password should be same";
      this.isFormValid = false;
    }
    else{
      this.ConfirmPasswordErr = "";
    }

    var passwordInfo = {
      currentPassword: this.CurrentPassword 
    }
    this.validateService.validateCurrentPassword(passwordInfo).subscribe(data => {
      if(!data.success){
        this.CurrentPasswordErr = "Invalid Current Password";
        this.isFormValid = false;
      }
      else{
        this.CurrentPasswordErr = "";
      }
    })

  }
}
