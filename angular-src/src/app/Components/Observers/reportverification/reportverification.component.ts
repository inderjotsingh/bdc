import { Component, OnInit } from '@angular/core';
import { TestinfoService } from '../../../services/testinfo/testinfo.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ValidateService } from '../../../services/validate.service';
import converter  from 'number-to-words';
import { PatientinfoService } from '../../../services/patientinfo/patientinfo.service';
declare let jsPDF;

@Component({
  selector: 'app-reportverification',
  templateUrl: './reportverification.component.html',
  styleUrls: ['./reportverification.component.css']
})
export class ReportverificationComponent implements OnInit {
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
  Status: String;
  Comments: String;  

  mainArray = [];
  
  distintCategories = [];
  allTestInfo = [];
  values = [];

  mainObject = {};

  distinctTests = [];

  PatientHistoryReports = [];
  reportReceiptInfo = [];
  reportReceiptTestInfo = [];
  distinctReportIds = [];
  distinctCategory_ReportId: any;

  hasRecord: Boolean;
  constructor(
    private testinfoService: TestinfoService,
    private router: Router,
    private route: ActivatedRoute,
    private flashMessages: FlashMessagesService,
    private validateService: ValidateService,
    private patientinfoService: PatientinfoService
  ) { }

  printToCart(pdfReport: string){
    let popupWinindow
    let innerContents = document.getElementById(pdfReport).innerHTML;
    popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
    popupWinindow.document.open();
    popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()" style="font-family:arial;">' + innerContents + '</html>');
    popupWinindow.document.close();
  }


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
        var value= result.msg.recordsets[1].filter(al => {
            this.mainArray.push(al.TestId + "_" + al.SubTestId);
        })

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

