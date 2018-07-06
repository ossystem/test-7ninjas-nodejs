const jwt = require('jsonwebtoken');

module.exports = {
    verifyToken: (req, res, next) => {
        const bearer = req.headers['authorization'];
        if (!bearer) return next('forbidden');
        const token = bearer.split(' ')[1];
        if (!token) return next('forbidden');
        req.token = token;
        jwt.verify(req.token, 'secret_key', (err, userData) => {
            if (err) return next(err.message);
            next();
        });
    }
};