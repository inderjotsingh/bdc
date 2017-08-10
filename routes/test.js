const express = require('express');
const routes = express.Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');
const test = require('../model/clsTest');

const nodemailer = require('nodemailer');

routes.get('/GetPendingTestInfo',passport.authenticate('jwt', {session: false}), function(req, res, next){
    if(req.user.recordset[0].Role == "TECH" || req.user.recordset[0].Role == "OBSV"){
        test.GetPendingTestInfo(req.user.recordset[0].UserId, function(err, result){
            if(err) throw err;
            if(result.length == 0)
            {
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


routes.get('/GetPatientTestInfoByReportId',passport.authenticate('jwt', {session: false}), function(req, res, next){
    if(req.user.recordset[0].Role == "TECH" || req.user.recordset[0].Role == "OBSV"){
        test.GetPatientTestInfoByReportId(req.query.id, function(err, result){
            if(err) throw err;
            if(result.length == 0)
            {
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

routes.post('/UpdateReportInfo_ByTechnician',passport.authenticate('jwt', {session: false}), function(req, res, next){
    if(req.user.recordset[0].Role == "TECH")
    {
        test.patientTestResultInfo.ReportId = req.body.ReportId;
        test.patientTestResultInfo.TestResult = req.body.TestInfo;
        test.UpdateReportInfo_ByTechnician(test.patientTestResultInfo, function(err, result){
            if(err) throw err;
            if(result.recordset[0].Value == "Report successfully forwarded for Verification"){
                res.json({success: true, msg: result.recordset[0].Value});    
            }
            else{
                res.json({success: false, msg: result.recordset[0].Value});
            }
        })
    }
    else{        
        res.json({success: false, msg: 'Unauthorized'});
    }
})

routes.post('/UpdateReportStatus',passport.authenticate('jwt', {session: false}), function(req, res, next){
    if(req.user.recordset[0].Role == "OBSV")
    {
        // var Value = "";
        // test.patientTestResultInfo.ReportId = req.body.ReportId;
        // test.patientTestResultInfo.Status = req.body.Status;
        // test.patientTestResultInfo.TestResult = req.body.Comments;
        // test.UpdateReportStatus(test.patientTestResultInfo, function(err, result){
        //     if(err) throw err;
        //     if(result.recordset[0].Value == "Success"){
        //         if(test.patientTestResultInfo.Status == "OBJ")
        //         {
        //             Value = "Objection(s) successfully forwarded to Lab Technicians."
        //         }
        //         else if(Value == "VER")
        //         {
                    Value = "Report Verified successfully.";

                    //Send Mail
                    let transporter = nodemailer.createTransport({
                        host:'mail.bloodbankbdcnsr.org',
                        port: 587,
                        secure: false,
                        auth: {
                            user: 'info@bloodbankbdcnsr.org',
                            pass: 'pRtz62$7'
                        }
                    });

                    let mailOptions = {
                        from: 'info@bloodbankbdcnsr.org',
                        to: 'inderjotsingh27@gmail.com',
                        subject: 'Testing Node.js email',
                        text: 'Test Mail',
                        html: '<b>Test Mail</b>'
                    };

                    transporter.sendMail(mailOptions, (error, info) =>{
                        if(error){
                            console.log(error);
                        }
                        console.log('Mail Send');
                        //console.log('Message %s send %s', info.messageId, info.response);
                    } )
        //         }

        //         res.json({success: true, msg: Value});    
        //     }
        //     else{
        //         res.json({success: false, msg: result.recordset[0].Value});
        //     }
        // })
    }
    else{        
        res.json({success: false, msg: 'Unauthorized'});
    }
})


routes.get('/PatientTestReportData',passport.authenticate('jwt', {session: false}), function(req, res, next){
    if(req.user.recordset[0].Role == "RECP" || req.user.recordset[0].Role == "TECH" || req.user.recordset[0].Role == "OBSV")
    {
        test.getPatientTestReportData(req.query.id, function(err, result){
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