import { Component, OnInit } from '@angular/core';
import { PatientinfoService } from '../../../services/patientinfo/patientinfo.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ValidateService } from '../../../services/validate.service';
import {IMyOptions, IMyDateModel} from 'mydatepicker';
import converter  from 'number-to-words';

declare let jsPDF;

@Component({
  selector: 'app-newtest',
  templateUrl: './newtest.component.html',
  styleUrls: ['./newtest.component.css']
})
export class NewtestComponent implements OnInit {

  ReferredBy: String;
  SampleReceivedTime: String;
  ReportTime: String;

  PatientId: Number;
  Name: String;
  Careof: String;
  Sex:String;
  Age: String;
  ContactNo: String;

  hasRecord: Boolean;
  DisplayTestInfo: Boolean;
  allTestInfo = [];
  allTestInfoCopy= [];
  TestInfo  = [];
  TestInfoCopy = [];
  selectedTest = [];
  selectedTestInfo = [];
  public show:boolean = false;
  reportReceiptInfo = [];
  reportReceiptTestInfo = [];

  TotalFee: Number = 0;
  DoorStepCharges: Number = 0;
  ConcessionPercent: Number = 0;
  ConcessionAmount: Number = 0;
  TotalPlusFee: Number = 0;
  TotalFeePayable: Number = 0;

  isFormValid: Boolean;

  clicked(index) {
    this.DisplayTestInfo = true;
    this.TestInfo = this.TestInfoCopy.filter(data => {
      return data.id == index;
    })
  };


  private TestDate: Object = { date: { year: 2008, month: 0o1, day: 0o1 }    };
 
  constructor(
    private patientinfoService: PatientinfoService,
    private router: Router,
    private route: ActivatedRoute,
    private flashMessages: FlashMessagesService,
    private validateService: ValidateService
  ) { }

