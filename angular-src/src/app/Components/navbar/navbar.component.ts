import { Component, OnInit } from '@angular/core';
import { UsermanagementService } from '../../services/usermanagement/usermanagement.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  name: String;
  UserRole: String;
  constructor(
    private usermanagementService: UsermanagementService,
    private router: Router,
    private route: ActivatedRoute,
    private flashMessages: FlashMessagesService
  ) { }

  ngOnInit() {
    if(this.usermanagementService.loggedIn()){
    this.usermanagementService.getUserInfo().subscribe(result=>{
             this.usermanagementService.UserRole = result.Role;
         });
    }
  }

  onLogoutClick(){
    this.usermanagementService.logout();
    this.flashMessages.show('You are logged out successfully.', { cssClass: 'alert-success', timeout: 3000});
    this.router.navigate(['']);
    return false;
  };

}
