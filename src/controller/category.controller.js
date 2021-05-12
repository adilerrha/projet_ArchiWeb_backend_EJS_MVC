const { validationResult } = require('express-validator');
const Category = require('../model/category.model.js');
const Movie = require('../model/movie.model.js');
const { getStates } = require('./state.controller.js');
exports.categoryPage = (req, res) => {
    Movie.findAll((err, results) => {
        if (err) {
            res.status(500).send({ message: "Une erreur interne s'est produite !" });
        } else {
            getStates(req, res, (states) => {
                this.getAllCategories(req, res, (categories) => {
                    let statesMapped = results.flatMap(movie => states.filter(state => state.id == movie.stateID).map(x => x));
                    let categoriesMapped = results.flatMap(movie => categories.filter(category => category.id == movie.categoryID).map(x => x));
                    res.render('categories/category-list', {
                        movies: results,
                        states: statesMapped,
                        categories: categoriesMapped
                    });
                });
            });
        }
    });

}


exports.categoryAddPage = (req, res) => {

    res.render("categories/category-add");
};



/**
 * Ajouter une catégorie
 * @param {*} req 
 * @param {*} res 
 */
exports.addCategory = (req, res) => {
    let { name } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ error: errors.array()[0].msg });
    }
    let category = new Category(name);
    category.save((err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                res.status(409).send({ message: "La catégorie existe déjà !" })
            } else {
                res.status(500).send({ message: "Une erreur interne s'est produite !" })
            }
        } else {
            res.redirect('/category-list');
        }
    });
};

/**
 * Récupérer une catégorie selon son identifiant
 * @param {*} req 
 * @param {*} res 
 */
exports.getCategory = (req, res) => {
    let id = req.params.id;
    Category.findById(req.params.id, (err, result) => {
        if (err) {
            res.status(500).send({ message: "Une erreur interne s'est produite !" })
        } else {
            if (result) {
                res.status(200).send(result);
            } else {
                res.status(404).send({ message: `La catégorie avec l'identifiant ${id} n'existe pas !` });
            }
        }
    })
};

/**
 * Récupérer la liste des catégories
 * @param {*} req 
 * @param {*} res 
 */
exports.getAllCategories = (req, res, cb) => {
    Category.findAll((err, results) => {
        if (err) {
            res.status(500).send({ message: "Une erreur interne s'est produite !" });
        } else {
            cb(results);
            return results;
        }
    })
};

/**
 * Supprimer une catégorie à l'aide de son identifiant
 * @param {*} req 
 * @param {*} res 
 */
exports.deleteCategory = (req, res) => {
    let id = req.params.id;
    Category.delete(id, (err, results) => {
        if (err) {
            res.status(500).send({ message: "Une erreur interne s'est produite !" })
        } else {
            if (results.affectedRows != 0) {
                res.status(200).send({ message: `La catégorie avec l'identifiant ${id} a été supprimé avec succès !` });
            } else {
                res.status(404).send({ message: `La catégorie avec l'identifiant ${id} n'existe pas !` })
            }
        }
    });
}