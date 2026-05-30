const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const UserService = require('../service/userService')

const userService = new UserService()

passport.use(new GoogleStrategy({ // Passar a config
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  process.env.GOOGLE_CALLBACK_URL
},async (accessToken, refreshToken, profile, cb) => {
    try {
        const user = await userService.findOrCreate(profile) // Faz o trabalho no Service com o profile
        return cb(null, user) // Retorna se deu certo o usuario
    } catch (error) {
        return cb(error)
    }
}
))

passport.serializeUser((user, cb) => cb(null, user._id)) // Salva na sessao apenas o id, para nao ficar tao exposto, serealiza
// Aqui fica no "navegador" o login

passport.deserializeUser(async(id, cb) => { // Vai retornar o perfil inteiro e usa na req.user
    try{ 
        const user = await userService.busca({_id: id})
        return cb(null, user[0])
    }catch(error){
        return cb(error)
    }
}) // Para buscar no DB