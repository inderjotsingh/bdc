import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { UsermanagementService } from '../usermanagement/usermanagement.service';

@Injectable()
export class TestinfoService {
  testInfo: any;

  constructor(
    private http: Http,
    private usermanagementService: UsermanagementService
  ) { }

  GetPendingTestInfo(){
    let headers = new Headers();
    this.usermanagementService.loadToken();
    headers.append('Authorization',this.usermanagementService.authToken);
    headers.append('Content-Type','application/json');
    return this.http.get('http://localhost:3000/test/GetPendingTestInfo', {headers: headers}).map(res => res.json());
  }

  GetPatientTestInfoByReportId(ReportId){
    let headers = new Headers();
    this.usermanagementService.loadToken();
    headers.append('Authorization',this.usermanagementService.authToken);
    headers.append('Content-Type','application/json');
    return this.http.get('http://localhost:3000/test/GetPatientTestInfoByReportId?id=' + ReportId, {headers: headers}).map(res => res.json());
  }

  UpdateReportInfo(patientTestInfo){
    let headers = new Headers();
    this.usermanagementService.loadToken();
    headers.append('Authorization',this.usermanagementService.authToken);
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/test/UpdateReportInfo_ByTechnician', patientTestInfo, {headers: headers}).map(res=>res.json());
  }

  UpdateReportStatus(TestReportInfo){
    let headers = new Headers();
    this.usermanagementService.loadToken();
    headers.append('Authorization',this.usermanagementService.authToken);
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/test/UpdateReportStatus', TestReportInfo, {headers: headers}).map(res=>res.json());
  }

  getPatientTestReportData(reportId){
    let headers = new Headers();
    this.usermanagementService.loadToken();
    headers.append('Authorization',this.usermanagementService.authToken);
    headers.append('Content-Type','application/json');
    return this.http.get('http://localhost:3000/test/PatientTestReportData?id=' + reportId, {headers: headers}).map(res=>res.json());
  }

}
