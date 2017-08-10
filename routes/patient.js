const express = require('express');
const routes = express.Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');
const patient = require('../model/clsPatient');

routes.post('/addPatient',passport.authenticate('jwt', {session: false}), function(req, res, next){
    if(req.user.recordset[0].Role == "RECP")
    {
        patient.patientInfo.PatientId = 0;
        patient.patientInfo.Name = req.body.Name;
        patient.patientInfo.Careof = req.body.Careof;
        patient.patientInfo.Sex = req.body.Sex;
        patient.patientInfo.Age = req.body.Age;
        patient.patientInfo.ContactNo = req.body.ContactNo;
        patient.InsertUpdatePatient(patient.patientInfo, function(err, result){
            if(err) throw err;

            if(result.recordset[0].Result == "Patient Registered Successfully"){
                res.json({success: true, msg: result.recordset[0].Result});    
            }
            else{
                res.json({success: false, msg: result.recordset[0].Result});
            }
        })
    }
    else{        
        res.json({success: false, msg: 'Unauthorized'});
    }
})

routes.post('/addPatientTestInfo',passport.authenticate('jwt', {session: false}), function(req, res, next){
    if(req.user.recordset[0].Role == "RECP")
    {
        var dt = new Date(req.body.TestDate.date["year"] + "-" + req.body.TestDate.date["month"] + "-" + req.body.TestDate.date["day"]);

        patient.patientTestInfo.PatientId = req.body.PatientId;
        patient.patientTestInfo.TestDate = dt;
        patient.patientTestInfo.ReferredBy = req.body.ReferredBy;
        patient.patientTestInfo.SampleReceivedTime = req.body.SampleReceivedTime;
        patient.patientTestInfo.ReportTime = req.body.ReportTime;
        patient.patientTestInfo.TotalFee = req.body.TotalFee;
        patient.patientTestInfo.DoorStepCharges = req.body.DoorStepCharges;
        patient.patientTestInfo.ConcessionAmount = req.body.ConcessionAmount;
        patient.patientTestInfo.ConcessionPercent = req.body.ConcessionPercent;
        patient.patientTestInfo.TotalFeePayable = req.body.TotalFeePayable;
        patient.patientTestInfo.SelectedTest = req.body.SelectedTest;
        
        patient.InsertPatientTestInfo(patient.patientTestInfo, function(err, result){
            if(err) throw err;
            if(result.recordset[0].Result == "Patient Test Information Added Successfully"){
                res.json({success: true, msg: result.recordset[0].Result});    
            }
            else{
                res.json({success: false, msg: result.recordset[0].Result});
            }
        })
    }
    else{        
        res.json({success: false, msg: 'Unauthorized'});
    }
})


routes.get('/searchAllPatient',passport.authenticate('jwt', {session: false}), function(req, res, next){
    if(req.user.recordset[0].Role == "RECP")
    {
        patient.patientInfo.SearchCriteria = req.query.id;
        patient.SearchAllPatients(patient.patientInfo.SearchCriteria, function(err, result){
            if(err) throw err;

            if(result.length == 0){
                res.json({success: false, msg: 'No Record Found'});
            }
            else{
                if(result){
                    res.json({success: true, msg: result});
                }
                else{
                    res.json({success: false, msg: 'Unable to retrieve data'});
                }
            }
        })
    }
    else{        
        res.json({success: false, msg: 'Unauthorized'});
    }
})

routes.get('/GetPatientDetail',passport.authenticate('jwt', {session: false}), function(req, res, next){
    if(req.user.recordset[0].Role == "RECP")
    {
        patient.GetPatientInfoByPatientId(req.query.id, function(err, result){
            if(err) throw err;

            if(result.length == 0){
                res.json({success: false, msg: 'No Record Found'});
            }
            else{
                if(result){
                    res.json({success: true, msg: result});
                }
                else{
                    res.json({success: false, msg: 'Unable to retrieve data'});
                }
            }
        })
    }
    else{        
        res.json({success: false, msg: 'Unauthorized'});
    }
})

routes.get('/GetAll_Category_Test_SubTest',passport.authenticate('jwt', {session: false}), function(req, res, next){
    if(req.user.recordset[0].Role == "RECP")
    {
        patient.GetAll_Category_Test_SubTest(function(err, result){
            if(err) throw err;
            if(result.length == 0){
                res.json({success: false, msg: 'No Record Found'});
            }
            else{
                if(result){
                    res.json({success: true, msg: result.recordsets});
                }
                else{
                    res.json({success: false, msg: 'Unable to retrieve data'});
                }
            }
        })
    }
    else{        
        res.json({success: false, msg: 'Unauthorized'});
    }
})

routes.get('/getPatientTestReceiptData',passport.authenticate('jwt', {session: false}), function(req, res, next){
    if(req.user.recordset[0].Role == "RECP" || req.user.recordset[0].Role == "TECH" || req.user.recordset[0].Role == "OBSV")
    {
        patient.getPatientTestReceiptData(req.query.id, function(err, result){
            if(err) throw err;
            if(result.length == 0){
                res.json({success: false, msg: 'No Record Found'});
            }
            else{
                if(result){
                    res.json({success: true, msg: result.recordsets});
                }
                else{
                    res.json({success: false, msg: 'Unable to retrieve data'});
                }
            }
        })
    }
    else{        
        res.json({success: false, msg: 'Unauthorized'});
    }
})



module.exports = routes;