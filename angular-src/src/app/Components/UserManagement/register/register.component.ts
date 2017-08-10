import { Component, OnInit } from '@angular/core';
import { UsermanagementService } from '../../../services/usermanagement/usermanagement.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ValidateService } from '../../../services/validate.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  //Objects Value
  FirstName: String;
  MiddleName: String;
  LastName: String;
  PhoneNo: String;
  EmailID: String;
  Username: String;
  Password: String;
  ConfirmPassword: String;
  Role: String;
  Blocked: Boolean;
  //Objects Value

  //Validation Objects
  isFormValid: Boolean;
  FirstNameErr: String;
  MiddleNameErr: String;
  LastNameErr: String;
  PhoneNoErr: String;
  EmailIDErr: String;
  UsernameErr: String;
  PasswordErr: String;
  ConfirmPasswordErr: String;
  RoleErr: String;
  BlockedErr: String;
  //Validation Objects

  UsernameAvailable: String;
  UsernameUnAvailable: String;
  showLoading: Boolean;
  constructor(
    private usermanagementService: UsermanagementService,
    private router: Router,
    private route: ActivatedRoute,
    private flashMessages: FlashMessagesService,
    private validateService: ValidateService
  ) { }

  ngOnInit() {
  }

  registerUser(){
    this.isFormValid = true;
    this.validateForm('all');
    if(this.isFormValid){
       var userInfo = {
          FirstName: this.FirstName,
          MiddleName: this.MiddleName,
          LastName: this.LastName,
          PhoneNo: this.PhoneNo,
          EmailID: this.EmailID,
          Username: this.Username,
          Password: this.Password,
          Role: this.Role,
          Blocked: false,
      }

      this.usermanagementService.registerUser(userInfo).subscribe(data => {
        if(data.success){
          this.flashMessages.show(data.msg, {cssClass: 'alert-success', timeout: 3000});
          this.router.navigate(['/Users']);
        }
        else{
          this.flashMessages.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});
          this.router.navigate(['/EditUserInfo']);
        }
      })
    }
  }

  checkUsernameAvailability(username){
    this.showLoading = true;
    var user = this.Username;
    this.usermanagementService.checkUserAvailable(user).subscribe(data => {
        if(data.success){
          this.UsernameAvailable = data.msg;
          this.UsernameUnAvailable = "";
        }
        else{
          this.UsernameAvailable = "";
          this.UsernameUnAvailable = data.msg;
        }
      })
      this.showLoading = false;
  }

  validateForm(ctr){
 
    this.FirstNameErr = "";
    this.MiddleNameErr = "";
    this.LastNameErr = "";
    this.PhoneNoErr = "";
    this.EmailIDErr = "";
    this.UsernameErr = "";
    this.PasswordErr = "";
    this.ConfirmPasswordErr = "";
    this.RoleErr = "";
    this.BlockedErr = "";

    //Required Validations
    if(!this.validateService.validateRequiredTextField(this.FirstName)){
      this.FirstNameErr = "Please enter First Name";
      this.isFormValid = false;
    }
    else{
      this.FirstNameErr = "";
    }

    if(!this.validateService.validateRequiredTextField(this.LastName)){
      this.LastNameErr = "Please enter Last Name";
      this.isFormValid = false;
    }

    if(!this.validateService.validateRequiredTextField(this.PhoneNo)){
      this.PhoneNoErr = "Please enter Phone Number";
      this.isFormValid = false;
    }

    if(!this.validateService.validateRequiredTextField(this.EmailID)){
      this.EmailIDErr = "Please enter Email ID";
      this.isFormValid = false;
    }

    if(!this.validateService.validateRequiredTextField(this.Username)){
      this.UsernameErr = "Please enter Username";
      this.isFormValid = false;
    }

    if(!this.validateService.validateRequiredTextField(this.Password)){
      this.PasswordErr = "Please enter Password";
      this.isFormValid = false;
    }

    if(!this.validateService.validateRequiredTextField(this.ConfirmPassword)){
      this.ConfirmPasswordErr = "Please enter Confirm Password";
      this.isFormValid = false;
    }

    if(!this.validateService.validateRequiredDropdownField(this.Role)){
      this.RoleErr = "Please select Role";
      this.isFormValid = false;
    }

    //Required Validations

    if(!this.validateService.validateEmail(this.EmailID)){
      this.EmailIDErr = "Please enter valid Email ID";
      this.isFormValid = false;
    }

    if(!this.validateService.confirmPassword(this.Password, this.ConfirmPassword)){
      this.PasswordErr = "Password and Confirm Password should be same";
      this.isFormValid = false;
    }

    if(!this.validateService.passwordStrength(this.Password)){
      this.PasswordErr = "Password should contain at least one number, one lowercase and one uppercase letter and at least six characters";
      this.isFormValid = false;
    }

  }

}
