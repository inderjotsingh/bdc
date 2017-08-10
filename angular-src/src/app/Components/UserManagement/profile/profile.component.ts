import { Component, OnInit } from '@angular/core';
import { UsermanagementService } from '../../../services/usermanagement/usermanagement.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: Object;
  constructor(
    private usermanagementService: UsermanagementService,
    private router: Router
  ) { }

  ngOnInit() {
    this.usermanagementService.getProfile().subscribe(profile => {
      this.user = profile.user.recordset[0];
    }, 
    
    err => {
      console.log(err);
      return false; 
    });
  }

}
