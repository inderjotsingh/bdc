import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { UsermanagementService } from './usermanagement/usermanagement.service';

@Injectable()
export class ValidateService {

  constructor(
    private http: Http,
    private usermanagementService: UsermanagementService
  ) { }

  validateRequiredTextField(textField){
    if(textField == undefined || textField == ''){
      return false;
    }
    else{
      return true;
    }
  }

  validateRequiredDropdownField(dropdownField){
    if(dropdownField == undefined)
    {
      return false;
    }
    else{
      return true;
    }
  }

  validateEmail(email){
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  confirmPassword(password, conformPassword){
    if(password != conformPassword){
      return false;
    }
    else{
      return true;
    }
  }

  validateCurrentPassword(passwordInfo){
    let headers = new Headers();
    this.usermanagementService.loadToken();
    headers.append('Authorization',this.usermanagementService.authToken);  //sending token to header.
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/user/validateCurrentPassword', passwordInfo, {headers: headers}).map(res => res.json());
  }

  passwordStrength(password){
    // at least one number, one lowercase and one uppercase letter
    // at least six characters
    var re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    return re.test(password);
  }

}
