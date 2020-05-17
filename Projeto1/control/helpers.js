// checar se é admin

module.exports = {

    isAuth: function(req, res, next) {

        if(req.isAuthenticated()){
            
            return next()

        }

        req.flash('error_msg', 'voce precisa estar logado para essa funcao')

        res.redirect('/')
        
    },

    isAdmin: (req, res, next) => {

        if(req.isAuthenticated() && req.user.admin == 1) {
            return next
        }

        req.flash('error_msg', 'voce precisa ser admin para deletar um item')

        res.redirect('/')

    }
}