var config = require('../config/database');
var sql = require('mssql');

module.exports.patientTestResultInfo = {
    ReportId: 0,
    Status: "",
    TestResult: ""
}

module.exports.GetPendingTestInfo = function(UserId, callback){
    var reqSearch = new sql.Request();
    reqSearch.input('UserId', sql.VarChar(50), UserId);
    reqSearch.execute('Lab_GetPendingTestInfoByUserId', function(err, recordset, returnvalue){
        if(err){
            callback(err, null);
        }else{
            callback(null, recordset);
        }           
    })
}

module.exports.GetPatientTestInfoByReportId = function(ReportId, callback){
    var reqSearch = new sql.Request();
    reqSearch.input('ReportId', sql.VarChar(50), ReportId);
    reqSearch.execute('Lab_GetPatientTestInfoByReportId', function(err, recordsets, returnvalue){
        if(err){
            callback(err, null);
        }else{
            callback(null, recordsets);
        }           
    })
}



module.exports.UpdateReportInfo_ByTechnician = function(patientTestResultInfo, callback){
    var reqPatient = new sql.Request();
    reqPatient.input('ReportId', sql.VarChar(50), patientTestResultInfo.ReportId);
    reqPatient.input('TestResult', sql.VarChar(8000), patientTestResultInfo.TestResult);
    reqPatient.execute('Lab_UpdateReportInfo_ByTechnician', function(err, recordset, returnvalue){
        if(err){
            callback(err, null);
        }else{
            callback(null, recordset);
        }           
    })
}


module.exports.UpdateReportStatus = function(patientTestResultInfo, callback){
    var reqPatient = new sql.Request();
    reqPatient.input('ReportId', sql.VarChar(50), patientTestResultInfo.ReportId);
    reqPatient.input('Status', sql.VarChar(10), patientTestResultInfo.Status);
    reqPatient.input('Comments', sql.VarChar(4000), patientTestResultInfo.TestResult);
    reqPatient.execute('Lab_UpdateReportStatus', function(err, recordset, returnvalue){
        if(err){
            callback(err, null);
        }else{
            callback(null, recordset);
        }           
    })
}


module.exports.getPatientTestReportData = function(reportId, callback){
    var reqTest = new sql.Request();
    reqTest.input('ReportId', sql.VarChar(50), reportId);
    reqTest.execute('Lab_GetTestReportInfo', function(err, recordsets, returnvalue){
        //console.log(recordsets);
        if(err){
            callback(err, null);
        }else{
            callback(null, recordsets);
        }           
    })
}

