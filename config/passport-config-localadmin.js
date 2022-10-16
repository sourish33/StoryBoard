const bcrypt= require('bcrypt')
const LocalStrategy = require('passport-local').Strategy



const initializePassport =  (passport, getUserByEmail, getUserById) =>{
    const authenticateUser = async (email, password, done) =>{
        const user = await getUserByEmail(email)
        if (user == null){
            return done(null, false, {message: 'No user with that email'})
        }
        if (user.role!=="admin"){
            return done(null, false, {message: 'This resource is for Administrators only'})
        }
        try {
           if (await bcrypt.compare(password, user.password)) {
                return done(null, user, {message: "Passwords match"})
           } else{
               return done(null, false, {message: "Incorrect password"})
           }
        } catch (error) {
            return done(error)
        }


    }
    passport.use('admin-local',new LocalStrategy({ 
        usernameField: 'email'
    }, authenticateUser))

    passport.serializeUser((user, done) =>done(null,user._id))

    passport.deserializeUser(async (id, done) => {
        return done(null, await getUserById(id))
    })

}

module.exports = initializePassport