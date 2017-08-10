import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UsermanagementService } from '../services/usermanagement/usermanagement.service';

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(
        private usermanagementService: UsermanagementService,
        private router: Router){

        }
    
    canActivate(){
        if(this.usermanagementService.loggedIn()){
            return true;
        }
        else{
            this.router.navigate(['']);
            return false;
        }
    }
}