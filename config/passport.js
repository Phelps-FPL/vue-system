const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users')//数据库模型导出的users
const keys = require('./keys');
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport =>{
    passport.use(new JwtStrategy(opts, (jwt_payload, done)=> {
    //    console.log(jwt_payload);
        User.findById(jwt_payload.id)
        .then( user =>{
            if(user){
                return done(null,user);
            }
                return done(null, false);
        })
        .catch(err=> console.log(err));
    }));
}