var config = require('../config/database');
var sql = require('mssql');

module.exports.patientInfo = {
    PatientId: 0,
    Name: "",
    Careof: "",
    Sex: "",
    Age: "",
    ContactNo: "",
    SearchCriteria: ""
}

module.exports.patientTestInfo = {
    PatientId: 0,
    TestDate: null,
    ReferredBy: "",
    SampleReceivedTime: "",
    ReportTime: "",
    TotalFee: 0,
    DoorStepCharges: 0,
    ConcessionAmount: 0,
    ConcessionPercent: 0,
    TotalFeePayable: 0,
    SelectedTest: ""
}

module.exports.InsertUpdatePatient = function(patientInfo, callback){
    var reqPatient = new sql.Request();
    reqPatient.input('PatientId', sql.BigInt, patientInfo.PatientId);
    reqPatient.input('Name', sql.VarChar(200), patientInfo.Name);
    reqPatient.input('Careof', sql.VarChar(200), patientInfo.Careof);
    reqPatient.input('Sex', sql.VarChar(7), patientInfo.Sex);
    reqPatient.input('Age', sql.VarChar(50), patientInfo.Age);
    reqPatient.input('ContactNo', sql.VarChar(20), patientInfo.ContactNo);
    reqPatient.execute('Lab_InsertUpdatePatientInfo', function(err, recordset, returnvalue){
        if(err){
            callback(err, null);
        }else{
            callback(null, recordset);
        }           
    })
}

module.exports.SearchAllPatients = function(SearchCriteria, callback){
    var reqSearch = new sql.Request();
    reqSearch.input('SearchCriteria', sql.VarChar(500), SearchCriteria);
    reqSearch.execute('Lab_SearchAllPatients', function(err, recordset, returnvalue){
        if(err){
            callback(err, null);
        }else{
            callback(null, recordset);
        }           
    })
}

module.exports.GetPatientInfoByPatientId = function(PatientId, callback){
    var reqSearch = new sql.Request();
    reqSearch.input('PatientId', sql.BigInt, PatientId);
    reqSearch.execute('Lab_GetPatientInfoByPatientId', function(err, recordset, returnvalue){
        if(err){
            callback(err, null);
        }else{
            callback(null, recordset);
        }           
    })
}

module.exports.GetAll_Category_Test_SubTest = function(callback){
    var reqTest = new sql.Request();
    reqTest.execute('Lab_GetAll_Category_Test_SubTest', function(err, recordset, returnvalue){
        if(err){
            callback(err, null);
        }else{
            callback(null, recordset);
        }           
    })
}


module.exports.InsertPatientTestInfo = function(patientTestInfo, callback){
    var dt = new Date();
    var reqPatient = new sql.Request();
    reqPatient.input('PatientId', sql.VarChar(50), patientTestInfo.PatientId);
    reqPatient.input('TestDate', sql.DateTime, dt);
    reqPatient.input('ReferredBy', sql.VarChar(200), patientTestInfo.ReferredBy);
    reqPatient.input('SampleReceivedTime', sql.VarChar(50), patientTestInfo.SampleReceivedTime);
    reqPatient.input('ReportTime', sql.VarChar(50), patientTestInfo.ReportTime);
    reqPatient.input('TotalFee', sql.Decimal, patientTestInfo.TotalFee);
    reqPatient.input('DoorStepCharges', sql.Decimal, patientTestInfo.DoorStepCharges);
    reqPatient.input('ConcessionAmount', sql.Decimal, patientTestInfo.ConcessionAmount);
    reqPatient.input('ConcessionPercent', sql.Decimal, patientTestInfo.ConcessionPercent);
    reqPatient.input('FeePaid', sql.Decimal, patientTestInfo.TotalFeePayable);
    reqPatient.input('SelectedTest', sql.VarChar(5000), patientTestInfo.SelectedTest);
    reqPatient.execute('Lab_InsertPatientTestInfo', function(err, recordset, returnvalue){
        if(err){
            callback(err, null);
        }else{
            callback(null, recordset);
        }           
    })
}

module.exports.getPatientTestReceiptData = function(reportId, callback){
    var reqTest = new sql.Request();
    reqTest.input('ReportId', sql.VarChar(50), reportId);
    reqTest.execute('Lab_GetTestReceiptInfo', function(err, recordsets, returnvalue){
        //console.log(recordsets);
        if(err){
            callback(err, null);
        }else{
            callback(null, recordsets);
        }           
    })
}
