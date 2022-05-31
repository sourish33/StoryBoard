const bcrypt= require('bcrypt')
const LocalStrategy = require('passport-local').Strategy



const initializePassport =  (passport, getUserByEmail, getUserById) =>{
    const authenticateUser = async (email, password, done) =>{
        console.log('email: '+email)
        console.log('password: '+password)
        const user = await getUserByEmail(email)
        if (user == null){
            console.log('No user with that email')
            return done(null, false, {message: 'No user with that email'})
        }
        try {
           if (await bcrypt.compare(password, user.password)) {
               console.log("the retrieved users pwd is:"+ user.password)
                console.log('Passwords match')
                return done(null, user, {message: "Passwords match"})
           } else{
                console.log("the retrieved users pwd is:"+ user.password)
                console.log('Passwords dont match')
               return done(null, false, {message: "Incorrect password"})
           }
        } catch (error) {
            return done(error)
        }


    }
    passport.use(new LocalStrategy({ 
        usernameField: 'email'
    }, authenticateUser))

    passport.serializeUser((user, done) =>done(null,user._id))

    passport.deserializeUser(async (id, done) => {
        return done(null, await getUserById(id))
    })

}

module.exports = initializePassport