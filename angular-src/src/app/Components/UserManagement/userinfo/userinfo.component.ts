import { Component, OnInit } from '@angular/core';
import { UsermanagementService } from '../../../services/usermanagement/usermanagement.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-userinfo',
  templateUrl: './userinfo.component.html',
  styleUrls: ['./userinfo.component.css']
})
export class UserinfoComponent implements OnInit {
  FirstName: String;
  MiddleName: String;
  LastName: String;
  userInfo = [];
  userInfoCopy = [];
  hasRecord: Boolean;

  constructor(
    private usermanagementService: UsermanagementService,
    private flashMessages: FlashMessagesService,
    private router: Router) { }

  ngOnInit() {
    this.usermanagementService.getUserInformation().subscribe(result=>
    {
      this.hasRecord = result.success;
      if(result.msg == "Unauthorized"){
        this.flashMessages.show("You are not authorized to view this page.", {cssClass: 'alert-danger', timeout: 3000});
        this.router.navigate(['/Logout']);
      }
      if(result.success == true)
      {
        var res = [];
        for (var x in result.msg.recordset)
        {
          result.msg.recordset.hasOwnProperty(x) && res.push(result.msg.recordset[x])
        }
        this.userInfo = res;
        this.userInfoCopy = res;
      }
    })
  }

  searchUser(e){
    var term = '';
    if(e.target.value.length>0){
      term=e.target.value;
    }
    var anySrch:boolean=false;
  
    if(term != undefined){
      if(term.length>0){
        this.userInfo=this.userInfoCopy.filter(data=> {
          return data.FirstName.toLowerCase().indexOf(term.toLowerCase())>=0 || 
                 data.LastName.toLowerCase().indexOf(term.toLowerCase()) >= 0 ||
                 data.EmailId.toLowerCase().indexOf(term.toLowerCase()) >= 0 ||
                 data.PhoneNo.toLowerCase().indexOf(term.toLowerCase()) >= 0 ||
                 data.Username.toLowerCase().indexOf(term.toLowerCase()) >= 0 ||
                 data.Role.toLowerCase().indexOf(term.toLowerCase()) >= 0
               });
          anySrch=true;
      }
    }

    if(!anySrch){
      this.userInfo=this.userInfoCopy;
    }
  }

}
