var mongoose = require('mongoose'),
    bcrypt                  = require('bcrypt-nodejs');


    var userSchema = new mongoose.Schema ({
        pic             : {type: String},

        local           : {
            username    : String,
            email       : String,
            password    : String,
            name        : String,
            pic         : String,
        },
        facebook        : {
            id          : String,
            token       : String,
            name        : String,
            email       : String,
            pic         : String,

        },
        twitter         : {
            id          : String,
            token       : String,
            displayName : String,
            userName    : String,
            pic         : String
        },
        google          : {
            id          : String,
            token       : String,
            email       : String,
            name        : String,
            pic         : String
        },
        role            : { 
            type        : Number, default: 1},
            // 0 = mute, 1 = commenter, 2 = blogger, 3 = admin  
        creationDate: {type: Date},

    });


    /////////methods
    // hash generation

    userSchema.methods.generateHash = function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };

    /// check for password validity

    userSchema.methods.validPassword = function(password) {
        return bcrypt.compareSync(password, this.local.password);
    };

    
     

module.exports = mongoose.model('User', userSchema);