const localStragery = require('passport-local').Strategy

const bcrypt = require('bcryptjs')
const connection = require('./database')

const User = require('../model/User')


module.exports = function(passport) {

    passport.use( new localStragery({usernameField: 'email'}, (email, password, done) => {

        User.findOne( {where: {email: email}} ).then( (user) => {

            if (!user) {

                return done(null, false, {message: 'Esta conta nao existe'})

            } 

            bcrypt.compare(password, user.password, (err, match) => {

                if(match) {

                    return done(null, user)

                } else{
                    
                    return done(null, false, {message: 'senha incorreta'})
                
                }

            })

            
        })
    }))


    passport.serializeUser(function (user, done) {
        console.log('serializing user:', user);
        done(null, user);
    });

    passport.deserializeUser(function (username, done) {
        console.log('deserializing user:', username);
        done(null,username);
    });

}