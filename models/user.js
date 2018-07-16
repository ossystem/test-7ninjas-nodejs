const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    role: {type: String, required: true},
    email: {type: String, required: true, unique : true},
    password: {type: String, required: true},
    token: {type: String, unique:true}
},{
    usePushEach: true
});

const Users = mongoose.model('Users', userSchema);
module.exports = Users;
