var mongoose = require('mongoose'),
    // passportLocalMongoose   = require('passport-local-mongoose'),
    bcrypt                  = require('bcrypt-nodejs');


    var userSchema = new mongoose.Schema ({

        local           : {
            email       : String,
            password    : String
        },
        facebook        : {
            id          : String,
            token       : String,
            name        : String,
            email       : String
        },
        twitter         : {
            id          : String,
            token       : String,
            displayName : String,
            userName    : String
        },
        google          : {
            id          : String,
            token       : String,
            email       : String,
            name        : String
        }

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

    
        // username: {type: String, required: true, index: { unique: true} },
        // password: {type: String, required: true },
        // loginAttempts: { type: Number, required: true, default: 0 },
        // lockUntil: {type: Number}
        // email: {type: String, required: true, unique: true},
        // hash: String,
        // salt: String,
        // role: {type: String, enum:['Admin', 'Writer', 'Commenter', 'Mute'], default: 'Commenter'},
        // creationDate: {type: Date},
        // f_name: {type: String},
        // l_name: {type: String},
        // image: {type: String},
        // bio: {type: String},
        
        // blogPost: [
        //     {
        //         type: mongoose.Schema.Types.ObjectId,
        //         ref: 'Blog'
        //     }
                    
        // ],

        // comments: [
        //     {
        //         type: mongoose.Schema.Types.ObjectId,
        //         ref: 'Comment'
        //     }
        // ]

    // });

   

// userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);