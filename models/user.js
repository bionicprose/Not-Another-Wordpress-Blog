var mongoose = require('mongoose'),
    passportLocalMongoose   = require('passport-local-mongoose');

    var UserSchema = new mongoose.Schema ({
        username: {type: String, required: true, unique: true},
        password: {type: String, required: true, },
        hash: String,
        salt: String,
        role: {type: String, enum:['Admin', 'Writer', 'Commenter'], default: 'Commenter'},
        creation: {type: Date},
        f_name: {type: String},
        l_name: {type: String},
        image: {type: String}

    });

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);