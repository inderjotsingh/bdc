import { Component, OnInit } from '@angular/core';
import { TestinfoService } from '../../../services/testinfo/testinfo.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ValidateService } from '../../../services/validate.service';

@Component({
  selector: 'app-testprocessing',
  templateUrl: './testprocessing.component.html',
  styleUrls: ['./testprocessing.component.css']
})
export class TestprocessingComponent implements OnInit {

  ReferredBy: String;
  SampleReceivedTime: String;
  ReportTime: String;
  ReportId: String;
  PatientId: String;
  Name: String;
  Careof: String;
  Sex:String;
  Age: String;
  ContactNo: String;
  TestDate: Date;

  mainArray = [];
  
  distintCategories = [];
  allTestInfo = [];
  values = [];

  mainObject = {};

  hasRecord: Boolean;
  constructor(
    private testinfoService: TestinfoService,
    private router: Router,
    private route: ActivatedRoute,
    private flashMessages: FlashMessagesService,
    private validateService: ValidateService
  ) { }

  ngOnInit() {

    var reportId = this.route.snapshot.queryParams['id'];
    this.testinfoService.GetPatientTestInfoByReportId(reportId).subscribe(result=>
    {
      this.hasRecord = result.success;
      if(result.msg == "Unauthorized"){
        this.flashMessages.show("You are not authorized to view this page.", {cssClass: 'alert-danger', timeout: 3000});
        this.router.navigate(['/Logout']);
      }
      if(result.success == true)
      {
        this.PatientId = result.msg.recordset[0].PatientId;
        this.Name = result.msg.recordset[0].Name;
        this.Careof = result.msg.recordset[0].Care_Of;
        this.Sex = result.msg.recordset[0].Sex;
        this.Age = result.msg.recordset[0].Age;
        this.ContactNo = result.msg.recordset[0].Contact_No;
        this.ReportId = result.msg.recordset[0].ReportId;
        this.TestDate = result.msg.recordset[0].TestDate;
        this.SampleReceivedTime = result.msg.recordset[0].SampleReceivedTime;
        this.ReportTime = result.msg.recordset[0].ReportTime;
        this.ReferredBy = result.msg.recordset[0].ReferredBy;

        this.allTestInfo = result.msg.recordsets[1];
        
        // console.log(this.allTestInfo);
        // this.mainObject = this.allTestInfo;
        // this.mainObject = {
        //   "11_121": "1",
        //   "11_682":"2",
        //   "11_683":"3",
        //   "11_684":"4"
        // }
        

        var value= result.msg.recordsets[1].filter(al => {
            this.mainArray.push(al.TestId + "_" + al.SubTestId);
        })

        //console.log(this.mainArray);

        //this.mainArray.push(result.msg.recordsets[1])
        var elementId = [];
        this.distintCategories = result.msg.recordsets[1].filter(el => {
            if (elementId.indexOf(el.CategoryId) === -1) {
                // If not present in array, then add it
                elementId.push(el.CategoryId);
                return true;
            } else {
                // Already present in array, don't add it
                return false;
            }
        });
      }
    })
  }

  submitTestProcessing(){
    var reportId = this.route.snapshot.queryParams['id'];
    var testInfoArray = Object.keys(this.mainObject).map((key)=>{ return key + "_" + this.mainObject[key]});
    var testInfoString = testInfoArray.join(',');
    var patientTestInfo = {
      ReportId: reportId,
      TestInfo: testInfoString
    }

    this.testinfoService.UpdateReportInfo(patientTestInfo).subscribe(data => {
      if(data.msg == "Unauthorized"){
        this.flashMessages.show("You are not authorized to view this page.", {cssClass: 'alert-danger', timeout: 3000});
        this.router.navigate(['/Logout']);
      }

      if(data.success){
        this.flashMessages.show(data.msg, {cssClass: 'alert-success', timeout: 3000});
        this.router.navigate(['/Tests']);
      }
      else{
        this.flashMessages.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});
      }
    })
  }

}
