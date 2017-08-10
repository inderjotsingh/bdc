var config = require('../config/database');
var sql = require('mssql');
var bcrypt = require('bcrypt');
var uuid = require('uuid-v4');

module.exports.userInfo = {
    UserId: "",
    FirstName: "",
    MiddleName: "",
    LastName: "",
    EmailID: "",
    PhoneNo: "",
    Username: "",
    Password: "",
    Role: "",
    Blocked: false,
};

module.exports.registerUser = function(userInfo, callback){
    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(userInfo.Password, salt, function(err, hash){
            if(err) throw err;
            userInfo.Password = hash;
            userInfo.UserId = uuid();
            var reqRegister = new sql.Request();
            reqRegister.input('UserId', sql.VarChar(128), userInfo.UserId);
            reqRegister.input('FirstName', sql.VarChar(100), userInfo.FirstName);
            reqRegister.input('MiddleName', sql.VarChar(100), userInfo.MiddleName);
            reqRegister.input('LastName', sql.VarChar(100), userInfo.LastName);
            reqRegister.input('EmailID', sql.VarChar(200), userInfo.EmailID);
            reqRegister.input('PhoneNo', sql.VarChar(20), userInfo.PhoneNo);
            reqRegister.input('Username', sql.VarChar(50), userInfo.Username);
            reqRegister.input('Password', sql.VarChar(50), userInfo.Password);
            reqRegister.input('Role', sql.VarChar(20), userInfo.Role);
            reqRegister.input('Blocked', sql.Bit, userInfo.Blocked);
            reqRegister.execute('lab_InsertUpdateUserInfo', function(err, recordset, returnvalue){
                if(err){
                    callback(err, null);
                }else{
                    callback(null, recordset);
                }           
            })
        })
    })
}

//Calling from Passport.js
module.exports.getUserById = function(id, callback){
    var reqUser = new sql.Request();
    reqUser.input('UserId', sql.VarChar(128), id);
    reqUser.execute('lab_GetUserById', function(err, recordset, returnvalue){
        if(err){
            callback(err, null);
        }else{
            callback(null, recordset);
        }
        //res.send(recordset);             
    })
}

module.exports.getUserByUsername = function(username, callback){
    var reqLogin = new sql.Request();
    reqLogin.input('Username', sql.VarChar(128), username);
    reqLogin.execute('lab_GetUserByUsername', function(err, recordset, returnvalue){
        if(err){
            callback(err, null);
        }else{
            callback(null, recordset);
        }
    })
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch){
        callback(null, isMatch);
    })
}

module.exports.GetUserInfo = function(callback){
    var reqUsers = new sql.Request();
    reqUsers.input('UserId', sql.VarChar(128), "0");
    reqUsers.execute('lab_GetUserInfo', function(err, recordset, returnvalue){
        if(err){
            callback(err, null);
        }else{
            callback(null, recordset);
        }
    })
}

module.exports.isUsernameAvailable = function(username, callback){
    var reqUsers = new sql.Request();
    reqUsers.input('UserId', sql.VarChar(128), "0");
    reqUsers.execute('lab_GetUserByUsername', function(err, recordset, returnvalue){
        if(err){
            callback(err, null);
        }else{
            callback(null, recordset);
        }
    })
}

module.exports.updateUserPassword = function(userInfo, callback){
    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(userInfo.Password, salt, function(err, hash){
            if(err) throw err;
            userInfo.Password = hash;
            
            var reqUsers = new sql.Request();
            reqUsers.input('userid', sql.VarChar(50), userInfo.UserId);
            reqUsers.input('password', sql.VarChar(100), userInfo.Password);

            reqUsers.execute('Lab_UpdateUserPassword', function(err, recordset, returnvalue){
                if(err){
                    callback(err, null);
                }else{
                    callback(null, recordset);
                }           
            })


            // db.func('"Lab_UpdateUserPassword"',[userInfo.UserId, userInfo.Password])
            // .then(data => {
            //     callback(null, data);
            // })
            // .catch(error => {
            //     callback(error, null);            
            // });
        })
    })
}