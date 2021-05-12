module.exports = function(app) {
    const validator = require('./validator.js');
    const movies = require('../controller/movie.controller.js');
    const imageUploader = require("../helpers/image-uploader")

    app.get('/movies/add', movies.movieAddPage);
    app.post('/movies', imageUploader.upload.single('image'), validator.validateMovie, movies.addMovie);
    // app.get('/movies/:id', movies.getMovie);
    app.get('/movies', movies.getAllMovies);
    app.get('/movies/delete/:id', movies.deleteMovie);


    app.get('/movies/edit/:id', movies.movieEditPage);
    app.post('/movies/edit/:id', validator.validateMovie, movies.updateMovie);


    app.post('/api/faker-movies/:qty', movies.fakerMovies);

}