  ngOnInit() {
    var patientId = this.route.snapshot.queryParams['id'];
    this.patientinfoService.GetPatientDetail(patientId).subscribe(result=>
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
      }

      var start: Date = new Date(); 
      this.TestDate = { date: { year: start.getFullYear(), month: start.getMonth() + 1, day: start.getDate() } };
      
      this.patientinfoService.GetAll_Category_Test_SubTest().subscribe(testInfo=>{
        if(testInfo.msg == "Unauthorized"){
          this.flashMessages.show("You are not authorized to view this page.", {cssClass: 'alert-danger', timeout: 3000});
          this.router.navigate(['/Logout']);
        }

        var res = [];
        for (var x in testInfo.msg){
          testInfo.msg.hasOwnProperty(x) && res.push(testInfo.msg[x])
        }
        this.allTestInfoCopy = res[0];
        this.allTestInfo = res[0];

        this.TestInfo = res[1];
        this.TestInfoCopy = res[1];
        this.DisplayTestInfo = false;

        // let uniqueArray = this.allTestInfoCopy.filter(function (el, index, array) { 
        //   return array.indexOf (el) == index;
        // });


        //console.log('unique:' +  uniqueArray);


        //this.allTestInfo=this.remove_duplicates(this.allTestInfoCopy);
        //this.allTestInfo = res.filter((x, i, a) => x && a.indexOf(x) === i);

        // this.allTestInfo = this.allTestInfoCopy.filter(function(itm, i, a) {
        //   return i == a.indexOf(itm);
        // });

        //console.log('unique:' + this.allTestInfo);
      })
    })
  }

  

  remove_duplicates(arr) {
    let obj = {};
    for (let i = 0; i < arr.length; i++) {
        obj[arr[i]] = true;
    }
    arr = [];
    for (let key in obj) {
        arr.push(key);
    }
    return arr;
}

  private myDatePickerOptions: IMyOptions = {
    dateFormat: 'dd/mm/yyyy',
    editableDateField:false//,
  };

  onTestSubmit(){
    // this.DownloadFeeReceipt('170700001');
    // this.router.navigate(['/Patients']);
    var patientTestInfo = {
      PatientId: this.route.snapshot.queryParams['id'],
      TestDate: this.TestDate,
      ReferredBy: this.ReferredBy,
      SampleReceivedTime: this.SampleReceivedTime,
      ReportTime: this.ReportTime,
      TotalFee: this.TotalFee,
      DoorStepCharges: this.DoorStepCharges,
      ConcessionAmount: this.ConcessionAmount,
      ConcessionPercent: this.ConcessionPercent,
      TotalFeePayable: this.TotalFeePayable,
      SelectedTest: this.selectedTest.join(',')
    }

    this.isFormValid = true;
    this.validateForm('all');
    if(this.isFormValid){
      this.patientinfoService.insertPatientTestInfo(patientTestInfo).subscribe(data => {
        if(data.msg == "Unauthorized"){
          this.flashMessages.show("You are not authorized to view this page.", {cssClass: 'alert-danger', timeout: 3000});
          this.router.navigate(['/Logout']);
        }

        if(data.success){
          this.flashMessages.show(data.msg, {cssClass: 'alert-success', timeout: 3000});
          this.router.navigate(['/Patients']);
        }
        else{
          this.flashMessages.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});
        }
      })
    }

  }

  DownloadFeeReceipt(reportid){

    this.patientinfoService.getPatientTestReceiptData(reportid).subscribe(result=>
    {
      this.hasRecord = result.success;
      if(result.msg == "Unauthorized"){
        this.flashMessages.show("You are not authorized to view this page.", {cssClass: 'alert-danger', timeout: 3000});
        this.router.navigate(['/Logout']);
      }
      if(result.success == true)
      {
        var res = [];
        for (var x in result.msg){
          result.msg.hasOwnProperty(x) && res.push(result.msg[x])
        }

        this.reportReceiptInfo = res[0];
        this.reportReceiptTestInfo = res[1];

        var doc = new jsPDF();
        doc.setFontSize(20);
        doc.setTextColor(255,0,0)
        doc.text(35, 30, '+ Blood Donors Council Charitable (Regd.) +');

        doc.setFontSize(10);
        doc.text(43, 36, 'Rahon Road, NAWASHAHR, Distt. Shaheed Bhagat Singh Nagar (Pb.) 144541');
        
        doc.setFontSize(10);
        doc.text(60, 41, 'Tel. 01823-22190 (Extn. 220974), Mobile. 98154-98000');

        doc.setFontSize(10);
        doc.text(82, 46, 'www.bloodbankdcnsr.org');

        doc.setFontSize(10);
        doc.text(85, 51, 'bdcnsr@hotmail.com');
        
        doc.line(20, 56, 190, 56);

        var patientId = this.reportReceiptInfo[0].PatientId;
        var reportId = this.reportReceiptInfo[0].ReportId;
        var testDate = this.reportReceiptInfo[0].TestDate;
        var patientName = this.reportReceiptInfo[0].Name;
        var careof = this.reportReceiptInfo[0].Care_Of;
        var age = this.reportReceiptInfo[0].Age; 
        var sex = this.reportReceiptInfo[0].Sex; 
        var referedBy = this.reportReceiptInfo[0].ReferredBy;
        var totalFee = this.reportReceiptInfo[0].TotalFee;
        var DoorStepCharges = this.reportReceiptInfo[0].DoorStepCharges;
        var ConcessionAmount = this.reportReceiptInfo[0].ConcessionAmount;
        var FeePaid = this.reportReceiptInfo[0].FeePaid;
        
        var fromDay = new Date(testDate);
        var day = fromDay.getDate();
        var month = fromDay.getMonth() + 1;
        var year = fromDay.getFullYear();
        //var tDate = new Date(testDate);
       
        var FeePaidWords = converter.toWords(FeePaid);
        FeePaidWords = FeePaidWords.toLowerCase().replace(/\b[a-z]/g, function(letter) {
          return letter.toUpperCase();
        });
        doc.setFontSize(10);

        doc.text(20, 61, 'Receipt No. : ' + reportId);
        doc.text(92, 61, 'Date: ' + day + "-" + month + "-" + year);
        doc.text(162, 61, 'Patient ID: ' + patientId);

        doc.text(20, 66, 'Received with thanks from ' + patientName + ' C/o ' + careof);
        doc.text(158, 66, 'Age: ' + age);
        //doc.text(110, 66, 'Sex: ' + sex);
        
        doc.text(20, 71, 'the sum of Rs. ' + FeePaid + ' ( ' + FeePaidWords + ' only ) by cash');

        doc.text(20, 76, 'Referred By ' + referedBy);

        doc.text(20, 81, 'on account of B.D.C High-Tech-Lab. Test Fees');
        
        //doc.table()
        doc.line(20, 87, 190, 87);
        doc.line(158, 87, 158, 93);
        doc.setFontType("bold");
        doc.text(20, 92, 'Test Name ');  
        doc.text(159, 92, 'Fee (Rs)');  
        doc.setFontType("normal"); 
        doc.line(20, 93, 190, 93);
        var lastElementYaxis = 98;
        var fee = 0;

        for(var i = 0;i<this.reportReceiptTestInfo.length;i++){
          var fee = Number(this.reportReceiptTestInfo[i]["test_price"]);
          doc.text(21, lastElementYaxis, this.reportReceiptTestInfo[i]["test_name"]);   
          doc.text(159, lastElementYaxis, fee.toString());   
          doc.line(20, lastElementYaxis + 1, 190, lastElementYaxis + 1);
          doc.line(158, lastElementYaxis - 5, 158, lastElementYaxis + 7);
          lastElementYaxis = lastElementYaxis + 7;
        }
        doc.text(21, lastElementYaxis - 1, 'Home Collection Charges');   
        doc.text(159, lastElementYaxis - 1, DoorStepCharges.toString());   
        doc.line(20, lastElementYaxis, 190, lastElementYaxis);

        doc.setFontType("bold");
        doc.text(140, lastElementYaxis + 5, 'Sub Total');   
        doc.text(159, lastElementYaxis + 5, totalFee.toString());   
        doc.line(20, lastElementYaxis + 7, 190, lastElementYaxis + 7);
        doc.text(137, lastElementYaxis + 12, 'Concession');   
        doc.text(159, lastElementYaxis + 12, ConcessionAmount.toString());   
        doc.line(20, lastElementYaxis + 14, 190, lastElementYaxis + 14);
        doc.text(127, lastElementYaxis + 19, 'Total Fee Payable');   
        doc.text(159, lastElementYaxis + 19, FeePaid.toString());   
        doc.line(20, lastElementYaxis + 21 , 190, lastElementYaxis + 21);
        
        doc.line(20, 87, 20, lastElementYaxis + 21);
        doc.line(190, 87, 190, lastElementYaxis + 21);
        doc.line(158, lastElementYaxis, 158, lastElementYaxis + 21);


        doc.text(145, lastElementYaxis + 42, 'For Blood Donor Council');

        doc.text(170, lastElementYaxis + 63, 'Signature');


        // doc.addPage();
        // doc.text(20, 20, 'Do you like that?');

        // Save the PDF
        doc.save('Test.pdf');



      }
    })



    
  }

  validateForm(all)
  {
    
  }

  addDoorStepCharges(e){

    if(this.DoorStepCharges != e.target.value)
    {
      this.TotalFeePayable = (Number(Number(this.TotalFee) + Number(e.target.value)) - (Number(Number(this.TotalFee) + Number(e.target.value)) * Number(this.ConcessionPercent) / 100));
      this.DoorStepCharges = e.target.value;
      this.ConcessionAmount = (Number(Number(this.TotalFee) + Number(e.target.value)) * Number(this.ConcessionPercent) / 100);
    }
  }

  calculateConcession(e){
      this.ConcessionAmount = (Number(Number(this.TotalFee) + Number(this.DoorStepCharges)) * Number(e.target.value) / 100);
      this.TotalFeePayable = (Number(Number(this.TotalFee) + Number(this.DoorStepCharges)) - (Number(Number(this.TotalFee) + Number(this.DoorStepCharges)) * Number(e.target.value) / 100));
      this.ConcessionPercent = e.target.value;
  }

  getSelectedVal(e){
    let index: number = this.selectedTest.indexOf(e);
    if(index !== -1){
      return true;
    }
    else{
      return false;
    }
  }

  CheckTestId(e){
    let index: number = this.selectedTest.indexOf(e);
    if (index !== -1) {
        this.selectedTest.splice(index, 1);
        var result = this.TestInfoCopy.filter(data => {
          return data.test_id == e
        });
        // this.TotalFee = this.TotalFee - result[0].test_price;
        this.TotalFee = Number(Number(this.TotalFee) - Number(result[0].test_price));
        this.selectedTestInfo.splice(index, 1);
    }
    else{
      this.selectedTest.push(e);
      // this.selectedTestInfo = this.TestInfoCopy.filter(data => {
      //   return data.test_id == e
      // });

       var result = this.TestInfoCopy.filter(data => {
        return data.test_id == e
      });

      this.TotalFee = Number(Number(result[0].test_price) + Number(this.TotalFee));

      this.selectedTestInfo.push(result[0]);
    };
    this.TotalFeePayable = this.TotalFee;
    // if(this.selectedTest.indexOf(e) >= 0){
    //   this.selectedTest.pop(e);
    // }
    // else{
    //   this.selectedTest.push(e);
    // }
  }

}