        var testElementId = [];
        this.distinctTests = result.msg.recordsets[1].filter(el => {
            if (testElementId.indexOf(el.TestId) === -1) {
                // If not present in array, then add it
                testElementId.push(el.TestId);
                return true;
            } else {
                // Already present in array, don't add it
                return false;
            }
        });
      }
    })
  }

  UpdateReportStatus(){
   
    var reportId = this.route.snapshot.queryParams['id'];
    var TestReportInfo = {
      ReportId: reportId,
      Status: this.Status,
      Comments: this.Comments
    }

    this.testinfoService.UpdateReportStatus(TestReportInfo).subscribe(data => {
      if(data.msg == "Unauthorized"){
        this.flashMessages.show("You are not authorized to view this page.", {cssClass: 'alert-danger', timeout: 3000});
        this.router.navigate(['/Logout']);
      }

      if(data.success){
        this.flashMessages.show(data.msg, {cssClass: 'alert-success', timeout: 3000});
        this.router.navigate(['/Reports']);
      }
      else{
        this.flashMessages.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});
      }
    })
  }


  header(doc, reportReceiptInfo){
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

    var patientId = reportReceiptInfo[0].PatientId;
    var reportId = reportReceiptInfo[0].ReportId;
    var testDate = reportReceiptInfo[0].TestDate;
    var patientName = reportReceiptInfo[0].Name;
    var careof = reportReceiptInfo[0].Care_Of;
    var age = reportReceiptInfo[0].Age; 
    var sex = reportReceiptInfo[0].Sex; 
    var referedBy = reportReceiptInfo[0].ReferredBy;
    var totalFee = reportReceiptInfo[0].TotalFee;
    var DoorStepCharges = reportReceiptInfo[0].DoorStepCharges;
    var ConcessionAmount = reportReceiptInfo[0].ConcessionAmount;
    var FeePaid = reportReceiptInfo[0].FeePaid;
    var contactNo = reportReceiptInfo[0].Contact_No;
    
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
    doc.text(162, 66, 'Age: ' + age);
    //doc.text(110, 66, 'Sex: ' + sex);
    
    doc.text(20, 71, 'the sum of Rs. ' + FeePaid + ' ( ' + FeePaidWords + ' only ) by cash');

    doc.text(20, 76, 'Referred By ' + referedBy);

    doc.text(20, 81, 'on account of B.D.C High-Tech-Lab. Test Fees');
    doc.line(20, 83, 190, 83);
  }


  testReceiptHeader(doc, reportReceiptInfo){
    doc.setFontSize(20);
    doc.setTextColor(0,0,0)
    doc.text(93, 30, 'B.D.C');
    
    doc.setFontType("normal");
    doc.text(42, 37, 'HIGH-TECH CLINICAL LABORATORY');

    doc.setFontSize(10);
    doc.text(53, 41, 'Blood Donors Complex, Rahon Road, Nawashahr (S.B.S Nagar)');

    doc.line(20, 43, 190, 43);

    var patientId = reportReceiptInfo[0].PatientId;
    var reportId = reportReceiptInfo[0].ReportId;
    var testDate = reportReceiptInfo[0].TestDate;
    var patientName = reportReceiptInfo[0].Name;
    var careof = reportReceiptInfo[0].Care_Of;
    var age = reportReceiptInfo[0].Age; 
    var sex = reportReceiptInfo[0].Sex; 
    var referedBy = reportReceiptInfo[0].ReferredBy;
    var totalFee = reportReceiptInfo[0].TotalFee;
    var DoorStepCharges = reportReceiptInfo[0].DoorStepCharges;
    var ConcessionAmount = reportReceiptInfo[0].ConcessionAmount;
    var FeePaid = reportReceiptInfo[0].FeePaid;
    var contactNo = reportReceiptInfo[0].Contact_No;

    var fromDay = new Date(testDate);
    var day = fromDay.getDate();
    var month = fromDay.getMonth() + 1;
    var year = fromDay.getFullYear();

    doc.text(20, 49, 'Master Report ID. : ' + reportId);
    doc.text(92, 49, 'Date: ' + day + "-" + month + "-" + year);
    doc.text(162, 49, 'Patient ID: ' + patientId);

    doc.text(20, 54, 'Patient Name : ' + patientName + ' C/o ' + careof);
    // doc.text(92, 54, 'Date: ' + day + "-" + month + "-" + year);
    doc.text(162, 54, 'Age: ' + age);

    doc.text(20, 59, 'Referred By : ' + referedBy);
    doc.text(92, 59, 'Phone No.: ' + contactNo);
    doc.text(162, 59, 'Sex: ' + sex);

    doc.text(20, 64, 'Fee Paid: Rs. ' + FeePaid);

    doc.line(20, 68, 190, 68);
  }

  downloadReceipt(reportid){
    
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
        this.distinctReportIds = res[2];
        this.distinctCategory_ReportId = res[3];

        var doc = new jsPDF();

        //*************************Fee Receipt***************************//

        this.header(doc,this.reportReceiptInfo);

        // doc.setFontSize(20);
        // doc.setTextColor(255,0,0)
        // doc.text(35, 30, '+ Blood Donors Council Charitable (Regd.) +');

        // doc.setFontSize(10);
        // doc.text(43, 36, 'Rahon Road, NAWASHAHR, Distt. Shaheed Bhagat Singh Nagar (Pb.) 144541');
        
        // doc.setFontSize(10);
        // doc.text(60, 41, 'Tel. 01823-22190 (Extn. 220974), Mobile. 98154-98000');

        // doc.setFontSize(10);
        // doc.text(82, 46, 'www.bloodbankdcnsr.org');

        // doc.setFontSize(10);
        // doc.text(85, 51, 'bdcnsr@hotmail.com');
        
        // doc.line(20, 56, 190, 56);

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
         var contactNo = this.reportReceiptInfo[0].Contact_No;
        
        var fromDay = new Date(testDate);
        var day = fromDay.getDate();
        var month = fromDay.getMonth() + 1;
        var year = fromDay.getFullYear();
        // //var tDate = new Date(testDate);
       
        // var FeePaidWords = converter.toWords(FeePaid);
        // FeePaidWords = FeePaidWords.toLowerCase().replace(/\b[a-z]/g, function(letter) {
        //   return letter.toUpperCase();
        // });
        // doc.setFontSize(10);

        // doc.text(20, 61, 'Receipt No. : ' + reportId);
        // doc.text(92, 61, 'Date: ' + day + "-" + month + "-" + year);
        // doc.text(162, 61, 'Patient ID: ' + patientId);

        // doc.text(20, 66, 'Received with thanks from ' + patientName + ' C/o ' + careof);
        // doc.text(162, 66, 'Age: ' + age);
        // //doc.text(110, 66, 'Sex: ' + sex);
        
        // doc.text(20, 71, 'the sum of Rs. ' + FeePaid + ' ( ' + FeePaidWords + ' only ) by cash');

        // doc.text(20, 76, 'Referred By ' + referedBy);

        // doc.text(20, 81, 'on account of B.D.C High-Tech-Lab. Test Fees');
        // doc.line(20, 83, 190, 83);


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
          
          if(lastElementYaxis >= 250){
            doc.addPage();
            doc.setFontType("normal");
            this.header(doc,this.reportReceiptInfo);
            doc.line(20, 87, 190, 87);
            doc.line(158, 87, 158, 93);
            doc.setFontType("bold");
            doc.text(20, 92, 'Test Name ');  
            doc.text(159, 92, 'Fee (Rs)');  
            doc.setFontType("normal"); 
            doc.line(20, 93, 190, 93);
            var lastElementYaxis = 98;
          }
        }
        doc.text(21, lastElementYaxis - 1, 'Home Collection Charges');   
        doc.text(159, lastElementYaxis - 1, DoorStepCharges.toString());   
        doc.line(20, lastElementYaxis, 190, lastElementYaxis);


        if(lastElementYaxis >= 250){
          doc.addPage();
          doc.setFontType("normal");
          this.header(doc,this.reportReceiptInfo);
          lastElementYaxis = 98;
        }

        doc.setFontType("bold");
        doc.text(140, lastElementYaxis + 5, 'Sub Total');   
        doc.text(159, lastElementYaxis + 5, totalFee.toString());   
        doc.line(20, lastElementYaxis + 7, 190, lastElementYaxis + 7);


        if(lastElementYaxis >= 250){
          doc.addPage();
          doc.setFontType("normal");
          this.header(doc,this.reportReceiptInfo);
          lastElementYaxis = 98;
        }

        doc.text(137, lastElementYaxis + 12, 'Concession');   
        doc.text(159, lastElementYaxis + 12, ConcessionAmount.toString());   
        doc.line(20, lastElementYaxis + 14, 190, lastElementYaxis + 14);
        
        
        if(lastElementYaxis >= 250){
          doc.addPage();
          doc.setFontType("normal");
          this.header(doc,this.reportReceiptInfo);
          lastElementYaxis = 98;
        }
        
        doc.text(127, lastElementYaxis + 19, 'Total Fee Payable');   
        doc.text(159, lastElementYaxis + 19, FeePaid.toString());   
        doc.line(20, lastElementYaxis + 21 , 190, lastElementYaxis + 21);
        
        doc.line(20, 87, 20, lastElementYaxis + 21);
        doc.line(190, 87, 190, lastElementYaxis + 21);
        doc.line(158, lastElementYaxis, 158, lastElementYaxis + 21);


        if(lastElementYaxis === 250){
          doc.addPage();
          doc.setFontType("normal");
          this.header(doc,this.reportReceiptInfo);
          lastElementYaxis = 98;
        }

        doc.text(145, lastElementYaxis + 42, 'For Blood Donor Council');

        doc.text(170, lastElementYaxis + 63, 'Signature');
        //console.log(lastElementYaxis + 63);   266
        // doc.addPage();
        // doc.setFontType("normal");
        // this.header(doc,this.reportReceiptInfo);

        //*************************Fee Receipt***************************//



        //*************************Lab Receipt***************************//
        
        doc.addPage();
        this.testReceiptHeader(doc, this.reportReceiptInfo)
        // doc.setFontSize(20);
        // doc.setTextColor(0,0,0)
        // doc.text(93, 30, 'B.D.C');
        
        // doc.setFontType("normal");
        // doc.text(42, 37, 'HIGH-TECH CLINICAL LABORATORY');

        // doc.setFontSize(10);
        // doc.text(53, 41, 'Blood Donors Complex, Rahon Road, Nawashahr (S.B.S Nagar)');

        // doc.line(20, 43, 190, 43);

        // doc.text(20, 49, 'Master Report ID. : ' + reportId);
        // doc.text(92, 49, 'Date: ' + day + "-" + month + "-" + year);
        // doc.text(162, 49, 'Patient ID: ' + patientId);

        // doc.text(20, 54, 'Patient Name : ' + patientName + ' C/o ' + careof);
        // // doc.text(92, 54, 'Date: ' + day + "-" + month + "-" + year);
        // doc.text(162, 54, 'Age: ' + age);

        // doc.text(20, 59, 'Referred By : ' + referedBy);
        // doc.text(92, 59, 'Phone No.: ' + contactNo);
        // doc.text(162, 59, 'Sex: ' + sex);

        // doc.text(20, 64, 'Fee Paid: Rs. ' + FeePaid);

        // doc.line(20, 68, 190, 68);

        
        var lastElementYaxis_ReportInfo = 72;
        var lastElementYaxis_ReportInfo_ReportId = 77;
        for(var j = 0;j<this.distinctReportIds.length;j++){
          lastElementYaxis_ReportInfo = lastElementYaxis_ReportInfo + 7;
          doc.setFontType("bold");
          doc.text(93, lastElementYaxis_ReportInfo, 'Report ID: ' + this.distinctReportIds[j]["ReportId"]);
          doc.line(92, lastElementYaxis_ReportInfo + 1, 129, lastElementYaxis_ReportInfo + 1);
          for(var k = 0;k<this.distinctCategory_ReportId.length;k++){
            if(this.distinctCategory_ReportId[k]["ReportId"] === this.distinctReportIds[j]["ReportId"]){
              lastElementYaxis_ReportInfo = lastElementYaxis_ReportInfo + 10;
              doc.setFontType("bold");
              doc.text(20, lastElementYaxis_ReportInfo, this.distinctCategory_ReportId[k]["category_name"]);
              doc.setFontType("normal");
              for(var m=0;m<this.reportReceiptTestInfo.length;m++){
                if(this.reportReceiptTestInfo[m]["ReportId"] === this.distinctReportIds[j]["ReportId"] &&
                  this.reportReceiptTestInfo[m]["category_name"] === this.distinctCategory_ReportId[k]["category_name"]){
                    lastElementYaxis_ReportInfo = lastElementYaxis_ReportInfo + 5;
                    doc.text(20, lastElementYaxis_ReportInfo, " - " + this.reportReceiptTestInfo[m]["test_name"]);
                    
                    if(lastElementYaxis_ReportInfo >= 250){
                      doc.addPage();
                      this.testReceiptHeader(doc, this.reportReceiptInfo)
                      var lastElementYaxis_ReportInfo = 72;
                    }
                  }
              }
            }
          }
          
          //lastElementYaxis_ReportInfo = lastElementYaxis_ReportInfo + 5;
        }


        //*************************Lab Receipt***************************//


        // Save the PDF
        doc.save('Test.pdf');

      }
    })
  }



  // downloadReport(reportid){
  //   this.testinfoService.getPatientTestReportData(reportid).subscribe(result=>
  //   {
  //     this.hasRecord = result.success;
  //     if(result.msg == "Unauthorized"){
  //       this.flashMessages.show("You are not authorized to view this page.", {cssClass: 'alert-danger', timeout: 3000});
  //       this.router.navigate(['/Logout']);
  //     }
  //     if(result.success == true)
  //     {
  //       var res = [];
  //       for (var x in result.msg){
  //         result.msg.hasOwnProperty(x) && res.push(result.msg[x])
  //       }

  //       this.reportReceiptInfo = res[0];
  //       this.reportReceiptTestInfo = res[1];

  //       var elementId = [];
  //       this.distintCategories = this.reportReceiptTestInfo.filter(el => {
  //           if (elementId.indexOf(el.CategoryId) === -1) {
  //               // If not present in array, then add it
  //               elementId.push(el.CategoryId);
  //               return true;
  //           } else {
  //               // Already present in array, don't add it
  //               return false;
  //           }
  //       });

  //       var testElementId = [];
  //       this.distinctTests = this.reportReceiptTestInfo.filter(el => {
  //           if (testElementId.indexOf(el.TestId) === -1) {
  //               // If not present in array, then add it
  //               testElementId.push(el.TestId);
  //               return true;
  //           } else {
  //               // Already present in array, don't add it
  //               return false;
  //           }
  //       });

  //       console.log('distinctTest: ', this.distinctTests);
  //       //console.log(this.allTestInfo);
  //       // var value= result.msg.recordsets[1].filter(al => {
  //       //     this.mainArray.push(al.TestId + "_" + al.SubTestId);
  //       // })

  //       var doc = new jsPDF();  
        
  //       this.testReceiptHeader(doc, this.reportReceiptInfo);

  //        var lastElementYaxis_ReportInfo = 72;
  //       var margins = {
  //         top: 80,
  //         bottom: 60,
  //         left: 20,
  //         width: 1200
  //     };
  //       var source = document.querySelector('#pdfReport');
  //       doc.fromHTML(source, margins.left, margins.top );


  //     // var source = document.querySelector('#basic-table');
  //     //var resPdf = doc.autoTableHtmlToJson(document.getElementById('pdfReport'), true);
  //     //var resPdf = doc.autoTableHtmlToJson(source, true);
      
  //      //doc.autoTable(resPdf.columns, resPdf.data, {margins: {horizontal: 10, top: 40, bottom: 40}, startY: 370, overflow: 'linebreak', overflowColumns: false});
  //       // var elem = document.getElementById(ref.id);
  //       // var resPdf = doc.autoTableHtmlToJson(elem);
  //       //doc.autoTable(resPdf.columns, resPdf.data, {startY: 80});
  //       //return doc;



  //       // var columns = ["ID", "Name", "Country"];
  //       // var rows = [
  //       //     [1, "Shaw", "Tanzania"],
  //       //     [2, "Nelson", "Kazakhstan"],
  //       //     [3, "Garcia", "Madagascar"],
  //       // ];
  //       // doc.autoTable(columns, rows, {startY: 72, theme: 'plain'});

  //       // var columns = [];
  //       // var rows = [];
  //       // for(var i = 0;i<this.distintCategories.length;i++)
  //       // {
  //       //   doc.setFontType("bold");
  //       //   lastElementYaxis_ReportInfo = lastElementYaxis_ReportInfo + 10;
  //       //   doc.text(88, lastElementYaxis_ReportInfo, this.distintCategories[i]["category_name"]);
  //       //   for(var j = 0;j<this.reportReceiptTestInfo.length;j++){
  //       //     if(this.reportReceiptTestInfo[j]["category_name"] === this.distintCategories[i]["category_name"]){
  //       //       lastElementYaxis_ReportInfo = lastElementYaxis_ReportInfo + 5;
  //       //       if(this.reportReceiptTestInfo[j]["SubTest"] === 0 || this.reportReceiptTestInfo[j]["SubTestId"] === 0){
  //       //         columns = [this.reportReceiptTestInfo[j]["test_name"], "", ""];

  //       //         rows.push(
  //       //           this.reportReceiptTestInfo[j]["test_name"], 
  //       //           this.reportReceiptTestInfo[j]["Report"], 
  //       //           this.reportReceiptTestInfo[j]["test_range"]
                
                  
  //       //         );
  //       //         //doc.text(20, lastElementYaxis_ReportInfo, this.reportReceiptTestInfo[j]["test_name"]);
  //       //       }
  //       //       else{
  //       //         columns = [this.reportReceiptTestInfo[j]["SubTestName"], "", ""];
  //       //         rows.push(
  //       //           this.reportReceiptTestInfo[j]["SubTestName"], 
  //       //           this.reportReceiptTestInfo[j]["Report"], 
  //       //           this.reportReceiptTestInfo[j]["test_range"]
                


  //       //           // this.reportReceiptTestInfo[j]["SubTestName"], 
  //       //           // this.reportReceiptTestInfo[j]["Report"], 
  //       //           // this.reportReceiptTestInfo[j]["test_range"]
  //       //         );
  //       //         // rows = [
  //       //         //   [1, "Shaw", "Tanzania"],
  //       //         //   [2, "Nelson", "Kazakhstan"],
  //       //         //   [3, "Garcia", "Madagascar"],
  //       //       //];
  //       //         // doc.setFontType("normal");
  //       //         // doc.text(25, lastElementYaxis_ReportInfo, "- " + this.reportReceiptTestInfo[j]["SubTestName"]);
  //       //       }
              
  //       //     }
  //       //   }
  //       // doc.autoTable(columns, rows, {startY: lastElementYaxis_ReportInfo, theme: 'plain'});
  //       // }

  //       // var columns = ["ID", "Name", "Country"];
        




  //       // for(var i = 0;i<this.distintCategories.length;i++)
  //       // {
  //       //   doc.setFontType("bold");
  //       //   lastElementYaxis_ReportInfo = lastElementYaxis_ReportInfo + 10;
  //       //   doc.text(88, lastElementYaxis_ReportInfo, this.distintCategories[i]["category_name"]);
  //       //   for(var j = 0;j<this.reportReceiptTestInfo.length;j++){
  //       //     if(this.reportReceiptTestInfo[j]["category_name"] === this.distintCategories[i]["category_name"]){
  //       //       lastElementYaxis_ReportInfo = lastElementYaxis_ReportInfo + 5;
  //       //       if(this.reportReceiptTestInfo[j]["SubTest"] === 0 || this.reportReceiptTestInfo[j]["SubTestId"] === 0){
  //       //         doc.text(20, lastElementYaxis_ReportInfo, this.reportReceiptTestInfo[j]["test_name"]);
  //       //       }
  //       //       else{
  //       //         doc.setFontType("normal");
  //       //         doc.text(25, lastElementYaxis_ReportInfo, "- " + this.reportReceiptTestInfo[j]["SubTestName"]);
  //       //       }
              
  //       //     }
  //       //   }
          
          
  //       // }

  //       doc.save('Report.pdf');
  //     }
  //   })
  // }
}
