var mongoose = require('mongoose');

var blogSchema = new mongoose.Schema({
    title: {type: String, required: true},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String,
    },
    postDate: {type: Date},
    editDate:[{type: Date}],
    content: {type: String, required: true},
    tags: [{type: String}]
});

module.exports = mongoose.model('Blog', blogSchema);