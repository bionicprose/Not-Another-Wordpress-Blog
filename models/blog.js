var mongoose = require('mongoose');

var blogSchema = new mongoose.Schema({
    title: {type: String, required: true},
    url: {type: String},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String,
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    state   : {
            type: String,
            enum:['publish', 'draft'], 
            default: 'publish'
        },    
    postDate: {type: String},
    editDate:[{type: String}],
    content: {type: String, required: true},
    tags: [{type: String}],
    heroSettings: {
        heroImg: {type: String},
        size: {type: String},
        positionX: {type: String},
        positionY: {type: String},
        gradient: {type: String}
    },
    titleSettings: {
        fontSize: {type: String},
        fontTop: {type: String},
        fontLeft: {type: String},
        fontColor: {type: String}
    }
    });

module.exports = mongoose.model('Blog', blogSchema);