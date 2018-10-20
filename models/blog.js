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
    createDate: {type: Date, 'default': Date.now},   
    postDate: {type: String},
    editDate:[{type: String}],
    content: {type: String, required: true},
    tags: [{type: String}],
    headerSettings: {
        headerImg: {type: String},
        size: {type: Number},
        positionX: {type: Number},
        positionY: {type: Number},
        gradient: {type: String}
    },
    titleSettings: {
        fontSize: {type: Number},
        fontTop: {type: Number},
        fontLeft: {type: Number},
        fontColor: {type: String}
    }
    });

module.exports = mongoose.model('Blog', blogSchema);