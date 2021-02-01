const jwt = require('jsonwebtoken');

module.exports = {
    issue: (body) => jwt.sign(body, process.env.JWT_SECRET),
    verify: (token) => jwt.decode(token, process.env.JWT_SECRET)
};
module.exports.requireAuth = (req, res, next) => {
    const authToken = req.cookies.auth;
    let p;
    if(!authToken || !(p = module.exports.verify(authToken))) {
        throw new Error('This endpoint requires authentication');
    }
    req.user = p;
    next();
};
