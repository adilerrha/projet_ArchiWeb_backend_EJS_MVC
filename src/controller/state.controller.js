const db = require('../configuration/database.config.js');

/**
 * 
 * Récupérer tous les états d'un film
 * @param {*} req 
 * @param {*} res 
 */
exports.getStates = (req, res, cb) => {
    db.query(
        'SELECT * FROM states', (err, results) => {
            if (err) {
                res.status(500).send({ message: "Une erreur interne s'est produite !" });
            } else {
                cb(results);
                return results;
            }
        }
    );
};

/**
 * Récupérer l'état d'un film par son id
 * @param {*} req 
 * @param {*} res 
 */
exports.getState = (req, res, cb) => {
    let { id } = req.params;
    db.query(
        "SELECT * FROM states WHERE id = ?", [id], (err, results) => {
            if (err) {
                res.status(500).send({ message: "Une erreur interne s'est produite !" })
            } else {
                if (results.length != 0) {
                    cb(results[0]);
                    return results[0];
                } else {
                    res.status(404).send({ message: `Le status n'existe pas !` });
                }
            }
        }
    );
};