import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { UsermanagementService } from '../usermanagement/usermanagement.service';

@Injectable()
export class PatientinfoService {
  patientInfo = [];
  constructor(
    private http: Http,
    private usermanagementService: UsermanagementService
  ) { }

  insertPatient(patientInfo){
    let headers = new Headers();
    this.usermanagementService.loadToken();
    headers.append('Authorization',this.usermanagementService.authToken);
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/patient/addPatient', patientInfo, {headers: headers}).map(res=>res.json());
  }

  SearchAllPatient(SearchCriteria){
    let headers = new Headers();
    this.usermanagementService.loadToken();
    headers.append('Authorization',this.usermanagementService.authToken);
    headers.append('Content-Type','application/json');
    return this.http.get('http://localhost:3000/patient/searchAllPatient?id=' + SearchCriteria , {headers: headers}).map(res=>res.json());
  }

  GetPatientDetail(PatientId){
    let headers = new Headers();
    this.usermanagementService.loadToken();
    headers.append('Authorization',this.usermanagementService.authToken);
    headers.append('Content-Type','application/json');
    return this.http.get('http://localhost:3000/patient/GetPatientDetail?id=' + PatientId , {headers: headers}).map(res=>res.json());
  }

  GetAll_Category_Test_SubTest(){
    let headers = new Headers();
    this.usermanagementService.loadToken();
    headers.append('Authorization',this.usermanagementService.authToken);
    headers.append('Content-Type','application/json');
    return this.http.get('http://localhost:3000/patient/GetAll_Category_Test_SubTest', {headers: headers}).map(res=>res.json());
  }

  insertPatientTestInfo(patientTestInfo){
    let headers = new Headers();
    this.usermanagementService.loadToken();
    headers.append('Authorization',this.usermanagementService.authToken);
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/patient/addPatientTestInfo', patientTestInfo, {headers: headers}).map(res=>res.json());
  }

  getPatientTestReceiptData(reportId){
    let headers = new Headers();
    this.usermanagementService.loadToken();
    headers.append('Authorization',this.usermanagementService.authToken);
    headers.append('Content-Type','application/json');
    return this.http.get('http://localhost:3000/patient/getPatientTestReceiptData?id=' + reportId, {headers: headers}).map(res=>res.json());
  }
}
