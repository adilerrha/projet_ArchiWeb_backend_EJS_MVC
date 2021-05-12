module.exports = function(app) {
    const validator = require('./validator.js');
    const categories = require('../controller/category.controller.js');

    app.get('/categories/add', categories.categoryAddPage);
    app.get('/category-list', categories.categoryPage);
    app.post('/categories', validator.validateAddCategory, categories.addCategory);
    app.get('/categories/:id', validator.validateCategoryById, categories.getCategory);
    app.get('/categories', categories.getAllCategories);
    app.delete('/categories/:id', validator.validateCategoryById, categories.deleteCategory)

}