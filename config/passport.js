var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('../model/clsUser');

module.exports = function(passport){
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
    opts.secretOrKey = "dsvweg23r23giyf23rhgjbhv";
    passport.use(new JwtStrategy(opts, function(jwt_payload, done){
        User.getUserById(jwt_payload.UserId, function(err, user){
            if(err){
                return done(err, false);
            }
            
            if(user){
                return done(null, user)
            }
            else{
                return done(null, false);
            }
        });
    }))
}