module.exports = function(app) {
    const validator = require('./validator.js');
    const categories = require('../controller/category.controller.js');

    app.get('/category-list', (req, res) => {
        res.render('category-list');
    });

    app.post('/categories', validator.validateAddCategory, categories.addCategory);
    app.get('/categories/:id', validator.validateCategoryById, categories.getCategory);
    app.get('/categories', categories.getAllCategories);
    app.delete('/categories/:id', validator.validateCategoryById, categories.deleteCategory)

}