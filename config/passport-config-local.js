const bcrypt = require("bcrypt")
const LocalStrategy= require("passport-local").Strategy

const initializePassport = (passport, getUserByEmail, getUserById) =>{
    const authenticateUser = async (email, password, done) => {
        console.log("AuthenticateUser speaking!")
        const user = await getUserByEmail(email)
        if (user == null) {
            return done(null, false, {info: 'No user with that email'})
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user, {info: "User exists!"})
            } else{
                return done(null, false, {info: "Incorrect password"})
            }
        } catch (error) {
            return done(error)
        }
    }
    passport.use(new LocalStrategy({
        usernameField: 'email'
    }, authenticateUser))

    passport.serializeUser((user, done)=>done(null, user._id))

    passport.deserializeUser(async (id, done) => {
        return done(null, await getUserById(id))
    })
}

module.exports = initializePassport