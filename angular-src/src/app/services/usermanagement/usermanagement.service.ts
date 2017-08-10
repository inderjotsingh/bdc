import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class UsermanagementService {
  userInfo: any;
  username: String;
  UserRole: String;

  authToken: any;
  user: any;
  constructor(private http: Http) { }

  registerUser(userInfo){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization',this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/user/register', userInfo, {headers: headers}).map(res=>res.json());
  }

  checkUserAvailable(username){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization',this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/user/checkUserAvailability?id='+ username, {headers: headers}).map(res=>res.json());
  }

  authenticateUser(userInfo){
    return this.http.post('http://localhost:3000/user/authenticate', userInfo).map(res=>res.json());
  }

  getUserInfo(){   //Get Current User Role for Navbar items
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization',this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.get('http://localhost:3000/user/GetUserRole', {headers: headers}).map(res => res.json());
  }

  getUserInformation(){  //Get all registered users
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization',this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.get('http://localhost:3000/user/GetAllUsers', {headers: headers}).map(res => res.json());
  }

  getProfile(){   //Get profile information of currently logged in user.
      let headers = new Headers();
      this.loadToken();
      headers.append('Authorization',this.authToken);  //sending token to header.
      headers.append('Content-Type','application/json');
      return this.http.get('http://localhost:3000/user/profile', {headers: headers}).map(res => res.json());
  }

  updatePassword(changePasswordInfo){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization',this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/user/changePassword', changePasswordInfo, {headers: headers}).map(res=>res.json());
  }

  loadToken(){
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  loggedIn(){
    return tokenNotExpired('id_token');
  }

  storeUserData(token, user){
    var key = CryptoJS.enc.Base64.parse("#base64Key#");
    var iv  = CryptoJS.enc.Base64.parse("#base64IV#");
    
    //Impementing the Key and IV and encrypt the password
    var encrypted = CryptoJS.AES.encrypt(JSON.stringify(user), key, {iv: iv});
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', encrypted);
    //localStorage.setItem('user', JSON.stringify(user));
    
    this.authToken = token;
    this.user = user;
  }

  getLoggedInUserInfo(InfoRequired){
    var user = localStorage.getItem('user');
    var key = CryptoJS.enc.Base64.parse("#base64Key#");
    var iv  = CryptoJS.enc.Base64.parse("#base64IV#");
    var cipherParams = CryptoJS.lib.CipherParams.create({
                ciphertext: CryptoJS.enc.Base64.parse(user)
                });
       var decrypted = CryptoJS.AES.decrypt(
                  cipherParams,
                  key,
                  { iv: iv });
                  var decrptedUserInfo = decrypted.toString(CryptoJS.enc.Utf8);
                const userInfo = JSON.parse(decrptedUserInfo); 
                
      if(InfoRequired == 'Name'){
        return userInfo.FirstName + " " + userInfo.LastName;
      }
      else{
        
      }
  }

  logout(){
    this.authToken = null;
    this.user = null;
    this.UserRole = "";
    localStorage.removeItem('user');
    localStorage.clear();
    //sessionStorage.clear();
  }

}
