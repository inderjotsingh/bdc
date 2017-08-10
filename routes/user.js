var express = require('express');
var sql = require('mssql');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var routes = express.Router();
var config = require('../config/database');
var User = require('../model/clsUser');
 //passport.authenticate('jwt', {session: false}),
routes.post('/register',  function(req, res, next){
    // if(req.user[0].Role == "ADMN"){
        User.userInfo.FirstName = req.body.FirstName;
        User.userInfo.MiddleName = req.body.MiddleName;
        User.userInfo.LastName = req.body.LastName;
        User.userInfo.PhoneNo = req.body.PhoneNo;
        User.userInfo.EmailID = req.body.EmailID;
        User.userInfo.Username = req.body.Username;
        User.userInfo.Password = req.body.Password;
        User.userInfo.Role = req.body.Role;
        User.userInfo.Blocked = req.body.Blocked;

        User.registerUser(User.userInfo, function(err, result){
            if(err) throw err;
            if(result.recordset[0].Result == "User Registered Successfully"){
                res.json({success: true, msg: result.recordset[0].Result});    
            }
            else{
                res.json({success: false, msg: result.recordset[0].Result});
            }
        })
    // }
    // else{
    //     res.json({success: false, msg: 'Unauthorized'});
    // }
})

routes.post('/checkUserAvailability', function(req, res, next){
    User.getUserByUsername(req.query.id, function(err, result){
        if(err) throw err;
        if(result.recordset.length == 0){
            res.json({success: true, msg: "Available"});    
        }
        else{
            res.json({success: false, msg: "Username already taken"});
        }
    })
})

routes.post('/authenticate', function(req, res, next){
    var username = req.body.Username;
    var password = req.body.Password;
    User.getUserByUsername(username, function(err, user){
        if(err) throw err;
        if(!user){  //user.length == 0
            return res.json({success: false, msg: 'Invalid Username or Password'});
        }
        else{
            User.comparePassword(password, user.recordset[0].Password, function(err, isMatch){
                if(err){
                    throw err;
                }

                if(isMatch){
                    var token = jwt.sign(user.recordset[0], "dsvweg23r23giyf23rhgjbhv", {
                        expiresIn: 604800
                    });
                    
                    res.json({
                        success: true,
                        token: 'JWT ' + token,
                        user: {
                            FirstName: user.recordset[0].FirstName,
                            MiddleName: user.recordset[0].MiddleName,
                            LastName: user.recordset[0].LastName,
                        },
                    });
                }
                else{
                    return res.json({success: false, msg: 'Invalid Password'});
                }
            })
        }
    })
})

routes.get('/GetUserRole', passport.authenticate('jwt', {session: false}), function(req, res, next){
    if(req.user != null){
        res.json({Role: req.user.recordset[0].Role});
    }
})

routes.get('/profile', passport.authenticate('jwt', {session: false}),  function(req, res, next){
    res.json({user: req.user});
})

routes.get('/GetAllUsers', passport.authenticate('jwt', {session: false}), function(req, res, next){
    if(req.user.recordset[0].Role == "ADMN"){
        User.GetUserInfo(function(err, result){
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


routes.post('/validateCurrentPassword', passport.authenticate('jwt', {session:false}), function(req, res, next){
    User.comparePassword(req.body.currentPassword, req.user.recordset[0].Password, function(err, isMatch){
        if(err){
            throw err;
        }
        if(isMatch){
            res.json({success: true, msg: 'Valid'});
        }
        else{
            res.json({success: false, msg: 'Invalid'});
        }

    })
})

routes.post('/changePassword',passport.authenticate('jwt', {session: false}), function(req, res, next){
    User.userInfo.UserId = req.user.recordset[0].UserId;
    User.userInfo.Password = req.body.NewPassword;
    User.updateUserPassword(User.userInfo, function(err, result){
        if(err) throw err;
        if(result.recordset[0].Result == "Password Updated Successfully"){
            res.json({success: true, msg: result.recordset[0].Result});    
        }
        else{
            res.json({success: false, msg: result.recordset[0].Result});
        }
    })
})

module.exports = routes;