import { Component, OnInit } from '@angular/core';
import { TestinfoService } from '../../../services/testinfo/testinfo.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
@Component({
  selector: 'app-testlist',
  templateUrl: './testlist.component.html',
  styleUrls: ['./testlist.component.css']
})
export class TestlistComponent implements OnInit {
  ReportId: String;
  PatientId: String;
  PatientName: String;
  TestDate: Date;
  TestCategories: String;

  testInfo = [];
  testInfoCopy = [];

  hasRecord: Boolean;
  constructor(
    private testInfoService: TestinfoService,
    private flashMessages: FlashMessagesService,
    private router: Router
  ) { }

  ngOnInit() {
    this.testInfoService.GetPendingTestInfo().subscribe(result=>
    {
      this.hasRecord = result.success;
      if(result.msg == "Unauthorized"){
        this.flashMessages.show("You are not authorized to view this page.", {cssClass: 'alert-danger', timeout: 3000});
        this.router.navigate(['/Logout']);
      }

      if(result.success){
        var res = [];
        for (var x in result.msg.recordset){
        result.msg.recordset.hasOwnProperty(x) && res.push(result.msg.recordset[x])
        }
        this.testInfo = res;
        this.testInfoCopy = res;
      }
    })
  }

  searchTestInfo(e){
    
    var term = '';
    if(e.target.value.length>0){
      term=e.target.value;
    }
    var anySrch:boolean=false;
    if(term != undefined){
      if(term.length>0){
        this.testInfo=this.testInfoCopy.filter(data=> {
          return data.ReportId.toLowerCase().indexOf(term.toLowerCase())>=0 || 
                 data.Name.toLowerCase().indexOf(term.toLowerCase()) >= 0 || 
                 data.PatientId.toLowerCase().indexOf(term.toLowerCase()) >= 0 });
          anySrch=true;
      }
    }

    if(!anySrch){
      this.testInfo=this.testInfoCopy;
    }
  }

}
