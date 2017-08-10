import { Component, OnInit } from '@angular/core';
import { PatientinfoService } from '../../../services/patientinfo/patientinfo.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ValidateService } from '../../../services/validate.service';

@Component({
  selector: 'app-patientinfo',
  templateUrl: './patientinfo.component.html',
  styleUrls: ['./patientinfo.component.css']
})
export class PatientinfoComponent implements OnInit {

  addPatientClicked: Boolean;
  hasRecord: Boolean;
  //Searching
  SearchPatient: String;
  searchPatientInfo= [];
  
  //Add Patient
  Name: String;
  Careof: String;
  Sex:String;
  Age: String;
  ContactNo: String;

  //Validation
  isFormValid: Boolean;
  NameErr: String;
  CareofErr: String;
  SexErr:String;
  AgeErr: String;
  ContactNoErr: String;

  constructor(
    private patientinfoService: PatientinfoService,
    private router: Router,
    private flashMessages: FlashMessagesService,
    private validateService: ValidateService) { }

  ngOnInit() {
    this.Sex = "Male";
    this.addPatientClicked = false;
    this.hasRecord = false;
  }

  searchPatient(){
     this.addPatientClicked = false;
    this.patientinfoService.SearchAllPatient(this.SearchPatient).subscribe(result=>
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
        this.searchPatientInfo = res;
      }
    })
  }

  addPatient(){
    this.addPatientClicked = true;
    this.hasRecord = false;
  }

  hideAddPatient(){
    this.addPatientClicked = false;
  }

  insertPatient(){
    var patientInfo = {
      Name: this.Name,
      Careof: this.Careof,
      Sex: this.Sex,
      Age: this.Age,
      ContactNo: this.ContactNo
    }

     this.isFormValid = true;
     this.validatForm('all');
     if(this.isFormValid){
      this.patientinfoService.insertPatient(patientInfo).subscribe(data => {
          if(data.success){
            this.addPatientClicked = false;
            this.flashMessages.show(data.msg, {cssClass: 'alert-success', timeout: 3000});
            this.router.navigate(['/Patients']);
          }
          else{
            this.flashMessages.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});
            this.router.navigate(['/Patients']);
          }
        })
    }
  }

  validatForm(ctr){
    this.NameErr = "";
    this.CareofErr = "";
    this.SexErr = "";
    this.AgeErr = "";
    this.ContactNoErr = "";

    if(!this.validateService.validateRequiredTextField(this.Name)){
      this.NameErr = "Please enter Name";
      this.isFormValid = false;
    }

    if(!this.validateService.validateRequiredTextField(this.Careof)){
      this.CareofErr = "Please enter C/o";
      this.isFormValid = false;
    }

    if(!this.validateService.validateRequiredTextField(this.Age)){
      this.AgeErr = "Please enter Age";
      this.isFormValid = false;
    }

    if(!this.validateService.validateRequiredTextField(this.ContactNo)){
      this.ContactNoErr = "Please enter Contact Number";
      this.isFormValid = false;
    }
    
  }
}
