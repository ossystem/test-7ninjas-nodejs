const router = require('express').Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bodyParser = require('body-parser');

const User = require('../models/user');

const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.post('/login', urlencodedParser, (req, res, next) => {
    if (!req.body) return next('empty body');
    const user = req.body;
    if (!user.email || !user.password) return next('missing params');
    const password = crypto.pbkdf2Sync(user.password, 'salt', 100000, 512, 'sha512').toString('hex');
    User.findOne({email:user.email, password}, async(error, userInfo) => {
        if (error) return next(error);
        userInfo.token = jwt.sign(user, 'secret_key');
        try {
            await userInfo.save();
            res.send({message:'token updated', token:userInfo.token})
        } catch (error) {
            return next(error);
        }
    });
});

router.post('/register', urlencodedParser, async(req, res, next) => {
    if (!req.body) return next('empty body');
    const user = req.body;
    if (!user.email || !user.password || !user.role || !user.name) return next('missing params');
    // Todo additional check for user with role admin
    const password = crypto.pbkdf2Sync(user.password, 'salt', 100000, 512, 'sha512').toString('hex');
    const newUser = new User({...user, password});
    try {
        await newUser.save();
        res.send({message:'user saved'})
    } catch (error) {
        return next(error);
    }

});

module.exports = router;