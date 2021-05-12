let express = require('express');
let app = express();
let path = require('path');
const cors = require('cors')
const session = require('express-session');
const { isAuthenticated } = require('./util/util.js');

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.use(session({
    secret: 'maSessionSecrete',
    saveUninitialized: true,
    resave: true,
    maxAge: 24 * 60 * 60 * 1000 //24 heures
}));
app.use(express.static(path.join(__dirname, 'public')));

//Router pour EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const corsOptions = {
    origin: 'http://localhost:8080',
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));


//Middleware
app.use((req, res, next) => {
    if (req.path == '/login' || req.path == '/register') {
        if (isAuthenticated(req)) {
            res.redirect('/movies');
        } else {
            next();
        }
    } else {
        if (!isAuthenticated(req)) {
            res.redirect('/login');
        } else {
            next();
        }
    }
})

//Base de donnée
require('./configuration/database.config.js');

//Router
require('./route/user.route.js')(app);
require('./route/category.route.js')(app);
require('./route/state.route.js')(app);
require('./route/movie.route.js')(app);




// Créer le serveur
const PORT = 3000;
var server = app.listen(PORT, function() {
    var host = server.address().address
    var port = server.address().port

    console.log("L'application est sur http://%s:%s", host, port)
})