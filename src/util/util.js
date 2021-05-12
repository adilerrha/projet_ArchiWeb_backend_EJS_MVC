exports.isAuthenticated = (req) => {
    return req.session && req.session.currentUser;
}