const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const { authenticate } = require('passport/lib')
const User = require('../models/User')


const initializePassport  = function(passport) {

    const authenticateUser = async (accessToken, refreshToken, profile, done) =>{
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value
        }
        try {
            let user = await User.findOne({googleId: profile.id})
            if (user) {
                done(null, user)
            } else {
                user = await User.create(newUser)
                done(null, user)
            }
            
        } catch (err) {
            console.log(err)
            return done(error)
        }
    }

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    }, authenticateUser))

    passport.serializeUser((user,done)=>{
        done(null, user.id)
    })

    passport.deserializeUser( (id,done)=>{
        User.findById(id, (err, user) =>
            done(err, user)
        )
    })

}

module.exports = initializePassport