var mongoose = require('mongoose');

var blogSchema = new mongoose.Schema({
    title: {type: String, required: true},
    url: {type: String},
    heroImg: { type: String},
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
    tags: [{type: String}]
});

module.exports = mongoose.model('Blog', blogSchema);