var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    id: String,
    username: String,
    password: String,
    email: {type: String}
});

module.exports = mongoose.model('User', UserSchema);