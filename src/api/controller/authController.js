const passport = require('passport')

const googleLogin = passport.authenticate('google', { // Parte de login, resposabilidade da lib
    scope: ['profile', 'email'] // Informacoes que vao acessar
})

const googleCallback = passport.authenticate('google', { // Aqui eh aonde ele manda o usuario para o local caso de certo ou errado
    successRedirect: '/dashboard',
    failureRedirect: '/login'
})

const logout = (req, res) => { // Desloga
    req.logout()
    res.redirect('/login')
}

module.exports = { googleLogin, googleCallback, logout }  