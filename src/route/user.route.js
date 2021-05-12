module.exports = function(app) {
    const validator = require('./validator.js');
    const users = require('../controller/user.controller.js');

    app.get('/', (req, res) => res.redirect('/login'));
    app.get('/login', (req, res) => {
        res.render('login');
    });
    app.get('/register', (req, res) => {
        res.render('register');
    });
    app.post('/register', validator.validateRegisterUser, users.register);
    app.post('/login', validator.validateLoginUser, users.login);
    app.get('/users/:id', validator.validateLoginUser, users.getUser);

}