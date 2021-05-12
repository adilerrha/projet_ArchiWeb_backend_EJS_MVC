const { validationResult } = require('express-validator');
const Movie = require('../model/movie.model.js');
const fs = require('fs')
const faker = require('faker');
const http = require('http');
const { getStates, getState } = require('./state.controller.js');
const { state } = require('../configuration/database.config.js');
const { getAllCategories } = require('./category.controller.js');


/**
 * Ajouter un film
 * @param {*} req 
 * @param {*} res 
 */
exports.addMovie = (req, res) => {

    if (req.file == undefined) {
        res.status(400).send({
            message: 'Vous devez sélectionner un fichier image !'
        });
    }


    let { title, description, director, releaseYear, duration, stateID, categoryID } = req.body;
    console.log(req.body)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ error: errors.array()[0].msg });
    }
    let { id } = req.session.currentUser;

    let movie = new Movie(title, description, director, releaseYear, duration, stateID, `/uploads/${req.file.filename}`, id, categoryID);
    movie.save((err, result) => {
        if (err) {
            res.status(500).send({ message: "Une erreur interne s'est produite !" });
        } else {
            res.redirect('/movies');
        }
    })
};



/**
 * Récupérer la liste de tous les films
 * @param {*} req 
 * @param {*} res 
 */
exports.getAllMovies = (req, res) => {
    Movie.findAll((err, results) => {
        if (err) {
            res.status(500).send({ message: "Une erreur interne s'est produite !" });
        } else {
            getStates(req, res, (states) => {
                let statesMapped = results.flatMap(movie => states.filter(state => state.id == movie.stateID).map(x => x));
                res.render('movie-list', {
                    movies: results,
                    states: statesMapped
                });
            });

        }
    });
};

/**
 * Récupérer un film à l'aide de son identifiant
 * @param {*} req 
 * @param {*} res 
 */
exports.getMovie = (req, res, cb) => {
    let id = req.params.id;
    Movie.findById(id, (err, result) => {
        if (err) {
            res.status(500).send({ message: "Une erreur interne s'est produite !" })
        } else {
            if (result) {
                cb(result);
                return result;
            } else {
                res.status(404).send({ message: `Le film avec l'identifiant ${id} n'existe pas !` });
            }
        }
    })
};



exports.movieEditPage = (req, res) => {
    this.getMovie(req, res, (movie) => {
        getStates(req, res, (states) => {
            getAllCategories(req, res, (categories) => {
                res.render("movie-edit", {
                    movie: movie,
                    optionsStates: states,
                    optionsCategories: categories
                });
            })

        });
    });
};
exports.movieAddPage = (req, res) => {
    getStates(req, res, (states) => {
        getAllCategories(req, res, (categories) => {
            res.render("movie-add", {
                optionsStates: states,
                optionsCategories: categories
            });
        })
    });
};





/**
 * Modifier un film
 * @param {*} req 
 * @param {*} res 
 */
exports.updateMovie = (req, res) => {
    let { title, description, director, releaseYear, duration, stateID, categoryID } = req.body;

    let id = req.params.id
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ error: errors.array()[0].msg });
    }

    Movie.findById(id, (err, result) => {
        if (err) {
            res.status(500).send({ message: "Une erreur interne s'est produite !" })
        } else {
            if (result) {
                let movie = new Movie(title, description, director, releaseYear, duration, stateID, result.urlImage, result.userID, categoryID);
                movie.update(id, movie, (err, result) => {
                    if (err) {
                        res.status(500).send({ message: "Une erreur interne s'est produite !" });
                    } else {
                        if (result) {
                            res.redirect("/movies");
                        }
                    }
                })
            } else {
                res.status(404).send({ message: `Le film avec l'identifiant ${id} n'existe pas !` })
            }
        }
    });
};

/**
 * 
 * Supprimer un film
 * @param {*} req 
 * @param {*} res 
 */
exports.deleteMovie = (req, res) => {
    let id = req.params.id;

    Movie.findById(id, (err, result) => {
        if (err) {
            res.status(500).send({ message: "Une erreur interne s'est produite !" })
        } else {
            if (result) {
                let movie = result;
                let path = "./src/public" + movie.urlImage;
                fs.unlink(path, (err) => {
                    if (err) {
                        res.status(500).send({ message: "Une erreur interne s'est produite !" })
                    }
                    //console.log("")
                    Movie.delete(movie.id, (err, results) => {
                        if (results.affectedRows != 0) {
                            res.redirect("/movies")
                        }
                    })
                });
            }
        }
    });

};


/**
 * Ajouter des films pour effectuer seulement des tests
 * @param {*} req 
 * @param {*} res  
 */
exports.fakerMovies = (req, res) => {
    let qty = req.params.qty;
    if (qty > 20) {
        return res.status(400).send({
            message: `Vous ne pouvez pas ajouter plus que 20 à la fois !`
        });
    }
    let statesIDs = ['bfe35b03-1f23-40b6-813d-0273293dfeb4', '2f7038d8-98a0-44f9-94bd-81d853d7470b', 'afa84b57-05df-4a2d-8def-51f6b07a9d36'];
    let categoriesIDs = ["dd528c94-4d38-4c57-ae50-ef9504d783e6", "dd528c94-4d38-4c57-ae50-ef9504d783e7", "dd528c94-4d38-4c57-ae50-ef9504d783e8", "dd528c94-4d38-4c57-ae50-ef9504d783e9", "dd528c94-4d38-4c57-ae50-ef9504d78310",
        "dd528c94-4d38-4c57-ae50-ef9504d78311"
    ]
    let i = 0;
    while (i < qty) {
        let state_id = statesIDs[Math.floor(Math.random() * statesIDs.length)];
        let category_id = categoriesIDs[Math.floor(Math.random() * categoriesIDs.length)];
        const path = new Date().getTime();
        const file = fs.createWriteStream(`./src/public/uploads/${path + i}.png`);
        http.get(faker.image.animals(100, 100), function(response) {
            response.pipe(file)
        });
        let movie = new Movie(faker.name.title(), faker.lorem.paragraph(), faker.name.findName(), faker.date.past().getFullYear(), faker.datatype.number(), state_id, `/uploads/${path + i}.png`, 'd7ead69e-56ec-4e4c-bafd-0114ef54260f', category_id);
        movie.save((err, result) => {
            if (err) {
                res.status(500).send({ message: "Une erreur interne s'est produite !" });
            }
        })
        i++;
    }

    res.status(201).send({
        message: `Les ${qty} fausses données ont été effectuées avec succès !`
    });
}