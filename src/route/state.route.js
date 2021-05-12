module.exports = function(app) {
    const states = require('../controller/state.controller.js');

    app.get('/states', states.getStates);
    app.get('/states/:id', states.getState);
}